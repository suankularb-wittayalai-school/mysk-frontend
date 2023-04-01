// Backend
import { db2SchedulePeriod } from "@/utils/backend/database";
import { isOverlappingExistingItems } from "@/utils/backend/schedule/utils";
import { range } from "@/utils/helpers/array";

// Helpers
import {
  arePeriodsOverlapping,
  createEmptySchedule,
} from "@/utils/helpers/schedule";

// Supabase
import {
  BackendDataReturn,
  BackendReturn,
  DatabaseClient,
} from "@/utils/types/common";

// Types
import { Role } from "@/utils/types/person";
import { Schedule, PeriodContentItem } from "@/utils/types/schedule";

/**
 * Construct a Schedule from Schedule Items from the student’s perspective
 * @param role The role of the user getting Schedule
 * @param classID The Supabase ID of the class the user is a part of
 */
export async function getSchedule(
  supabase: DatabaseClient,
  role: "student",
  classID: number,
  day?: Day
): Promise<BackendDataReturn<Schedule, Schedule>>;

/**
 * Construct a Teaching Schedule from Schedule Items from the teacher’s perspective
 * @param role The role of the user getting Schedule
 * @param teacherID The Supabase ID of the user (who should be a Teacher)
 */
export async function getSchedule(
  supabase: DatabaseClient,
  role: "teacher",
  teacherID: number,
  day?: Day
): Promise<BackendDataReturn<Schedule, Schedule>>;

export async function getSchedule(
  supabase: DatabaseClient,
  role: Role,
  id: number,
  day?: Day
): Promise<BackendDataReturn<Schedule, Schedule>> {
  // Schedule filled with empty periods
  let schedule =
    day == undefined ? createEmptySchedule(1, 5) : createEmptySchedule(day);

  // Fetch data from Supabase
  const { data, error } = await supabase
    .from("schedule_items")
    .select(
      "*, subject(*), teacher(*, person(*), subject_group(*)), classroom(id, number)"
    )
    .match(
      role == "teacher"
        ? // Match teacher if role is teacher
          day == undefined
          ? { teacher: id }
          : { teacher: id, day }
        : // Match classroom if role is student
        day == undefined
        ? { classroom: id }
        : { classroom: id, day }
    );

  // Return an empty Schedule if fetch failed
  if (error) {
    console.error(error);
    return { data: schedule, error };
  }

  // Add Supabase data to empty schedule
  for (let incomingPeriod of data!) {
    // Find the index of the row we want to manipulate
    const scheduleRowIndex = schedule.content.findIndex(
      (scheduleRow) => incomingPeriod.day == scheduleRow.day
    );

    // Loop through each exisitng period in this row
    const periodIndices = range(
      schedule.content[scheduleRowIndex].content.length
    );
    for (let idx of periodIndices) {
      const schedulePeriod = schedule.content[scheduleRowIndex].content[idx];

      // If there is no period at this index, skip it
      if (!schedulePeriod) continue;

      // Ignore other periods (keep as is)
      if (
        !arePeriodsOverlapping(
          {
            startTime: schedulePeriod.startTime,
            duration: schedulePeriod.duration,
          },
          {
            startTime: incomingPeriod.start_time,
            duration: incomingPeriod.duration,
          }
        )
      )
        continue;

      // Determine what to do if the incoming period overlaps with an existing
      // period
      const processedPeriod = await db2SchedulePeriod(
        supabase,
        incomingPeriod,
        role
      );

      // Replace empty period
      if (schedulePeriod.content.length == 0) {
        schedule.content[scheduleRowIndex].content[idx] = processedPeriod;
        // Remove empty periods that is now overlapping the new incoming period
        schedule.content[scheduleRowIndex].content.splice(
          idx + 1,
          incomingPeriod.duration - 1
        );
        continue;
      }

      // If a period already exists here, just adjust duration and modify the
      // `subjects` array
      if (schedulePeriod.duration < incomingPeriod.duration)
        schedulePeriod.duration = incomingPeriod.duration;
      schedulePeriod.content = schedulePeriod.content.concat(
        processedPeriod.content
      );
      schedule.content[scheduleRowIndex].content[idx] = schedulePeriod;
    }
  }

  // Sort the periods to ensure sensible tab order
  // This has no effect on the visual Schedule
  schedule.content = schedule.content.map((scheduleRow) => ({
    ...scheduleRow,
    content: scheduleRow.content.sort((a, b) => a.startTime - b.startTime),
  }));

  return { data: schedule, error: null };
}

export async function getSchedulesOfGrade(
  supabase: DatabaseClient,
  grade: number
): Promise<BackendDataReturn<Schedule[]>> {
  const { data: classes, error: classesError } = await supabase
    .from("classroom")
    .select("id, number")
    .lt("number", (grade + 1) * 100)
    .gt("number", grade * 100)
    .order("number");

  if (classesError) {
    console.error(classesError);
    return { data: [], error: classesError };
  }

  return {
    data: await Promise.all(
      classes!.map(async (classItem) => ({
        ...(await getSchedule(supabase, "student", classItem.id)).data,
        class: classItem,
      }))
    ),
    error: null,
  };
}

/**
 * Insert a Schedule Item
 * @param form Edit Period dialog form
 * @param teacherID The Supabase ID of the Teacher teaching this Schedule Period
 */
export async function createScheduleItem(
  supabase: DatabaseClient,
  form: {
    subject: number;
    classID: number;
    room: string;
    day: number;
    startTime: number;
    duration: number;
  },
  teacherID: number
): Promise<BackendReturn> {
  const { error } = await supabase.from("schedule_items").insert({
    subject: form.subject,
    classroom: form.classID,
    room: form.room,
    teacher: teacherID,
    day: form.day,
    start_time: form.startTime,
    duration: form.duration,
  });

  if (error) console.error(error);

  return { error };
}

export async function editScheduleItem(
  supabase: DatabaseClient,
  form: {
    subject: number;
    classID: number;
    room: string;
    day: number;
    startTime: number;
    duration: number;
  },
  id: number
): Promise<BackendReturn> {
  const { error } = await supabase
    .from("schedule_items")
    .update({
      subject: form.subject,
      classroom: form.classID,
      room: form.room,
      day: form.day,
      start_time: form.startTime,
      duration: form.duration,
    })
    .match({ id });

  if (error) console.error(error);

  return { error };
}

export async function moveScheduleItem(
  supabase: DatabaseClient,
  newDay: Day,
  newSchedulePeriod: PeriodContentItem,
  teacherID: number
): Promise<BackendReturn> {
  // Check overlap
  if (await isOverlappingExistingItems(newDay, newSchedulePeriod, teacherID))
    return {
      error: {
        message:
          "new period duration causes it to overlap with other relevant periods",
      },
    };

  const { error } = await supabase
    .from("schedule_items")
    .update({ day: newDay, start_time: newSchedulePeriod.startTime })
    .match({ id: newSchedulePeriod.id });

  if (error) console.error(error);

  return { error };
}

export async function editScheduleItemDuration(
  supabase: DatabaseClient,
  day: Day,
  schedulePeriod: PeriodContentItem,
  teacherID: number
): Promise<BackendReturn> {
  // Cap duration
  if (schedulePeriod.duration < 1) schedulePeriod.duration = 1;
  else if (schedulePeriod.duration > 10) schedulePeriod.duration = 10;

  if (await isOverlappingExistingItems(day, schedulePeriod, teacherID))
    return {
      error: {
        message:
          "new period duration causes it to overlap with other relevant periods",
      },
    };

  // If overlap, end the function; if not, push the update
  const { error } = await supabase
    .from("schedule_items")
    .update({ duration: schedulePeriod.duration })
    .match({ id: schedulePeriod.id });

  if (error) console.error(error);

  return { error };
}

export async function deleteScheduleItem(
  supabase: DatabaseClient,
  id: number
): Promise<BackendReturn> {
  const { error } = await supabase
    .from("schedule_items")
    .delete()
    .match({ id });

  if (error) console.error(error);

  return { error };
}
