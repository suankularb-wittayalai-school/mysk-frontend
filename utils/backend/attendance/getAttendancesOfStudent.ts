import getISODateString from "@/utils/helpers/getISODateString";
import logError from "@/utils/helpers/logError";
import { StudentAttendance } from "@/utils/types/attendance";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { group, objectify } from "radash";

/**
 * Retrieves the Attendance records of a Student for a range of dates.
 *
 * @param supabase The Supabase client to use.
 * @param studentID The ID of the Student to retrieve Attendance records for.
 * @param interval The start and end dates to retrieve the Attendance records for.
 *
 * @returns A Backend Return of an array of Student Attendance objects.
 */
export default async function getAttendancesOfStudent(
  supabase: DatabaseClient,
  studentID: string,
  interval: { [key in "start" | "end"]: Date | string },
): Promise<
  BackendReturn<(Omit<StudentAttendance, "student"> & { date: string })[]>
> {
  const { data, error } = await supabase
    .from("student_attendances")
    .select(
      `id,
      date,
      is_present,
      attendance_event,
      absence_type,
      absence_reason`,
    )
    .eq("student_id", studentID)
    .gte("date", getISODateString(interval.start))
    .lte("date", getISODateString(interval.end))
    .order("date");

  if (error) {
    logError("getAttendancesOfStudent", error);
    return { data: null, error };
  }

  return {
    data: Object.entries(group(data, (row) => row.date)).map(
      ([date, attendances]) => ({
        date,
        ...(objectify(attendances!, (row) => row.attendance_event) as Omit<
          StudentAttendance,
          "student"
        >),
      }),
    ),
    error: null,
  };
}
