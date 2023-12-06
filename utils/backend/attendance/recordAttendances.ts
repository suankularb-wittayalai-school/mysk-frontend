import getISODateString from "@/utils/helpers/getISODateString";
import logError from "@/utils/helpers/logError";
import {
  AttendanceEvent,
  StudentAttendance,
} from "@/utils/types/attendance";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { omit } from "radash";

/**
 * Records Student Attendances in the database.
 *
 * @param supabase The Supabase client to use.
 * @param attendances The Attendance records to be saved.
 * @param teacherID The ID of the Reacher who is recording the attendance.
 *
 * @returns An empty Backend Return.
 */
export default async function recordAttendances(
  supabase: DatabaseClient,
  attendances: StudentAttendance[],
  date: Date | string,
  teacherID: string,
): Promise<BackendReturn> {
  const { error } = await supabase.from("student_attendances").upsert(
    attendances
      .map((attendance) =>
        // Student Attendance combines all Attendance Events into one object.
        // This undoes that.
        Object.entries(omit(attendance, ["student"])).map(([event, value]) => ({
          // Include the ID if available for upserting.
          ...(value.id ? { id: value.id } : {}),
          student_id: attendance.student.id,
          attendance_event: event as AttendanceEvent,
          checker_id: teacherID,
          date: typeof date === "string" ? date : getISODateString(date),
          is_present: value.is_present === true, // Crush `null` to `false`
          absence_reason: value.absence_reason,
          absence_type: value.absence_type,
        })),
      )
      .flat(),
  );

  if (error) logError("recordAttendances", error);
  return { data: null, error };
}
