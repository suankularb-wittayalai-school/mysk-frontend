import { PostgrestError } from "@supabase/supabase-js";
import {
  arePeriodsOverlapping,
  createEmptySchedule,
} from "@utils/helpers/schedule";
import { supabase } from "@utils/supabaseClient";
import { ClassroomDB, ClassroomTable } from "@utils/types/database/class";
import {
  ScheduleItemDB,
  ScheduleItemTable,
} from "@utils/types/database/schedule";
import { Role } from "@utils/types/person";
import { Schedule, SchedulePeriod } from "@utils/types/schedule";
import { db2Subject } from "../database";

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

  // Find classID if role is student
  let classID = 0;
  if (role == "student") {
    const { data: classroom, error: classroomError } = await supabase
      .from<ClassroomTable>("classroom")
      .select("id, number")
      .match({ number: id })
      .limit(1)
      .single();
    if (classroomError || !classroom) {
      console.error(classroomError);
      return schedule;
    }
    classID = classroom.id;
  }

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
        ? { classroom: classID }
        : { classroom: classID, day }
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
    schedule.content[scheduleRowIndex].content = schedule.content[
      scheduleRowIndex
    ].content.filter((schedulePeriod) =>
      // Check for overlap
      {
        return !arePeriodsOverlapping(
          {
            startTime: schedulePeriod.startTime,
            duration: schedulePeriod.duration,
          },
          {
            startTime: scheduleItem.start_time,
            duration: scheduleItem.duration,
          }
        );
      }
    );

    // Now with space to add it in, add the period to resulting Schedule
    schedule.content[scheduleRowIndex].content.push({
      id: scheduleItem.id,
      startTime: scheduleItem.start_time,
      duration: scheduleItem.duration,
      subject: await db2Subject(scheduleItem.subject),
      class: scheduleItem.classroom,
      room: scheduleItem.room,
    });
  }

  return schedule;
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
  newTime: { day: Day; startTime: number },
  id: number
) {
  const { data, error } = await supabase
    .from<ScheduleItemTable>("schedule_items")
    .update({ day: newTime.day, start_time: newTime.startTime })
    .match({ id });

  if (error || !data) {
    console.error(error);
    return { data: null, error };
  }

  return { data, error: null };
}

export async function editScheduleItemDuration(
  day: number,
  schedulePeriod: SchedulePeriod,
  classID: number,
  teacherID: number,
  id: number
): Promise<{
  data: ScheduleItemTable[] | null;
  error: PostgrestError | null;
}> {
  // Cap duration
  if (schedulePeriod.duration < 1) schedulePeriod.duration = 1;
  else if (schedulePeriod.duration > 10) schedulePeriod.duration = 10;

  // Get the Schedule Items of that class or taught by this teacher in that day
  const { data: itemsSameClass, error: itemsSameClassError } = await supabase
    .from<ScheduleItemTable>("schedule_items")
    .select("id, start_time, duration")
    .match({ classroom: classID, day });

  if (itemsSameClassError || !itemsSameClass) {
    console.error(itemsSameClassError);
    return { data: null, error: itemsSameClassError };
  }

  const { data: itemsSameTeacher, error: itemsSameTeacherError } =
    await supabase
      .from<ScheduleItemTable>("schedule_items")
      .select("id, start_time, duration")
      .match({ teacher: teacherID, day });

  if (itemsSameTeacherError || !itemsSameTeacher) {
    console.error(itemsSameClassError);
    return { data: null, error: itemsSameClassError };
  }

  // Check for overlap
  const exisitingItems = itemsSameClass.concat(itemsSameTeacher);

  for (let item of exisitingItems) {
    if (
      item.id != id &&
      arePeriodsOverlapping(
        {
          startTime: schedulePeriod.startTime,
          duration: schedulePeriod.duration,
        },
        {
          startTime: item.start_time,
          duration: item.duration,
        }
      )
    ) {
      console.error(
        "new period duration causes it to overlap with other relevant periods"
      );
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
    }
  }

  // TODO: If overlap, end the function; if not, push the update
  const { data, error } = await supabase
    .from<ScheduleItemTable>("schedule_items")
    .update({ duration: schedulePeriod.duration })
    .match({ id });

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
