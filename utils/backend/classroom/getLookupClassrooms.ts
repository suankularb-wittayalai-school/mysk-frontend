import { logError } from "@/utils/helpers/debug";
import { mergeDBLocales } from "@/utils/helpers/string";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { Classroom } from "@/utils/types/classroom";
import { getCurrentAcademicYear } from "@/utils/helpers/date";

export default async function getLookupClassrooms(
  supabase: DatabaseClient,
  options?: { year?: number },
): Promise<
  BackendReturn<
    (Pick<Classroom, "id" | "number" | "class_advisors"> & {
      studentCount: number;
    })[]
  >
> {
  const { data: classroomsData, error: classroomsError } = await supabase
    .from("classrooms")
    .select(
      `id,
            number,
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
    )
    .eq("year", options?.year || getCurrentAcademicYear());

  if (classroomsError) {
    logError("getLookupClassrooms (classrooms)", classroomsError);
    return { error: classroomsError, data: null };
  }

  const classrooms: (Pick<Classroom, "id" | "number" | "class_advisors"> & {
    studentCount: number;
  })[] =
    classroomsData?.map((classroom) => ({
      id: classroom.id,
      number: classroom.number,
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

  return { data: classrooms, error: null };
}
