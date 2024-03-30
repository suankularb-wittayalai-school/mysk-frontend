import getISODateString from "@/utils/helpers/getISODateString";
import logError from "@/utils/helpers/logError";
import { StudentAttendance } from "@/utils/types/attendance";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { objectify } from "radash";

/**
 * Retrieves the Attendance records of a Student for a specific date.
 *
 * @param supabase The Supabase client to use.
 * @param studentID The ID of the Student to retrieve Attendance records for.
 * @param date The date to retrieve Attendance records for.
 *
 * @returns A Backend Return of a Student Attendance object without the Student part because that wouldn’t make sense, would it.
 */
export default async function getAttendanceOfStudent(
  supabase: DatabaseClient,
  studentID: string,
  date: Date | string,
): Promise<BackendReturn<Omit<StudentAttendance, "student">>> {
  const { data, error } = await supabase
    .from("student_attendances")
    .select(
      `id,
      is_present,
      attendance_event,
      absence_type,
      absence_reason`,
    )
    .eq("student_id", studentID)
    .eq("date", typeof date === "string" ? date : getISODateString(date));

  if (error) {
    logError("getAttendanceOfStudent", error);
    return { data: null, error };
  }

  return {
    data: objectify(data, (row) => row.attendance_event),
    error: null,
  };
}
