import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { PersonLookupItem, UserRole } from "@/utils/types/person";
import logError from "@/utils/helpers/logError";
import mergeDBLocales from "@/utils/helpers/mergeDBLocales";
import getCurrentAcademicYear from "@/utils/helpers/getCurrentAcademicYear";

export async function getPeopleLookupList(
  supabase: DatabaseClient,
  query?: string,
): Promise<BackendReturn<PersonLookupItem[]>> {
  let people: PersonLookupItem[] = [];

  const { data: fetchedPeople, error: peopleError } = await supabase
    .from("people")
    .select(
      "id, prefix_th, prefix_en, first_name_th, middle_name_th, last_name_th, nickname_th, first_name_en, middle_name_en, last_name_en, nickname_en, students(id, classroom_students(classrooms!inner(id, number))), teachers(id, subject_groups(id, name_en, name_th))",
    )
    .or(
      `first_name_th.like.%${query || ""}%, \
      middle_name_th.like.%${query || ""}%, \
      last_name_th.like.%${query || ""}%, \
      nickname_th.like.%${query || ""}%, \
      first_name_en.ilike.%${query || ""}%, \
      middle_name_en.ilike.%${query || ""}%, \
      last_name_en.ilike.%${query || ""}%, \
      nickname_en.ilike.%${query || ""}%`,
    )
    .eq("students.classroom_students.classrooms.year", getCurrentAcademicYear())
    .order("first_name_th")
    .order("last_name_th")
    .limit(100);

  if (peopleError) {
    // console.error(peopleError);
    logError("getPeopleLookupList", peopleError);
    return { data: null, error: peopleError };
  }

  for (const person of fetchedPeople!) {
    const { students, teachers, ...personData } = person;
    const student = students?.length ? students[0] : null;
    const teacher = teachers?.length ? teachers[0] : null;
    const personID = student?.id || teacher?.id;

    people.push({
      id: personID!,
      prefix: mergeDBLocales(personData, "prefix"),
      first_name: mergeDBLocales(personData, "first_name"),
      last_name: mergeDBLocales(personData, "last_name"),
      nickname: mergeDBLocales(personData, "nickname"),
      middle_name: mergeDBLocales(personData, "middle_name"),
      ...(student
        ? {
            role: "student",
            classroom: student.classroom_students.length
              ? student
                ? student.classroom_students[0].classrooms!
                : null
              : null,
          }
        : {
            role: "teacher",
            subject_group: {
              id: teacher!.subject_groups!.id,
              name: mergeDBLocales(teacher!.subject_groups, "name"),
            },
          }),
    });
  }

  return { data: people, error: null };
}
