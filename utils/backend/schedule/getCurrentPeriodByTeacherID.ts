import getCurrentAcademicYear from "@/utils/helpers/getCurrentAcademicYear";
import getCurrentSemester from "@/utils/helpers/getCurrentSemester";
import logError from "@/utils/helpers/logError";
import mergeDBLocales from "@/utils/helpers/mergeDBLocales";
import periodNumberAt from "@/utils/helpers/schedule/periodNumberAt";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { SchedulePeriod } from "@/utils/types/schedule";

export default async function getCurrentPeriodByTeacherID(
  supabase: DatabaseClient,
  teacherID: string,
): Promise<BackendReturn<SchedulePeriod | null>> {
  const periodNumber = periodNumberAt();
  const day = new Date().getDay();

  const { data, error } = await supabase
    .from("schedule_items")
    .select(
      `id,
      day,
      start_time,
      duration,
      subjects!inner(
        id,
        name_en,
        name_th,
        code_th,
        code_en,
        short_name_en,
        short_name_th
      ),
      schedule_item_teachers!inner(teacher_id),
      schedule_item_rooms!inner(room)
    `,
    )
    .eq("semester", getCurrentSemester())
    .eq("year", getCurrentAcademicYear())
    .eq("schedule_item_teachers.teacher_id", teacherID)
    .eq("day", day);

  if (error) {
    logError("getCurrentPeriodByTeacherID", error);
    return { data: null, error };
  }

  const periods = data.map((period) => ({
    id: period.id,
    start_time: period.start_time,
    duration: period.duration,
    content: [
      {
        id: period.id,
        start_time: period.start_time,
        duration: period.duration,
        subject: {
          id: period.subjects!.id,
          code: mergeDBLocales(period.subjects, "code"),
          name: mergeDBLocales(period.subjects, "name"),
          short_name: mergeDBLocales(period.subjects, "short_name"),
        },
        teachers: [],
        classrooms: [],
        rooms: period.schedule_item_rooms.map((room) => room.room),
      },
    ],
  }));

  return {
    data:
      periods.find(
        (period) =>
          // The period starts before or at the current period
          period.start_time <= periodNumber &&
          // The period ends at or after the end of the current period (current
          // period number + 1)
          period.start_time + period.duration > periodNumber,
      ) || null,
    error: null,
  };
}
