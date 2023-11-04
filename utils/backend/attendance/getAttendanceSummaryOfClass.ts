import logError from "@/utils/helpers/logError";
import { AttendanceAtDate, AttendanceEvent } from "@/utils/types/attendance";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { addMonths } from "date-fns";
import { group } from "radash";

/**
 * Get a summary of absences of a Classroom for the past 3 months.
 *
 * @param supabase The Supabase client to use.
 * @param classroomID The ID of the Classroom to get a summary for.
 *
 * @returns A Backend Return of an array of Attendance At Dates.
 */
export default async function getAttendanceSummaryOfClass(
  supabase: DatabaseClient,
  classroomID: string,
): Promise<BackendReturn<AttendanceAtDate[]>> {
  // Retrieve the Attendance records of a Classroom for the past 3 months
  const { data, error } = await supabase
    .from("student_attendances")
    .select(
      `date,
      is_present,
      attendance_event,
      students!inner(classroom_students!inner(classroom_id))`,
    )
    .eq("students.classroom_students.classroom_id", classroomID)
    .order("date", { ascending: false })
    .gt("date", addMonths(new Date(), -3).toISOString().split("T")[0]);

  if (error) {
    logError("getRecentAttendanceAtDaysOfClass", error);
    return { data: null, error };
  }

  /**
   * Caluclate the number of Students absent for a given date.
   *
   * @param attendances The Attendace data of a date.
   * @param attendanceEvent The Attendance Event to retrieve records for, assembly or homeroom.
   *
   * @returns The number of Students absent.
   */
  function getAbsenceCount(
    attendances: typeof data,
    attendanceEvent: AttendanceEvent,
  ): number | null {
    const attendancesOfEvent = attendances!.filter(
      (attendance) => attendance.attendance_event === attendanceEvent,
    );
    return attendancesOfEvent.length
      ? attendancesOfEvent.filter((attendance) => !attendance.is_present).length
      : null;
  }

  // Group the Attendance records by date, and calculate the number of students
  // absent for each Attendance Event
  const attendanceAtDates: AttendanceAtDate[] = Object.entries(
    group(data, (item) => item.date),
  ).map(([date, attendances]) => ({
    date,
    absence_count: {
      homeroom: getAbsenceCount(attendances!, "homeroom"),
      assembly: getAbsenceCount(attendances!, "assembly"),
    },
  }));

  return { data: attendanceAtDates, error: null };
}
