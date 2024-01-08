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
 * @param date The date of the Attendance record.
 * @param teacherID The ID of the Reacher who is recording the attendance.
 *
 * @returns An Backend Return
 */
export default async function upsertAttendance(
  supabase: DatabaseClient,
  attendance: StudentAttendance,
  date: Date | string,
  teacherID: string,
): Promise<BackendReturn> {
  // Why not just fetch the IDs during the upsert and save it in the UI? Because
  // we can’t trust the user to have the most up to date data. There may be
  // missing IDs in the UI that leads to duplicate records being created.

  // Check if the record already exists. If so, get the IDs of each event so we
  // can update them.
  const { data: existing, error: existingError } = await supabase
    .from("student_attendances")
    .select("id, attendance_event")
    .eq("student_id", attendance.student.id)
    .eq("date", typeof date === "string" ? date : getISODateString(date));

  if (existingError) {
    logError("upsertAttendance (existing)", existingError);
    return { data: null, error: existingError };
  }

  // Format the IDs into an object.
  let ids = existing?.reduce(
    (accumulate, { id, attendance_event }) => ({
      ...accumulate,
      [attendance_event]: id,
    }),
    {} as { [key in AttendanceEvent]: string },
  );

  const { data, error } = await supabase
    .from("student_attendances")
    .upsert(
      // Student Attendance combines all Attendance Events into one object.
      // This undoes that.
      Object.entries(omit(attendance, ["student"])).map(([event, value]) => ({
        // Add the ID if it exists, so we can update the record.
        ...(ids[event as AttendanceEvent]
          ? { id: ids[event as AttendanceEvent] }
          : {}),
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

  if (error) logError("upsertAttendance (upsert)", error);
  return { data: null, error };
}
