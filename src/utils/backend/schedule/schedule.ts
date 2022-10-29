// Modules
import { PostgrestError } from "@supabase/supabase-js";

// Backend
import { db2SchedulePeriod } from "@utils/backend/database";
import { isOverlappingExistingItems } from "@utils/backend/schedule/utils";

// Helpers
import {
  arePeriodsOverlapping,
  createEmptySchedule,
} from "@utils/helpers/schedule";

// Supabase
import { supabase } from "@utils/supabaseClient";
import { BackendReturn } from "@utils/types/common";
import { ClassroomTable } from "@utils/types/database/class";

// Types
import {
  ScheduleItemDB,
  ScheduleItemTable,
} from "@utils/types/database/schedule";
import { Role } from "@utils/types/person";
import { Schedule, SchedulePeriod } from "@utils/types/schedule";

/**
 * Construct a Schedule from Schedule Items from the student’s perspective
 * @param role The role of the user getting Schedule
 * @param classID The Supabase ID of the class the user is a part of
 */
export async function getSchedule(
  role: "student",
  classID: number,
  day?: Day
): Promise<Schedule>;

/**
 * Construct a Teaching Schedule from Schedule Items from the teacher’s perspective
 * @param role The role of the user getting Schedule
 * @param teacherID The Supabase ID of the user (who should be a Teacher)
 */
export async function getSchedule(
  role: "teacher",
  teacherID: number,
  day?: Day
): Promise<Schedule>;

export async function getSchedule(
  role: Role,
  id: number,
  day?: Day
): Promise<Schedule> {
  // Schedule filled with empty periods
  let schedule =
    day == undefined ? createEmptySchedule(1, 5) : createEmptySchedule(day);

  // Fetch data from Supabase
  const { data, error } = await supabase
    .from<ScheduleItemDB>("schedule_items")
    .select(
      "*, subject:subject(*), teacher:teacher(*), classroom:classroom(id,number)"
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
  if (error || !data) {
    console.error(error);
    return schedule;
  }

  // Add Supabase data to empty schedule
  for (let scheduleItem of data) {
    // Find the index of the row we want to manipulate
    const scheduleRowIndex = schedule.content.findIndex(
      (scheduleRow) => scheduleItem.day == scheduleRow.day
    );

    // Remove overlapping periods from resulting Schedule
    schedule.content[scheduleRowIndex].content = await Promise.all(
      schedule.content[scheduleRowIndex].content.map(async (schedulePeriod) => {
        // Ignore other periods (keep as is)
        if (
          !arePeriodsOverlapping(
            {
              startTime: schedulePeriod.startTime,
              duration: schedulePeriod.duration,
            },
            {
              startTime: scheduleItem.start_time,
              duration: scheduleItem.duration,
            }
          )
        )
          return schedulePeriod;

        const processedPeriod = await db2SchedulePeriod(scheduleItem, role);

        // Replace empty period
        if (schedulePeriod.subjects.length == 0) return processedPeriod;

        // If a period already exists here, just modify the `subjects` array
        schedulePeriod.subjects = schedulePeriod.subjects.concat(
          processedPeriod.subjects
        );

        return schedulePeriod;
      })
    );
  }

  schedule.content = schedule.content.map((scheduleRow) => ({
    ...scheduleRow,
    content: scheduleRow.content.sort((a, b) => a.startTime - b.startTime),
  }));

  return schedule;
}

export async function getSchedulesOfGrade(
  grade: number
): Promise<BackendReturn<Schedule[]>> {
  const { data: classes, error: classesError } = await supabase
    .from<ClassroomTable>("classroom")
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
      (classes as ClassroomTable[]).map(async (classItem) => ({
        ...(await getSchedule("student", classItem.id)),
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
  form: {
    subject: number;
    classID: number;
    room: string;
    day: number;
    startTime: number;
    duration: number;
  },
  teacherID: number
): Promise<{ data: ScheduleItemTable[] | null; error: PostgrestError | null }> {
  const { data, error } = await supabase
    .from<ScheduleItemTable>("schedule_items")
    .insert({
      subject: form.subject,
      classroom: form.classID,
      room: form.room,
      teacher: teacherID,
      day: form.day,
      start_time: form.startTime,
      duration: form.duration,
    });

  if (error || !data) {
    console.error(error);
    return { data: null, error };
  }

  return { data, error: null };
}

export async function editScheduleItem(
  form: {
    subject: number;
    classID: number;
    room: string;
    day: number;
    startTime: number;
    duration: number;
  },
  id: number
): Promise<{
  data: ScheduleItemTable[] | null;
  error: PostgrestError | null;
}> {
  const { data, error } = await supabase
    .from<ScheduleItemTable>("schedule_items")
    .update({
      subject: form.subject,
      classroom: form.classID,
      room: form.room,
      day: form.day,
      start_time: form.startTime,
      duration: form.duration,
    })
    .match({ id });

  if (error || !data) {
    console.error(error);
    return { data: null, error };
  }

  return { data, error: null };
}

export async function moveScheduleItem(
  newDay: Day,
  newSchedulePeriod: SchedulePeriod,
  teacherID: number
) {
  // Check overlap
  if (await isOverlappingExistingItems(newDay, newSchedulePeriod, teacherID))
    return {
      data: null,
      error: {
        message:
          "new period duration causes it to overlap with other relevant periods",
        details: "",
        hint: "",
        code: "",
      },
    };

  const { data, error } = await supabase
    .from<ScheduleItemTable>("schedule_items")
    .update({ day: newDay, start_time: newSchedulePeriod.startTime })
    .match({ id: newSchedulePeriod.id });

  if (error || !data) {
    console.error(error);
    return { data: null, error };
  }

  return { data, error: null };
}

export async function editScheduleItemDuration(
  day: Day,
  schedulePeriod: SchedulePeriod,
  teacherID: number
): Promise<{
  data: ScheduleItemTable[] | null;
  error: PostgrestError | null;
}> {
  // Cap duration
  if (schedulePeriod.duration < 1) schedulePeriod.duration = 1;
  else if (schedulePeriod.duration > 10) schedulePeriod.duration = 10;

  if (await isOverlappingExistingItems(day, schedulePeriod, teacherID))
    return {
      data: null,
      error: {
        message:
          "new period duration causes it to overlap with other relevant periods",
        details: "",
        hint: "",
        code: "",
      },
    };

  // If overlap, end the function; if not, push the update
  const { data, error } = await supabase
    .from<ScheduleItemTable>("schedule_items")
    .update({ duration: schedulePeriod.duration })
    .match({ id: schedulePeriod.id });

  if (error || !data) {
    console.error(error);
    return { data: null, error };
  }

  return { data, error: null };
}

export async function deleteScheduleItem(id: number): Promise<{
  data: ScheduleItemTable[] | null;
  error: PostgrestError | null;
}> {
  const { data, error } = await supabase
    .from<ScheduleItemTable>("schedule_items")
    .delete()
    .match({ id });

  if (error || !data) {
    console.error(error);
    return { data: null, error };
  }

  return { data, error: null };
}
