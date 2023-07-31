import { logError } from "@/utils/helpers/debug";
import { mergeDBLocales } from "@/utils/helpers/string";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { Classroom } from "@/utils/types/classroom";

export async function getClassroomsForAdmin(
  supabase: DatabaseClient,
  page: number,
  rowsPerPage: number,
  query?: string,
): Promise<
  BackendReturn<
    (Pick<Classroom, "id" | "number" | "class_advisors" | "year"> & {
      studentCount: number;
    })[]
  > & { count: number }
> {
  if (query && query.length > 3 && !/[0-9]/.test(query))
    return { data: [], count: 0, error: null };

  // Format the query into a number range, for use with `.gt()` and `.lt()`
  const numberRange = query
    ? query.length === 1
      ? { gt: Number(query) * 100, lt: (Number(query) + 1) * 100 }
      : query.length === 2
      ? { gt: Number(query) * 10, lt: (Number(query) + 1) * 10 }
      : { gt: Number(query) - 1, lt: Number(query) + 1 }
    : { gt: 0, lt: 700 };

  const {
    data: classroomsData,
    error: classroomsError,
    count,
  } = await supabase
    .from("classrooms")
    .select(
      `id,
      number,
      year,
      classroom_advisors!inner(
        teachers(
          id,
          subject_groups(*),
          people(
            first_name_en,
            first_name_th,
            last_name_en,
            last_name_th,
            middle_name_en,
            middle_name_th,
            profile
          )
        )
      ),
      classroom_students!inner(id)`,
      { count: "exact" },
    )
    .gt("number", numberRange.gt)
    .lt("number", numberRange.lt)
    // Academic year query
    .or(
      query && query.length >= 4
        ? `year.eq.${query}, year.eq.${Number(query) - 543}`
        : "year.gt.0",
    )
    .order("year", { ascending: false })
    .order("number")
    // Pagination
    .range(rowsPerPage * (page - 1), rowsPerPage * page - 1);

  if (classroomsError) {
    logError("getClassroomsForAdmin (classrooms)", classroomsError);
    return { data: null, count: 0, error: classroomsError };
  }

  const classrooms: (Pick<
    Classroom,
    "id" | "number" | "class_advisors" | "year"
  > & {
    studentCount: number;
  })[] =
    classroomsData?.map((classroom) => ({
      id: classroom.id,
      number: classroom.number,
      year: classroom.year,
      class_advisors: classroom.classroom_advisors?.map((classroomAdvisor) => {
        const teacher = classroomAdvisor.teachers!;
        return {
          id: teacher.id,
          first_name: mergeDBLocales(teacher.people, "first_name"),
          middle_name: mergeDBLocales(teacher.people, "middle_name"),
          last_name: mergeDBLocales(teacher.people, "last_name"),
          profile: teacher.people!.profile,
          subject_group: {
            id: teacher.subject_groups!.id,
            name: mergeDBLocales(teacher.subject_groups, "name"),
          },
        };
      }),
      studentCount: classroom.classroom_students?.length ?? 0,
    })) ?? [];

  return { data: classrooms, count: count!, error: null };
}
