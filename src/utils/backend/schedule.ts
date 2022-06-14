import { PostgrestError } from "@supabase/supabase-js";
import { createEmptySchedule } from "@utils/helpers/schedule";
import { supabase } from "@utils/supabaseClient";
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
  classID: number
): Promise<Schedule>;

/**
 * Construct a Teaching Schedule from Schedule Items from the teacher’s perspective
 * @param role The role of the user getting Schedule
 * @param teacherID The Supabase ID of the user (who should be a Teacher)
 */
export async function getSchedule(
  role: "teacher",
  teacherID: number
): Promise<Schedule>;

export async function getSchedule(role: Role, id: number): Promise<Schedule> {
  // Schedule filled with empty periods
  let schedule = createEmptySchedule(1, 5);

  // Fetch data from Supabase
  const { data, error } = await supabase
    .from<ScheduleItemDB>("schedule_items")
    .select("*, subject:subject(*), teacher:teacher(*), classroom:classroom(*)")
    .match(
      role == "teacher"
        ? // Match teacher if role is teacher
          { teacher: id }
        : // Match classroom if role is student
          { classroom: id }
    );

  // Return an empty Schedule if fetch failed
  if (error || !data) {
    console.error(error);
    return schedule;
  }

  // TODO: Add Supabase data to empty schedule

  return schedule;
}

/**
 * Insert a Schedule Item
 * @param day The day this Schedule Period is in
 * @param schedulePeriod Frontend-side Schedule Period
 * @param subjectID The Supabase ID of the Subject taught in this Schedule Period
 * @param teacherID The Supabase ID of the Teacher teaching this Schedule Period
 */
export async function addPeriodtoSchedule(
  day: number,
  schedulePeriod: SchedulePeriod,
  subjectID: number,
  teacherID: number
): Promise<{ data: ScheduleItemTable[] | null; error: PostgrestError | null }> {
  const { data, error } = await supabase
    .from<ScheduleItemTable>("schedule_items")
    .insert({
      subject: subjectID,
      teacher: teacherID,
      day,
      start_time: schedulePeriod.startTime,
      duration: schedulePeriod.duration,
      room: schedulePeriod.room,
    });

  if (error || !data) {
    console.error(error);
    return { data: null, error };
  }

  return { data, error: null };
}
