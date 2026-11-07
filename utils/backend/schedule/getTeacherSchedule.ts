// Imports
import { getTeachersByIDs } from "@/utils/backend/person/getTeachersByIDs";
import getCurrentAcademicYear from "@/utils/helpers/getCurrentAcademicYear";
import getCurrentSemester from "@/utils/helpers/getCurrentSemester";
import logError from "@/utils/helpers/logError";
import mergeDBLocales from "@/utils/helpers/mergeDBLocales";
import { arePeriodsOverlapping } from "@/utils/helpers/schedule/arePeriodsOverlapping";
import createEmptySchedule from "@/utils/helpers/schedule/createEmptySchedule";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { MySKClient } from "@/utils/types/fetch";
import { Teacher } from "@/utils/types/person";
import { PeriodContentItem, Schedule } from "@/utils/types/schedule";
import { list, omit, pick, sift, unique } from "radash";

/**
 * Construct a Schedule from Schedule Items from the teacher’s perspective.
 *
 * @param supabase The Supabase Client to use.
 * @param mysk The MySK Client to use.
 * @param teacherID The Supabase ID of the teacher.
 *
 * @returns A Backend Return with the Schedule.
 */
export default async function getTeacherSchedule(
  supabase: DatabaseClient,
  mysk: MySKClient,
  teacherID: string,
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
      schedule_item_teachers!inner(teacher_id),
      schedule_item_rooms!inner(room)
    `,
    )
    .eq("schedule_item_teachers.teacher_id", teacherID)
    .eq("year", getCurrentAcademicYear())
    .eq("semester", getCurrentSemester());

  if (scheduleItemsError) {
    logError("getTeacherSchedule (scheduleItems)", scheduleItemsError);
    return { data: null, error: scheduleItemsError };
  }

  const teacherIDs = unique(
    scheduleItems!.flatMap((scheduleItem) =>
      scheduleItem.schedule_item_teachers.map((teacher) => teacher.teacher_id),
    ),
  );
  const { data: teachers, error: teachersError } = await getTeachersByIDs(
    supabase,
    mysk,
    teacherIDs,
  );
  if (teachersError) logError("getTeacherSchedule (teachers)", teachersError);
  const teacherMap: Record<
    string,
    Pick<Teacher, "id" | "first_name" | "last_name">
  > = Object.fromEntries(
    (teachers ?? []).map((teacher) => [
      teacher.id,
      {
        id: teacher.id,
        first_name: teacher.first_name,
        last_name: teacher.last_name,
      },
    ]),
  );
  if (!teachersError) {
    const missingTeacherIDs = teacherIDs.filter((id) => !teacherMap[id]);
    if (missingTeacherIDs.length)
      logError("getTeacherSchedule (teachers)", {
        code: 0,
        error_type: "Some Teachers were not found",
        detail: missingTeacherIDs.join(", "),
        source: "getTeacherSchedule",
      });
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
      teachers: sift(
        scheduleItem.schedule_item_teachers.map(
          (teacher) => teacherMap[teacher.teacher_id],
        ),
      ),
      classrooms: scheduleItem.schedule_item_classrooms.map(
        (classroom) => classroom.classrooms!,
      ),
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
      schedule.content[scheduleRowIndex].content[idx] = {
        ...schedule.content[scheduleRowIndex].content[idx],
        ...pick(omittedPeriod, ["id", "duration"]),
        content: [omittedPeriod],
      };

      // Remove empty periods that is now overlapping the new incoming period
      schedule.content[scheduleRowIndex].content.splice(
        idx + 1,
        incomingPeriod.duration - 1,
      );
    }
  }

  // Sort the periods
  schedule.content = schedule.content.map((scheduleRow) => ({
    ...scheduleRow,
    content: scheduleRow.content.sort((a, b) => a.start_time - b.start_time),
  }));

  return { data: schedule, error: null };
}
