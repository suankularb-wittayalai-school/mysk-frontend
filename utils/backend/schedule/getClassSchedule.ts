// Imports
import {
  getCurrentAcademicYear,
  getCurrentSemester,
} from "@/utils/helpers/date";
import { logError } from "@/utils/helpers/debug";
import {
  arePeriodsOverlapping,
  createEmptySchedule,
} from "@/utils/helpers/schedule";
import { mergeDBLocales } from "@/utils/helpers/string";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { Schedule, PeriodContentItem } from "@/utils/types/schedule";
import { list, omit } from "radash";

/**
 * Construct a Schedule from Schedule Items from the student’s perspective.
 *
 * @param classroomID The Supabase ID of the class the user is a part of.
 */
export default async function getClassSchedule(
  supabase: DatabaseClient,
  classroomID: string,
): Promise<BackendReturn<Schedule>> {
  // Schedule filled with empty periods
  let schedule = createEmptySchedule(1, 5);

  const { data: scheduleItems, error: scheduleItemsError } = await supabase
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
      schedule_item_classrooms!inner(
        classrooms(id, number)
      ),
      schedule_item_teachers!inner(
        teachers(
          id,
          people(
            first_name_en,
            last_name_en,
            first_name_th,
            last_name_th
          )
        )
      ),
      schedule_item_rooms!inner(room)
    `,
    )
    // `match` doesn’t work lmao
    .eq("schedule_item_classrooms.classroom_id", classroomID)
    .eq("year", getCurrentAcademicYear())
    .eq("semester", getCurrentSemester());

  if (scheduleItemsError) {
    logError("getClassSchedule (scheduleItems)", scheduleItemsError);
    return { data: null, error: scheduleItemsError };
  }

  const periodsItems: (PeriodContentItem & { day: number })[] =
    scheduleItems!.map((scheduleItem) => ({
      id: scheduleItem.id,
      day: scheduleItem.day,
      start_time: scheduleItem.start_time,
      duration: scheduleItem.duration,
      subject: {
        id: scheduleItem.subjects!.id,
        code: mergeDBLocales(scheduleItem.subjects, "code"),
        name: mergeDBLocales(scheduleItem.subjects, "name"),
        short_name: mergeDBLocales(scheduleItem.subjects, "short_name"),
      },
      teachers: scheduleItem.schedule_item_teachers.map((teacher) => ({
        id: teacher.teachers!.id,
        first_name: mergeDBLocales(teacher.teachers!.people, "first_name"),
        last_name: mergeDBLocales(teacher.teachers!.people, "last_name"),
      })),
      rooms: scheduleItem.schedule_item_rooms.map((room) => room.room),
    }));

  // Add Supabase data to empty schedule
  for (let incomingPeriod of periodsItems) {
    // Find the index of the row (day) we want to manipulate
    const scheduleRowIndex = schedule.content.findIndex(
      (scheduleRow) => incomingPeriod.day === scheduleRow.day,
    );

    // Loop through each existing period in this row
    const periodIndices = list(
      schedule.content[scheduleRowIndex].content.length,
    );
    for (let idx of periodIndices) {
      // The current period that exists in the Schedule
      const schedulePeriod = schedule.content[scheduleRowIndex].content[idx];

      // If there is no period at this index, skip it
      if (!schedulePeriod) continue;

      // Ignore other periods (keep as is)
      if (
        !arePeriodsOverlapping(
          {
            startTime: schedulePeriod.start_time,
            duration: schedulePeriod.duration,
          },
          {
            startTime: incomingPeriod.start_time,
            duration: incomingPeriod.duration,
          },
        )
      )
        continue;

      // Determine what to do if the incoming period overlaps with an existing
      // period
      const omittedPeriod = omit(incomingPeriod, ["day"]);

      // Replace empty period
      if (schedulePeriod.content.length === 0) {
        schedule.content[scheduleRowIndex].content[idx].content = [
          omittedPeriod,
        ];
        schedule.content[scheduleRowIndex].content[idx].id = omittedPeriod.id;

        // Remove empty periods that is now overlapping the new incoming period
        schedule.content[scheduleRowIndex].content.splice(
          idx + 1,
          incomingPeriod.duration - 1,
        );
        continue;
      }

      // If the period that already exists here is for the same subject as the
      // new period, it is likely that the Teacher and the Co-teacher both
      // added their subjects (which are identical), thus only one should be
      // shown
      if (
        schedulePeriod.content.filter(
          (period) => period.subject.id === incomingPeriod.subject.id,
        ).length
      )
        continue;

      // If a period already exists here, just adjust duration and modify the
      // `subjects` array
      if (schedulePeriod.duration < incomingPeriod.duration)
        schedulePeriod.duration = incomingPeriod.duration;
      schedulePeriod.content = schedulePeriod.content.concat([omittedPeriod]);

      schedule.content[scheduleRowIndex].content[idx] = schedulePeriod;
    }
  }

  // Sort the periods
  schedule.content = schedule.content.map((scheduleRow) => ({
    ...scheduleRow,
    content: scheduleRow.content.sort((a, b) => a.start_time - b.start_time),
  }));

  return { data: schedule, error: null };
}
