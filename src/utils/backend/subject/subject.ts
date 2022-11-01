// External libraries
import { PostgrestError } from "@supabase/supabase-js";

// Supabase
import { supabase } from "@utils/supabase-client";

// Types
import { ClassWNumber } from "@utils/types/class";
import { SubjectTable } from "@utils/types/database/subject";
import {
  ImportedSubjectData,
  Subject,
  SubjectName,
  SubjectWNameAndCode,
} from "@utils/types/subject";

// Miscelleneous
import { subjectGroupMap, subjectTypeMap } from "@utils/maps";
import {
  BackendDataReturn,
  BackendReturn,
  OrUndefined,
} from "@utils/types/common";

export async function deleteSubject(subject: Subject) {
  // Delete the syllabus if it exists
  if (subject.syllabus) {
    const { error: syllabusError } = await supabase.storage
      .from("syllabus")
      .remove([subject.syllabus.toString()]);
    if (syllabusError) console.error(syllabusError);
  }

  // Delete the subject
  const { data, error } = await supabase
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
      "en-US": subjectTypeMap[subject.type],
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

  await Promise.all(
    subjects.map(async (subject) => await createSubject(subject))
  );
}

export async function getTeachingSubjects(
  teacherID: number
): Promise<(SubjectWNameAndCode & { classes: ClassWNumber[] })[]> {
  const { data: roomSubjects, error } = await supabase
    .from("room_subjects")
    .select("*, subject:subject(*), class(*)")
    .contains("teacher", [teacherID]);

  if (error || !roomSubjects) {
    console.error(error);
    return [];
  }

  const subjects: (SubjectWNameAndCode & {
    classes: ClassWNumber[];
  })[] = await Promise.all(
    roomSubjects.map(async (roomSubject) => {
      const subject: SubjectWNameAndCode & { classes: ClassWNumber[] } = {
        id: roomSubject.subject.id,
        name: {
          "en-US": {
            name: roomSubject.subject.name_en,
            shortName: roomSubject.subject.short_name_en as OrUndefined<string>,
          },
          th: {
            name: roomSubject.subject.name_th,
            shortName: roomSubject.subject.short_name_th as OrUndefined<string>,
          },
        },
        code: {
          "en-US": roomSubject.subject.code_en,
          th: roomSubject.subject.code_th,
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
  // merge classes array of subjects with same id
  const subjectsWithClasses = subjects.reduce((acc, subject) => {
    const existing = acc.find((s) => s.id === subject.id);
    if (existing) {
      existing.classes = [...existing.classes, ...subject.classes];
    } else {
      acc.push(subject);
    }
    return acc;
  }, [] as (SubjectWNameAndCode & { classes: ClassWNumber[] })[]);

  return subjectsWithClasses;
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

  if (subjectCreationError || !createdSubject) {
    console.error(subjectCreationError);
    return { error: subjectCreationError };
  }

  if (subject.syllabus) {
    const { error: uploadingError } = await supabase.storage
      .from("syllabus")
      .upload(`${createdSubject.id}/syllabus.pdf`, subject.syllabus, {
        cacheControl: "3600",
        upsert: false,
      });
    if (uploadingError) {
      return { error: { message: "syllabus upload failed" } };
    }

    await supabase
      .from("subject")
      .update({ syllabus: `${createdSubject.id}/syllabus.pdf` })
      .match({ id: createdSubject.id });
  }

  return { error: null };
}

export async function editSubject(subject: Subject): Promise<BackendReturn> {
  if (typeof subject.syllabus === "string") {
    return { error: { message: "syllabus must be a buffer" } };
  }
  // console.log(`${subject.id}/syllabus.pdf`, subject.syllabus);

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

  const { data: editedSubject, error: subjectEditionError } = await supabase
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
      syllabus: `${subject.id}/syllabus.pdf`,
      credit: subject.credit,
      teachers: subject.teachers.map((teacher) => teacher.id),
      coTeachers: subject.coTeachers?.map((teacher) => teacher.id),
      short_name_en: (subject.name["en-US"] as SubjectName).shortName,
      short_name_th: subject.name.th.shortName,
    })
    .match({ id: subject.id });

  if (subjectEditionError || !subject) {
    console.error(subjectEditionError);
    return { error: subjectEditionError };
  }
  return { error: null };
}
