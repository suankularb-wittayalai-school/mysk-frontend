import getISODateString from "@/utils/helpers/getISODateString";
import logError from "@/utils/helpers/logError";
import { AttendanceEvent, StudentAttendance } from "@/utils/types/attendance";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { omit } from "radash";

/**
 * Upsert a Student Attendance record to the database.
 *
 * @param supabase The Supabase client to use.
 * @param attendances The Attendance record to be upserted.
 * @param teacherID The ID of the Reacher who is recording the attendance.
 *
 * @returns A Backend Return with the IDs of each event of the inserted Attendance record.
 */
export default async function upsertAttendance(
  supabase: DatabaseClient,
  attendance: StudentAttendance,
  date: Date | string,
  teacherID: string,
): Promise<BackendReturn<{ [key in AttendanceEvent]: string }>> {
  const { data, error } = await supabase
    .from("student_attendances")
    .upsert(
      // Student Attendance combines all Attendance Events into one object.
      // This undoes that.
      Object.entries(omit(attendance, ["student"])).map(([event, value]) => ({
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
    .select(`id, attendance_event`);

  if (error) {
    logError("upsertAttendance", error);
    return { data: null, error };
  }

  const ids = Object.fromEntries(
    data!.map((attendance) => [attendance.attendance_event, attendance.id]),
  ) as { [key in AttendanceEvent]: string };

  return { data: ids, error: null };
}
