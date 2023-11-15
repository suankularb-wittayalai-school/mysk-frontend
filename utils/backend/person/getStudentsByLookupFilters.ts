import { StudentSearchFilters } from "@/pages/search/students/results";
import getCurrentAcademicYear from "@/utils/helpers/getCurrentAcademicYear";
import logError from "@/utils/helpers/logError";
import mergeDBLocales from "@/utils/helpers/mergeDBLocales";
import createOrQueryFromFullName from "@/utils/helpers/person/createOrQueryFromFullName";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { StudentLookupItem } from "@/utils/types/person";

/**
 * Get students by lookup filters.
 *
 * @param supabase The Supabase client to use.
 * @param filters Filters to be used in the query.
 *
 * @returns A Backend Return with a list of Student Lookup Items.
 */
export default async function getStudentsByLookupFilters(
  supabase: DatabaseClient,
  filters: StudentSearchFilters,
): Promise<BackendReturn<StudentLookupItem[]>> {
  if (Object.keys(filters).length === 0) return { data: [], error: null };

  let query = supabase
    .from("students")
    .select(
      `id,
      people!inner(
        prefix_th,
        prefix_en,
        first_name_th,
        middle_name_th,
        last_name_th,
        nickname_th,
        first_name_en,
        middle_name_en,
        last_name_en,
        nickname_en,
        person_contacts${filters.contact ? "!inner" : ""}(contacts!inner(value))
      ),
      classroom_students(classrooms!inner(id, number))`,
    )
    .eq("classroom_students.classrooms.year", getCurrentAcademicYear());

  if (filters.fullName)
    query = query.or(createOrQueryFromFullName(filters.fullName), {
      foreignTable: "people",
    });

  if (filters.nickname)
    query = query.or(
      `nickname_th.like.%${filters.nickname || ""}%, \
      nickname_en.ilike.%${filters.nickname || ""}%`,
      { foreignTable: "people" },
    );

  if (filters.contact)
    query = query.eq("people.person_contacts.contacts.value", filters.contact);

  const { data, error } = await query.limit(100);

  if (error) {
    logError("getStudentsByLookupFilters", error);
    return { data: null, error };
  }

  return {
    data: data.map((student) => ({
      id: student.id,
      prefix: mergeDBLocales(student.people, "prefix"),
      first_name: mergeDBLocales(student.people, "first_name"),
      middle_name: mergeDBLocales(student.people, "middle_name"),
      last_name: mergeDBLocales(student.people, "last_name"),
      nickname: mergeDBLocales(student.people, "nickname"),
      role: "student",
      classroom: student.classroom_students[0]?.classrooms || null,
    })),
    error: null,
  };
}
