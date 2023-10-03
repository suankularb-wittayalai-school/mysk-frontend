import getCurrentAcademicYear from "@/utils/helpers/getCurrentAcademicYear";
import logError from "@/utils/helpers/logError";
import mergeDBLocales from "@/utils/helpers/mergeDBLocales";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { Teacher } from "@/utils/types/person";

export async function getTeacherByID(
  supabase: DatabaseClient,
  teacherID: string,
  options?: Partial<{
    detailed: boolean;
    includeContacts: boolean;
    year: number;
  }>,
): Promise<BackendReturn<Teacher>> {
  let { data: teacherData, error: studentError } = await supabase
    .from("teachers")
    .select(
      `*,
      people(*, person_contacts(contacts(*)), person_allergies(allergy_name)),
      classroom_advisors(classrooms!inner(id, number)),
      subject_groups(id, name_en, name_th),
      subject_teachers(
        subjects!inner(id, name_en, name_th, code_en, code_th, short_name_en, short_name_th)
      )`,
    )
    .eq("id", teacherID)
    .eq("classroom_advisors.classrooms.year", getCurrentAcademicYear())
    .eq("subject_teachers.year", options?.year ?? getCurrentAcademicYear())
    .single();

  if (studentError) {
    logError("getTeacherByID (teachers)", studentError);
    return { data: null, error: studentError };
  }

  let teacher: Teacher = {
    id: teacherData!.id,
    prefix: mergeDBLocales(teacherData!.people, "prefix"),
    first_name: mergeDBLocales(teacherData!.people, "first_name"),
    last_name: mergeDBLocales(teacherData!.people, "last_name"),
    nickname: mergeDBLocales(teacherData!.people, "nickname"),
    middle_name: mergeDBLocales(teacherData!.people, "middle_name"),
    teacher_id: teacherData!.teacher_id,
    class_advisor_at:
      teacherData!.classroom_advisors.length > 0
        ? {
            id: teacherData!.classroom_advisors[0].classrooms!.id,
            number: teacherData!.classroom_advisors[0].classrooms!.number,
          }
        : null,
    contacts: options?.includeContacts
      ? teacherData!.people!.person_contacts.map((contacts) => {
          const { contacts: contact } = contacts;
          return {
            id: contact!.id,
            type: contact!.type,
            value: contact!.value,
            name: mergeDBLocales(contact!, "name"),
            include_parents: contact!.include_parents,
            include_students: contact!.include_students,
            include_teachers: contact!.include_teachers,
          };
        })
      : [],
    allergies: options?.detailed
      ? teacherData!.people!.person_allergies.map(
          (allergies) => allergies.allergy_name,
        )
      : null,
    profile: teacherData!.people?.profile ?? null,
    citizen_id: options?.detailed
      ? teacherData!.people?.citizen_id ?? null
      : null,
    shirt_size: options?.detailed
      ? teacherData!.people?.shirt_size ?? null
      : null,
    subject_group: {
      id: teacherData!.subject_groups!.id,
      name: mergeDBLocales(teacherData!.subject_groups, "name"),
    },
    subjects_in_charge: options?.detailed
      ? teacherData!.subject_teachers.map((subject) => ({
          id: subject.subjects!.id,
          name: mergeDBLocales(subject.subjects, "name"),
          code: mergeDBLocales(subject.subjects, "code"),
          short_name: mergeDBLocales(subject.subjects, "short_name"),
        }))
      : [],
    birthdate: teacherData!.people!.birthdate,
    pants_size: options?.detailed
      ? teacherData!.people?.pants_size ?? null
      : null,
    role: "teacher",
    is_admin: null,
  };

  return { data: teacher, error: null };
}
