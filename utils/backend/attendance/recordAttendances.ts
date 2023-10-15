import logError from "@/utils/helpers/logError";
import { AttendanceEvent, StudentAttendance } from "@/utils/types/attendance";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";

/**
 * Records Student Attendances in the database.
 *
 * @param supabase The Supabase client to use.
 * @param attendances The Attendance records to be saved.
 * @param attendanceEvent The type of Attendance event, assembly or homeroom.
 * @param teacherID The ID of the Reacher who is recording the attendance.
 *
 * @returns An empty Backend Return.
 */
export default async function recordAttendances(
  supabase: DatabaseClient,
  attendances: StudentAttendance[],
  attendanceEvent: AttendanceEvent,
  teacherID: string,
): Promise<BackendReturn> {
  const { error } = await supabase.from("student_attendances").insert(
    attendances.map((attendance) => ({
      student_id: attendance.student.id,
      attendance_event: attendanceEvent,
      checker_id: teacherID,
      date: new Date().toISOString(),
      is_present: attendance.is_present,
      absence_reason: attendance.absence_reason,
      absence_type: attendance.absence_type,
    })),
  );

  if (error) logError("recordAttendances", error);
  return { data: null, error };
}
