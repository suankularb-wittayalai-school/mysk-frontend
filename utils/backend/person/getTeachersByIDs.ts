// Imports
import logError from "@/utils/helpers/logError";
import { APITeacher } from "@/utils/types/api/person";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { MySKClient } from "@/utils/types/fetch";
import { Teacher, UserRole } from "@/utils/types/person";

/**
 * Get multiple Teachers by their IDs.
 *
 * @param supabase The Supabase Client to use.
 * @param mysk The MySK Client to use.
 * @param teacherIDs The IDs of the Teachers in the database. Not to be confused with the Person ID or the Teacher ID.
 *
 * @param options Options.
 * @param options.detailed Whether to include detailed information about the Teachers.
 *
 * @returns A Backend Return with an array of the Teachers.
 */
export async function getTeachersByIDs(
  supabase: DatabaseClient,
  mysk: MySKClient,
  teacherIDs: string[],
  options?: Partial<{ detailed: boolean }>,
): Promise<BackendReturn<Teacher[]>> {
  if (teacherIDs.length === 0) return { data: [], error: null };

  const { data, error } = await mysk.fetch<APITeacher[]>("/v1/teachers", {
    query: {
      fetch_level: "default",
      descendant_fetch_level: "compact",
      filter: { data: { ids: teacherIDs } },
      pagination: { p: 1, size: teacherIDs.length },
    },
  });

  if (error) {
    logError("getTeachersByIDs", error);
    return { data: null, error };
  }

  const teachers: Teacher[] = (data ?? []).map((teacher) => ({
    id: teacher.id,
    prefix: teacher.person.prefix,
    first_name: teacher.person.first_name,
    last_name: teacher.person.last_name,
    middle_name: teacher.person.middle_name,
    nickname: teacher.person.nickname,
    teacher_id: teacher.teacher_id,
    class_advisor_at: teacher.class_advisor_at
      ? {
          id: teacher.class_advisor_at.id,
          number: teacher.class_advisor_at.number,
        }
      : null,
    contacts: [],
    allergies: options?.detailed ? teacher.person.allergies : null,
    profile: teacher.person.profile ?? null,
    profile_url: teacher.person.profile ?? null,
    citizen_id: null,
    shirt_size: options?.detailed ? teacher.person.shirt_size : null,
    subject_group: {
      id: teacher.subject_group.id,
      name: teacher.subject_group.name,
    },
    subjects_in_charge: options?.detailed
      ? teacher.subjects_in_charge.map((subject) => ({
          id: subject.id,
          name: subject.name,
          code: subject.code,
          short_name: subject.short_name,
        }))
      : [],
    electives_in_charge: [],
    birthdate: options?.detailed ? (teacher.person.birthdate ?? null) : null,
    pants_size: options?.detailed ? (teacher.person.pants_size ?? null) : null,
    role: UserRole.teacher,
    is_admin: null,
  }));

  return { data: teachers, error: null };
}
