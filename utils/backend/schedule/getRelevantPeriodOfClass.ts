import getCurrentAcademicYear from "@/utils/helpers/getCurrentAcademicYear";
import getCurrentSemester from "@/utils/helpers/getCurrentSemester";
import logError from "@/utils/helpers/logError";
import mergeDBLocales from "@/utils/helpers/mergeDBLocales";
import getCurrentPeriod from "@/utils/helpers/schedule/getCurrentPeriod";
import getCurrentSchoolSessionState, {
  SchoolSessionState,
} from "@/utils/helpers/schedule/getCurrentSchoolSessionState";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { SchedulePeriod } from "@/utils/types/schedule";
import { group, pick, sift, unique } from "radash";

/**
 * Get the current or upcoming Schedule Period of a Classroom.
 *
 * @param supabase The Supabase client to use.
 * @param classroomID The ID of the Classroom to get the Schedule Period of.
 *
 * @returns A Backend Return with a Schedule Period if found and `isCurrent` to indicate if the Schedule Period is the current one.
 *
 * @note Lifted from an old version of `getClassrooms`.
 */
export default async function getRelevantPeriodOfClass(
  supabase: DatabaseClient,
  classroomID: string,
): Promise<BackendReturn<SchedulePeriod | null> & { isCurrent: boolean }> {
  // If the school is not in session, stop early and return null
  if (getCurrentSchoolSessionState() !== SchoolSessionState.schedule)
    return { data: null, error: null, isCurrent: false };

  // Fetch today’s Schedule Items of the Classroom
  const { data, error } = await supabase
    .from("schedule_item_classrooms")
    .select(
      `schedule_items!inner(
        id,
        day,
        start_time,
        duration,
        year,
        semester,
        subjects!inner(
          id,
          name_en,
          name_th,
          code_th,
          code_en,
          short_name_en,
          short_name_th
        )
      )`,
    )
    .eq("classroom_id", classroomID)
    .eq("schedule_items.day", new Date().getDay())
    .eq("schedule_items.year", getCurrentAcademicYear())
    .eq("schedule_items.semester", getCurrentSemester());

  if (error) {
    logError("getRelevantPeriodOfClass", error);
    return { data: null, error, isCurrent: false };
  }

  // Format the data into Schedule Periods
  const todayRow = Object.values(
    group(
      sift(data.map(({ schedule_items }) => schedule_items)),
      // Group by start time for handling duplicate periods and electives
      (scheduleItem) => scheduleItem.start_time,
    ),
  ).map((scheduleItems) => {
    const scheduleItem = scheduleItems![0];

    return {
      id: scheduleItem.id,
      day: scheduleItem.day,
      start_time: scheduleItem.start_time,
      duration: scheduleItem.duration,
      content:
        // Filter out duplicate periods with `unique`
        unique(scheduleItems!, (contentItem) => contentItem.subjects!.id)!
          // Using map to handle electives
          .map((contentItem) => ({
            ...pick(contentItem, ["id", "start_time", "duration"]),
            subject: {
              id: contentItem.subjects!.id,
              code: mergeDBLocales(contentItem.subjects, "code"),
              name: mergeDBLocales(contentItem.subjects, "name"),
              short_name: mergeDBLocales(contentItem.subjects, "short_name"),
            },
            teachers: [],
          })),
    };
  });

  // Get the current and upcoming Schedule Items
  const periodNumber = getCurrentPeriod();
  const currentPeriod = todayRow.find(
    (period) =>
      period.start_time <= periodNumber &&
      period.start_time + period.duration > periodNumber,
  );
  const nextPeriod = todayRow.find(
    (period) => period.start_time > periodNumber,
  );

  return {
    data: currentPeriod || nextPeriod || null,
    error: null,
    isCurrent: currentPeriod !== undefined,
  };
}
