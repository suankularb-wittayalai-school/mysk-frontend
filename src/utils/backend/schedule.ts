import { createEmptySchedule as createEmptySchedule } from "@utils/helpers/schedule";
import { supabase } from "@utils/supabaseClient";
import { ScheduleItemDB } from "@utils/types/database/schedule-item";
import { Role } from "@utils/types/person";
import { Schedule } from "@utils/types/schedule";

export async function getSchedule(
  role: "student",
  classID: number
): Promise<Schedule>;
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
    .select("*")
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

export function addPeriodtoSchedule() {}
