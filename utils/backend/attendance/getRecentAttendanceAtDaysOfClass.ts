import logError from "@/utils/helpers/logError";
import { AttendanceAtDate, AttendanceEvent } from "@/utils/types/attendance";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { addMonths } from "date-fns";
import { group } from "radash";

/**
 * Retrieves the Attendance records of a Classroom for the past 3 months.
 *
 * @param supabase The Supabase client to use.
 * @param classroomID The ID of the Classroom to retrieve Attendance records for.
 * @param classroomSize The size of the Classroom.
 *
 * @returns A Backend Return of an array of Attendance At Dates.
 */
export default async function getRecentAttendanceAtDaysOfClass(
  supabase: DatabaseClient,
  classroomID: string,
  classroomSize: number,
): Promise<BackendReturn<AttendanceAtDate[]>> {
  // Retrieve the Attendance records of a Classroom for the past 3 months
  const { data, error } = await supabase
    .from("student_attendances")
    .select(
      `date,
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
   * @param classroomSize The size of the Classroom.
   *
   * @returns The number of Students absent.
   */
  function getAbsenceCount(
    attendances: typeof data,
    attendanceEvent: AttendanceEvent,
    classroomSize: number,
  ): number | null {
    const eventAttendances = attendances!.filter(
      (attendance) => attendance.attendance_event === attendanceEvent,
    );
    return Math.max(classroomSize - eventAttendances.length, 0);
  }

  // Group the Attendance records by date, and calculate the number of students
  // absent for each Attendance Event
  const attendanceAtDates: AttendanceAtDate[] = Object.entries(
    group(data, (item) => item.date),
  ).map(([date, attendances]) => ({
    date,
    absence_count: {
      homeroom: attendances
        ? getAbsenceCount(attendances, "homeroom", classroomSize)
        : null,
      assembly: attendances
        ? getAbsenceCount(attendances, "assembly", classroomSize)
        : null,
    },
  }));

  return { data: attendanceAtDates, error: null };
}
