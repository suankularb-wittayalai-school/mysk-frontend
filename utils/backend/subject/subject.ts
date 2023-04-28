// Supabase
import { supabase } from "@/utils/supabase-client";

// Backend
import { db2Subject } from "@/utils/backend/database";

// Types
import {
  BackendCountedDataReturn,
  BackendDataReturn,
  BackendReturn,
  DatabaseClient,
  OrUndefined,
} from "@/utils/types/common";
import {
  ImportedSubjectData,
  Subject,
  SubjectName,
  SubjectTypeEN,
  SubjectWNameAndCode,
  TeacherSubjectItem,
} from "@/utils/types/subject";

// Miscelleneous
import { subjectGroupMap, subjectTypeMap } from "@/utils/maps";
import { SortingState } from "@tanstack/react-table";

export async function deleteSubject(subject: Subject) {
  // Delete the syllabus if it exists
  if (subject.syllabus) {
    const { error: syllabusError } = await supabase.storage
      .from("syllabus")
      .remove([subject.syllabus.toString()]);
    if (syllabusError) console.error(syllabusError);
  }

  // Delete the subject
  const { error } = await supabase
    .from("subject")
    .delete()
    .match({ id: subject.id });
  if (error) console.error(error);
}

export async function importSubjects(data: ImportedSubjectData[]) {
  const subjects: Subject[] = data.map((subject) => ({
    id: 0,
    code: {
      th: subject.code_th,
      "en-US": subject.code_en,
    },
    name: {
      th: {
        name: subject.name_th,
        shortName: subject.short_name_th,
      },
      "en-US": {
        name: subject.name_en,
        shortName: subject.short_name_en,
      },
    },
    type: {
      th: subject.type,
      "en-US": subjectTypeMap[subject.type] as SubjectTypeEN,
    },
    subjectGroup: {
      id: subjectGroupMap[subject.group],
      name: {
        th: subject.group,
        "en-US": subject.group,
      },
    },
    credit: subject.credit,
    description: {
      th: subject.description_th ? subject.description_th : "",
      "en-US": subject.description_en ? subject.description_en : "",
    },
    year: subject.year,
    semester: subject.semester,
    syllabus: null,
    teachers: [],
  }));

  await Promise.all(subjects.map(createSubject));
}

export async function getAdminSubjectList(
  supabase: DatabaseClient,
  page: number,
  rowsPerPage: number,
  query?: string,
  sorting?: SortingState
): Promise<BackendCountedDataReturn<Subject[]>> {
  const { data, count, error } = await supabase
    .from("subject")
    .select("*", { count: "exact" })
    .or(
      [
        `code_th.like.%${query || ""}%`,
        `name_th.like.%${query || ""}%`,
        `code_en.ilike.%${query || ""}%`,
        `name_en.ilike.%${query || ""}%`,
        query &&
          /^[1-9][0-9]{3}$/.test(query) &&
          `year.eq.${query}, year.eq.${Number(query) - 543}`,
        query && ["1", "2"].includes(query) && `semester.eq.${query}`,
      ]
        .filter((segment) => segment)
        .join(",")
    )
    .order(
      (sorting?.length
        ? {
            codeTH: "code_th",
            nameTH: "name_th",
            codeEN: "code_en",
            nameEN: "name_en",
          }[sorting[0].id]!
        : "code_th") as "code_th" | "name_th" | "code_en" | "name_en",
      { ascending: !sorting?.[0].desc }
    )
    .order("semester")
    .order("year")
    .range(rowsPerPage * (page - 1), rowsPerPage * page - 1);

  if (error) {
    console.error(error);
    return { data: [], count: 0, error };
  }

  return {
    data: await Promise.all(
      data!.map(async (subject) => await db2Subject(supabase, subject))
    ),
    count: count!,
    error: null,
  };
}

export async function getSubjectsInCharge(
  supabase: DatabaseClient,
  teacherID: number
): Promise<BackendDataReturn<SubjectWNameAndCode[]>> {
  const { data, error } = await supabase
    .from("subject")
    .select(
      "id, code_th, code_en, name_th, name_en, short_name_th, short_name_en"
    )
    .contains("teachers", [teacherID]);

  if (error) {
    console.error(error);
    return { data: [], error };
  }

  return {
    data: data.map((subject) => ({
      id: subject.id,
      code: {
        "en-US": subject.code_en,
        th: subject.code_th,
      },
      name: {
        "en-US": {
          name: subject.name_en,
          shortName: subject.short_name_en as OrUndefined<string>,
        },
        th: {
          name: subject.name_th,
          shortName: subject.short_name_th as OrUndefined<string>,
        },
      },
    })),
    error: null,
  };
}

export async function getTeachingSubjects(
  supabase: DatabaseClient,
  teacherID: number
): Promise<BackendDataReturn<TeacherSubjectItem[]>> {
  const { data: roomSubjects, error } = await supabase
    .from("room_subjects")
    .select("*, subject:subject(*), class(*)")
    .contains("teacher", [teacherID]);

  if (error) {
    console.error(error);
    return { data: [], error };
  }

  const subjects: TeacherSubjectItem[] = await Promise.all(
    roomSubjects!.map(async (roomSubject) => {
      const subject: TeacherSubjectItem = {
        id: roomSubject.subject.id,
        subject: {
          name: {
            "en-US": {
              name: roomSubject.subject.name_en,
              shortName: roomSubject.subject
                .short_name_en as OrUndefined<string>,
            },
            th: {
              name: roomSubject.subject.name_th,
              shortName: roomSubject.subject
                .short_name_th as OrUndefined<string>,
            },
          },
          code: {
            "en-US": roomSubject.subject.code_en,
            th: roomSubject.subject.code_th,
          },
        },
        classes: [
          {
            id: roomSubject.class.id,
            number: roomSubject.class.number,
          },
        ],
      };
      return subject;
    })
  );

  // Merge classes array of subjects with same ID
  const subjectsWithClasses = subjects.reduce((acc, subject) => {
    const existing = acc.find((s) => s.id === subject.id);
    if (existing) existing.classes = [...existing.classes, ...subject.classes];
    else acc.push(subject);
    return acc;
  }, [] as TeacherSubjectItem[]);

  return { data: subjectsWithClasses, error: null };
}

export async function createSubject(subject: Subject): Promise<BackendReturn> {
  if (typeof subject.syllabus === "string") {
    return { error: { message: "syllabus must be a buffer" } };
  }

  const { data: createdSubject, error: subjectCreationError } = await supabase
    .from("subject")
    .insert({
      name_th: subject.name.th.name,
      name_en: (subject.name["en-US"] as SubjectName).name,
      code_th: subject.code.th,
      code_en: subject.code["en-US"],
      type_th: subject.type.th,
      type_en: subject.type["en-US"],
      description_th: subject.description?.th,
      description_en: subject.description
        ? subject.description["en-US"]
        : undefined,
      year: subject.year,
      semester: subject.semester,
      group: subject.subjectGroup.id,
      credit: subject.credit,
      teachers: subject.teachers.map((teacher) => teacher.id),
      coTeachers: subject.coTeachers?.map((teacher) => teacher.id),
      short_name_en: (subject.name["en-US"] as SubjectName).shortName,
      short_name_th: subject.name.th.shortName,
    })
    .select("id")
    .single();

  if (subjectCreationError) {
    console.error(subjectCreationError);
    return { error: subjectCreationError };
  }

  if (subject.syllabus) {
    const { error: uploadingError } = await supabase.storage
      .from("syllabus")
      .upload(`${createdSubject!.id}/syllabus.pdf`, subject.syllabus, {
        cacheControl: "3600",
        upsert: false,
      });
    if (uploadingError) {
      return { error: { message: "syllabus upload failed." } };
    }

    await supabase
      .from("subject")
      .update({ syllabus: `${createdSubject!.id}/syllabus.pdf` })
      .match({ id: createdSubject!.id });
  }

  return { error: null };
}

export async function editSubject(subject: Subject): Promise<BackendReturn> {
  if (typeof subject.syllabus === "string") {
    return { error: { message: "syllabus must be a buffer" } };
  }
  // console.log(`${subject.id}/syllabus.pdf`, subject.syllabus);
  // console.log(subject.syllabus);
  if (subject.syllabus) {
    const { error: uploadingError } = await supabase.storage
      .from("syllabus")
      .update(`${subject.id}/syllabus.pdf`, subject.syllabus, {
        cacheControl: "3600",
        upsert: false,
      });
    if (uploadingError) {
      console.error(uploadingError);
      return { error: { message: "syllabus upload failed" } };
    }
    // console.log(syllabus);
  }

  const { error: subjectEditionError } = await supabase
    .from("subject")
    .update({
      name_th: subject.name.th.name,
      name_en: (subject.name["en-US"] as SubjectName).name,
      code_th: subject.code.th,
      code_en: subject.code["en-US"],
      type_th: subject.type.th,
      type_en: subject.type["en-US"],
      description_th: subject.description?.th,
      description_en: subject.description
        ? subject.description["en-US"]
        : undefined,
      year: subject.year,
      semester: subject.semester,
      group: subject.subjectGroup.id,
      syllabus: subject.syllabus ? `${subject.id}/syllabus.pdf` : undefined,
      credit: subject.credit,
      teachers: subject.teachers.map((teacher) => teacher.id),
      coTeachers: subject.coTeachers?.map((teacher) => teacher.id),
      short_name_en: (subject.name["en-US"] as SubjectName).shortName,
      short_name_th: subject.name.th.shortName,
    })
    .match({ id: subject.id });

  if (subjectEditionError) {
    console.error(subjectEditionError);
    return { error: subjectEditionError };
  }
  return { error: null };
}
