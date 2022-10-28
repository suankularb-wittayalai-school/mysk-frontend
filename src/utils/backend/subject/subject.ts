import { PostgrestError } from "@supabase/supabase-js";
import { supabase } from "@utils/supabaseClient";
import { ClassWNumber } from "@utils/types/class";
import { RoomSubjectDB, SubjectTable } from "@utils/types/database/subject";
import {
  ImportedSubjectData,
  Subject,
  SubjectName,
  SubjectWNameAndCode,
} from "@utils/types/subject";

const subjectGroupMap = {
  "วิทยาศาสตร์ และเทคโนโลยี": 1,
  คณิตศาสตร์: 2,
  ภาษาต่างประเทศ: 3,
  ภาษาไทย: 4,
  "สุขศึกษา และพลศึกษา": 5,
  การงานอาชีพ: 6,
  ศิลปะ: 7,
  "สังคมศึกษา ศาสนา และวัฒนธรรม": 8,
  กิจกรรมพัฒนาผู้เรียน: 9,
  อาจารย์พิเศษ: 10,
} as const;

const subjectTypeMap = {
  รายวิชาพื้นฐาน: "Core Courses",
  รายวิชาเพิ่มเติม: "Additional Courses",
  รายวิชาเลือก: "Elective Courses",
  กิจกรรมพัฒนาผู้เรียน: "Learner’s Development Activities",
} as const;

export async function deleteSubject(subject: Subject) {
  // Delete the syllabus if it exists
  if (subject.syllabus) {
    const { data: syllabus, error: syllabusError } = await supabase.storage
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
    .from<RoomSubjectDB>("room_subjects")
    .select("*, subject:subject(*), classroom:class(*)")
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
            shortName: roomSubject.subject.short_name_en,
          },
          th: {
            name: roomSubject.subject.name_th,
            shortName: roomSubject.subject.short_name_th,
          },
        },
        code: {
          "en-US": roomSubject.subject.code_en,
          th: roomSubject.subject.code_th,
        },
        classes: [
          {
            id: roomSubject.classroom.id,
            number: roomSubject.classroom.number,
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

export async function createSubject(
  subject: Subject
): Promise<{ data: SubjectTable[] | null; error: PostgrestError | null }> {
  if (typeof subject.syllabus === "string") {
    return {
      data: null,
      error: {
        message: "syllabus must be a buffer",
        details: "",
        hint: "",
        code: "",
      },
    };
  }

  const { data: createdSubject, error: subjectCreationError } = await supabase
    .from<SubjectTable>("subject")
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
    });
  if (subjectCreationError || !createdSubject) {
    console.error(subjectCreationError);
    return { data: null, error: subjectCreationError };
  }

  if (subject.syllabus) {
    const { data: syllabus, error: uploadingError } = await supabase.storage
      .from("syllabus")
      .upload(`${createdSubject[0].id}/syllabus.pdf`, subject.syllabus, {
        cacheControl: "3600",
        upsert: false,
      });
    if (uploadingError) {
      return {
        data: null,
        error: {
          message: "syllabus upload failed",
          details: "",
          hint: "",
          code: "",
        },
      };
    }

    await supabase
      .from<SubjectTable>("subject")
      .update({ syllabus: `${createdSubject[0].id}/syllabus.pdf` })
      .match({ id: createdSubject[0].id });
  }

  return { data: createdSubject, error: null };
}

export async function editSubject(
  subject: Subject
): Promise<{ data: SubjectTable[] | null; error: PostgrestError | null }> {
  // if (typeof subject.syllabus === "string") {
  //   return {
  //     data: null,
  //     error: {
  //       message: "syllabus must be a buffer",
  //       details: "",
  //       hint: "",
  //       code: "",
  //     },
  //   };
  // }
  // console.log(`${subject.id}/syllabus.pdf`, subject.syllabus);
  // console.log(subject.syllabus);
  if (subject.syllabus) {
    const { data: syllabus, error: uploadingError } = await supabase.storage
      .from("syllabus")
      .update(`${subject.id}/syllabus.pdf`, subject.syllabus, {
        cacheControl: "3600",
        upsert: false,
      });
    if (uploadingError) {
      console.error(uploadingError);
      // return {
      //   data: null,
      //   error: {
      //     message: "syllabus upload failed",
      //     details: "",
      //     hint: "",
      //     code: "",
      //   },
      // };
    }
    // console.log(syllabus);
  }

  const { data: editedSubject, error: subjectEditionError } = await supabase
    .from<SubjectTable>("subject")
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

  if (subjectEditionError || !subject) {
    console.error(subjectEditionError);
    return { data: null, error: subjectEditionError };
  }
  return { data: editedSubject, error: null };
}
