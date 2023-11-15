// Imports
import { TeacherSearchFilters } from "@/pages/search/teachers/results";
import getCurrentAcademicYear from "@/utils/helpers/getCurrentAcademicYear";
import logError from "@/utils/helpers/logError";
import mergeDBLocales from "@/utils/helpers/mergeDBLocales";
import createOrQueryFromFullName from "@/utils/helpers/person/createOrQueryFromFullName";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { TeacherLookupItem } from "@/utils/types/person";

export default async function getTeachersByLookupFilters(
  supabase: DatabaseClient,
  filters: TeacherSearchFilters,
  options?: { year?: number },
): Promise<BackendReturn<TeacherLookupItem[]>> {
  if (Object.keys(filters).length === 0 || Number.isNaN(filters.subjectGroup))
    return { data: [], error: null };

  let query = supabase.from("teachers").select(
    `id,
    subject_groups!inner(id, name_en, name_th),
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
    classroom_advisors${filters.classroom ? "!inner" : ""}(
      classrooms!inner(number, year)
    )`,
  );

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

  if (filters.subjectGroup)
    query = query.eq("subject_groups.id", filters.subjectGroup);

  if (filters.classroom)
    query = query
      .eq("classroom_advisors.classrooms.number", filters.classroom)
      .eq(
        "classroom_advisors.classrooms.year",
        options?.year || getCurrentAcademicYear(),
      );

  if (filters.contact)
    query = query.eq("people.person_contacts.contacts.value", filters.contact);

  const { data, error } = await query.limit(100);

  if (error) {
    logError("getTeachersByLookupFilters", error);
    return { data: null, error };
  }

  return {
    data: data.map((teacher) => ({
      id: teacher.id,
      prefix: mergeDBLocales(teacher.people, "prefix"),
      first_name: mergeDBLocales(teacher.people, "first_name"),
      last_name: mergeDBLocales(teacher.people, "last_name"),
      nickname: mergeDBLocales(teacher.people, "nickname"),
      middle_name: mergeDBLocales(teacher.people, "middle_name"),
      role: "teacher",
      subject_group: {
        id: teacher!.subject_groups!.id,
        name: mergeDBLocales(teacher!.subject_groups, "name"),
      },
    })),
    error: null,
  };
}
