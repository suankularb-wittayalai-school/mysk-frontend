import { PostgrestError } from "@supabase/supabase-js";
import { supabase } from "@utils/supabaseClient";
import { SubjectTable } from "@utils/types/database/subject";
import { Subject } from "@utils/types/subject";

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
      name_en: subject.name["en-US"].name,
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
      short_name_en: subject.name["en-US"].shortName,
      short_name_th: subject.name.th.shortName,
    });
  if (subjectCreationError || !subject) {
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
  // console.log(`${subject.id}/syllabus.pdf`, subject.syllabus);

  if (subject.syllabus) {
    const { data: syllabus, error: uploadingError } = await supabase.storage
      .from("syllabus")
      .update(`${subject.id}/syllabus.pdf`, subject.syllabus, {
        cacheControl: "3600",
        upsert: false,
      });
    if (uploadingError) {
      console.error(uploadingError);
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
    // console.log(syllabus);
  }

  const { data: editedSubject, error: subjectEditionError } = await supabase
    .from<SubjectTable>("subject")
    .update({
      name_th: subject.name.th.name,
      name_en: subject.name["en-US"].name,
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
      short_name_en: subject.name["en-US"].shortName,
      short_name_th: subject.name.th.shortName,
    })
    .match({ id: subject.id });

  if (subjectEditionError || !subject) {
    console.error(subjectEditionError);
    return { data: null, error: subjectEditionError };
  }
  return { data: editedSubject, error: null };
}
