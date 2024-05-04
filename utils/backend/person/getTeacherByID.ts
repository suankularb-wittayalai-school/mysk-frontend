import getCurrentAcademicYear from "@/utils/helpers/getCurrentAcademicYear";
import logError from "@/utils/helpers/logError";
import mergeDBLocales from "@/utils/helpers/mergeDBLocales";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { ElectiveSubject } from "@/utils/types/elective";
import { MySKClient } from "@/utils/types/fetch";
import { ShirtSize, Teacher, UserRole } from "@/utils/types/person";
import { alphabetical } from "radash";

export async function getTeacherByID(
  supabase: DatabaseClient,
  mysk: MySKClient,
  teacherID: string,
  options?: Partial<{
    detailed: boolean;
    includeContacts: boolean;
    year: number;
  }>,
): Promise<BackendReturn<Teacher>> {
  let { data, error } = await supabase
    .from("teachers")
    .select(
      `*,
      people(*, person_contacts(contacts(*)), person_allergies(allergy_name)),
      classroom_advisors(classrooms!inner(id, number)),
      subject_groups(id, name_en, name_th),
      subject_teachers(
        subjects!inner(
          id,
          name_en,
          name_th,
          code_en,
          code_th,
          short_name_en,
          short_name_th
        )
      )`,
    )
    .eq("id", teacherID)
    .eq("classroom_advisors.classrooms.year", getCurrentAcademicYear())
    .eq("subject_teachers.year", options?.year ?? getCurrentAcademicYear())
    .single();

  if (error) {
    logError("getTeacherByID (teachers)", error);
    return { data: null, error: error };
  }

  const electivesInCharge: ElectiveSubject[] = [];
  if (options?.detailed) {
    const { data, error } = await mysk.fetch<ElectiveSubject[]>(
      "/v1/subjects/electives",
      {
        query: {
          fetch_level: "compact",
          filter: { data: { teacher_ids: [teacherID] } },
        },
      },
    );
    if (error) logError("getTeacherByID (electives)", error);
    if (data?.length) electivesInCharge.push(...data);
  }

  const teacher: Teacher = {
    id: data!.id,
    prefix: mergeDBLocales(data!.people, "prefix"),
    first_name: mergeDBLocales(data!.people, "first_name"),
    last_name: mergeDBLocales(data!.people, "last_name"),
    nickname: mergeDBLocales(data!.people, "nickname"),
    middle_name: mergeDBLocales(data!.people, "middle_name"),
    teacher_id: data!.teacher_id,
    class_advisor_at:
      data!.classroom_advisors.length > 0
        ? {
            id: data!.classroom_advisors[0].classrooms!.id,
            number: data!.classroom_advisors[0].classrooms!.number,
          }
        : null,
    contacts: options?.includeContacts
      ? alphabetical(
          data!.people!.person_contacts.map((contacts) => {
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
          }),
          (contact) => contact.type,
        )
      : [],
    allergies: options?.detailed
      ? data!.people!.person_allergies.map(
          (allergies) => allergies.allergy_name,
        )
      : null,
    profile: data!.people?.profile ?? null,
    profile_url: data!.people?.profile ?? null,
    citizen_id: options?.detailed ? data!.people?.citizen_id ?? null : null,
    shirt_size:
      options?.detailed && data?.people?.shirt_size
        ? {
            XS: ShirtSize.XS,
            S: ShirtSize.S,
            M: ShirtSize.M,
            L: ShirtSize.L,
            XL: ShirtSize.XL,
            "2XL": ShirtSize.twoXL,
            "3XL": ShirtSize.threeXL,
            "4XL": ShirtSize.fourXL,
            "5XL": ShirtSize.fiveXL,
            "6XL": ShirtSize.sixXL,
          }[data.people.shirt_size]
        : null,
    subject_group: {
      id: data!.subject_groups!.id,
      name: mergeDBLocales(data!.subject_groups, "name"),
    },
    subjects_in_charge: options?.detailed
      ? alphabetical(
          data!.subject_teachers.map((subject) => ({
            id: subject.subjects!.id,
            name: mergeDBLocales(subject.subjects, "name"),
            code: mergeDBLocales(subject.subjects, "code"),
            short_name: mergeDBLocales(subject.subjects, "short_name"),
          })),
          (subject) => subject.code.th,
        )
      : [],
    electives_in_charge: electivesInCharge,
    birthdate: data!.people!.birthdate,
    pants_size: options?.detailed ? data!.people?.pants_size ?? null : null,
    role: UserRole.teacher,
    is_admin: null,
  };

  return { data: teacher, error: null };
}
