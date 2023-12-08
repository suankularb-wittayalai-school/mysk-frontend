// Imports
import getCurrentAcademicYear from "@/utils/helpers/getCurrentAcademicYear";
import getCurrentSemester from "@/utils/helpers/getCurrentSemester";
import logError from "@/utils/helpers/logError";
import mergeDBLocales from "@/utils/helpers/mergeDBLocales";
import getCurrentPeriod from "@/utils/helpers/schedule/getCurrentPeriod";
import getCurrentSchoolSessionState from "@/utils/helpers/schedule/getCurrentSchoolSessionState";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { Classroom } from "@/utils/types/classroom";
import { SchedulePeriod } from "@/utils/types/schedule";
import { group, pick, sift, unique } from "radash";

/**
 * Fetch all Classrooms in the current (or specified) academic year, including
 * the current/upcoming Schedule Period.
 *
 * @param supabase The Supabase client to use.
 * @param options Options.
 * @param options.year The academic year to fetch Classrooms from.
 *
 * @returns A Backend Return of an array of Classrooms.
 */
export default async function getLookupClassrooms(
  supabase: DatabaseClient,
  options?: Partial<{ year: number }>,
): Promise<
  BackendReturn<
    (Pick<Classroom, "id" | "number"> & { relevantPeriod?: SchedulePeriod })[]
  >
> {
  console.log({
    date: new Date(),
    timezoneOffset: new Date().getTimezoneOffset() / 60,
    periodNumber: getCurrentPeriod(),
  });

  const { data, error } = await supabase
    .from("classrooms")
    .select(
      `id,
      number,
      main_room,
      schedule_item_classrooms(
        schedule_items!inner(
          id,
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
          )
        )
      )`,
    )
    .order("number")
    .eq("year", options?.year || getCurrentAcademicYear())
    .eq(
      "schedule_item_classrooms.schedule_items.year",
      options?.year || getCurrentAcademicYear(),
    )
    .eq(
      "schedule_item_classrooms.schedule_items.semester",
      getCurrentSemester(),
    )
    .eq("schedule_item_classrooms.schedule_items.day", new Date().getDay());

  if (error) {
    logError("getLookupClassrooms", error);
    return { data: null, error };
  }

  // Add the current/upcoming Schedule Item data to the Classroom data
  const classrooms = data!.map((classroom) => {
    // Format the data into Schedule Items
    const todayRow = Object.values(
      group(
        sift(
          classroom.schedule_item_classrooms.map(
            ({ schedule_items }) => schedule_items,
          ),
        ),
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

    // If the School Session is not in session, return the Classroom data as-is
    if (getCurrentSchoolSessionState() !== "in-session") return classroom;

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

    // Group the Classroom data with the Schedule Item data
    return {
      ...pick(classroom, ["id", "number", "main_room"]),
      relevantPeriod: (currentPeriod || nextPeriod || null) as
        | SchedulePeriod
        | undefined,
    };
  });

  return { data: classrooms, error: null };
}
