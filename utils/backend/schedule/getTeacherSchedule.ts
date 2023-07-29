// Imports
import { createEmptySchedule } from "@/utils/helpers/schedule";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { Schedule } from "@/utils/types/schedule";

/**
 * Construct a Schedule from Schedule Items from the student’s perspective.
 *
 * @param teacherID The Supabase ID of the teacher.
 */
export default async function getTeacherSchedule(
  supabase: DatabaseClient,
  teacherID: string,
): Promise<BackendReturn<Schedule>> {
  // Schedule filled with empty periods
  let schedule = createEmptySchedule(1, 5);

  return { data: schedule, error: null };
}
