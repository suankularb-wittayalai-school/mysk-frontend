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

  if (subject.syllabus) {
    const { data: syllabus, error: uploadingError } = await supabase.storage
      .from("syllabus")
      .upload(`${subject.code.th}/syllabus.pdf`, subject.syllabus, {
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
      syllabus: `${subject.code.th}/syllabus.pdf`,
      credit: subject.credit,
      teachers: subject.teachers.map((teacher) => teacher.id),
      coTeachers: subject.coTeachers?.map((teacher) => teacher.id),
    });
  if (subjectCreationError || !subject) {
    console.error(subjectCreationError);
    return { data: null, error: subjectCreationError };
  }
  return { data: createdSubject, error: null };
}
