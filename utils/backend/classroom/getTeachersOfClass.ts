import logError from "@/utils/helpers/logError";
import mergeDBLocales from "@/utils/helpers/mergeDBLocales";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { Teacher, UserRole } from "@/utils/types/person";

import getCurrentAcademicYear from "@/utils/helpers/getCurrentAcademicYear";

export default async function getTeachersOfClass(
  supabase: DatabaseClient,
  classroomID: string,
  options?: { year?: number },
): Promise<
  BackendReturn<
    Pick<
      Teacher,
      "id" | "role" | "prefix" | "first_name" | "last_name" | "subject_group"
    >[]
  >
> {
  const { data: teachers, error } = await supabase
    .from("teachers")
    .select(
      `id,
        people (prefix_th, prefix_en, first_name_th, last_name_th, first_name_en, last_name_en),
        subject_groups ( id, name_th, name_en ),
        classroom_subject_teachers!inner(classroom_subjects!inner(classrooms!inner(year)))`,
    )
    .eq(
      "classroom_subject_teachers.classroom_subjects.classroom_id",
      classroomID,
    )
    .eq(
      "classroom_subject_teachers.classroom_subjects.classrooms.year",
      options?.year ?? getCurrentAcademicYear(),
    );

  if (error) {
    logError("getClassTeacherList", error);
    return { data: null, error: error };
  }

  const teacherList: Pick<
    Teacher,
    "id" | "role" | "prefix" | "first_name" | "last_name" | "subject_group"
  >[] = teachers?.map((teacher) => {
    return {
      id: teacher.id,
      role: UserRole.teacher,
      prefix: mergeDBLocales(teacher.people, "prefix"),
      first_name: mergeDBLocales(teacher.people, "first_name"),
      last_name: mergeDBLocales(teacher.people, "last_name"),
      subject_group: {
        id: teacher.subject_groups!.id,
        name: mergeDBLocales(teacher.subject_groups!, "name"),
      },
    };
  });

  return { data: teacherList, error: null };
}
