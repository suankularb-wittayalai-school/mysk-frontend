import getCurrentAcademicYear from "@/utils/helpers/getCurrentAcademicYear";
import getCurrentSemester from "@/utils/helpers/getCurrentSemester";
import logError from "@/utils/helpers/logError";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { ParticipationMetrics } from "@/utils/types/management";
import { sum } from "radash";

/**
 * Get the participation metrics for the Manage page.
 *
 * @param supabase The Supabase client to use.
 */
export default async function getParticipationMetrics(
  supabase: DatabaseClient,
): Promise<BackendReturn<ParticipationMetrics>> {
  const { count: onboardedUsers, error: onboardedUsersError } = await supabase
    .from("users")
    .select("id", { count: "exact", head: true })
    .eq("onboarded", true);

  const { count: totalUsers, error: totalUsersError } = await supabase
    .from("users")
    .select("id", { count: "exact", head: true });

  if (onboardedUsersError) {
    logError("getParticipationMetrics", onboardedUsersError);
    return { data: null, error: onboardedUsersError };
  }

  if (totalUsersError) {
    logError("getParticipationMetrics", totalUsersError);
    return { data: null, error: totalUsersError };
  }

  const { data: allTeachers, error: activeTeachersError } = await supabase
    .from("teachers")
    .select(
      `id,
      subject_teachers(subjects(semester)),
      schedule_item_teachers(schedule_items(year, semester))`,
    )
    .eq("subject_teachers.year", getCurrentAcademicYear())
    .eq("schedule_item_teachers.schedule_items.year", getCurrentAcademicYear())
    .eq("subject_teachers.subjects.semester", getCurrentSemester())
    .eq("schedule_item_teachers.schedule_items.semester", getCurrentSemester());

  if (activeTeachersError) {
    logError("getParticipationMetrics", activeTeachersError);
    return { data: null, error: activeTeachersError };
  }

  const teacherWithSubjects = allTeachers.filter((teacher) =>
    teacher.subject_teachers.some(({ subjects }) => subjects),
  );

  const teacherWithScheduleItems = allTeachers.filter((teacher) =>
    teacher.schedule_item_teachers.some(({ schedule_items }) => schedule_items),
  );

  const {
    count: studentsWithAdditionalAccountData,
    error: studentsWithAdditionalAccountDataError,
  } = await supabase
    .from("students")
    .select("id, people!inner(nickname_th)", { count: "exact", head: true })
    .neq("people.nickname_th", null);

  const { data: classrooms, error: classroomsError } = await supabase
    .from("classrooms")
    .select("id, classroom_students(count)")
    .eq("year", getCurrentAcademicYear());

  if (classroomsError) {
    logError("getParticipationMetrics", classroomsError);
    return { data: null, error: classroomsError };
  }

  const studentsWithClassroom = sum(
    classrooms.map(
      ({ classroom_students }) =>
        (classroom_students as unknown as [{ count: number }])[0].count,
    ),
  );

  if (studentsWithAdditionalAccountDataError) {
    logError("getParticipationMetrics", studentsWithAdditionalAccountDataError);
    return { data: null, error: studentsWithAdditionalAccountDataError };
  }

  return {
    data: {
      onboarded_users: onboardedUsers ?? 0,
      total_users: totalUsers ?? 0,
      teachers_with_schedule: teacherWithScheduleItems.length,
      teachers_with_assigned_subjects: teacherWithSubjects.length,
      students_with_additional_account_data:
        studentsWithAdditionalAccountData ?? 0,
      students_with_classroom: studentsWithClassroom,
    },
    error: null,
  };
}
