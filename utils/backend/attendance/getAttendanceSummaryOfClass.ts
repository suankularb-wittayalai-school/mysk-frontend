import getISODateString from "@/utils/helpers/getISODateString";
import logError from "@/utils/helpers/logError";
import { AttendanceAtDate, AttendanceEvent } from "@/utils/types/attendance";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { addMonths, eachDayOfInterval, isWeekend } from "date-fns";
import { group, sort, unique } from "radash";

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
      absence_type,
      students!inner(id, classroom_students!inner(classroom_id))`,
    )
    .eq("students.classroom_students.classroom_id", classroomID)
    .order("date", { ascending: false })
    .gt("date", getISODateString(addMonths(new Date(), -3)));

  if (error) {
    logError("getRecentAttendanceAtDaysOfClass", error);
    return { data: null, error };
  }

  /**
   * Calculate the number of Students absent for a given date.
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
    // Get the Attendance records for the given Attendance Event
    // (`unique` is used in case a Student has multiple Attendance records for)
    const attendancesOfEvent = unique(
      attendances!.filter(
        (attendance) => attendance.attendance_event === attendanceEvent,
      ),
      (attendance) => attendance.students!.id,
    );
    return attendancesOfEvent.length
      ? attendancesOfEvent.filter(
          (attendance) =>
            !attendance.is_present && attendance.absence_type !== "late",
        ).length
      : null;
  }

  // To simply the code below, return an empty array right away if there are no
  // Attendance records
  if (data.length === 0) return { data: [], error: null };

  // Get the earliest date of the Attendance records
  const earliestDate = new Date(data[data.length - 1].date);

  // Group the Attendance records by date, and calculate the number of students
  // absent for each Attendance Event
  const attendanceAtDates: AttendanceAtDate[] = sort(
    unique(
      Object.entries(group(data, (item) => item.date))
        // Add the number of absent Students for each Attendance Event
        .map(([date, attendances]) => ({
          date,
          absence_count: {
            homeroom: getAbsenceCount(attendances!, "homeroom"),
            assembly: getAbsenceCount(attendances!, "assembly"),
          },
        }))
        // Add the dates that are missing from the Attendance records
        .concat(
          eachDayOfInterval({ start: earliestDate, end: new Date() })
            // Remove weekends
            .filter((date) => !isWeekend(new Date(date)))
            .map((date) => ({
              date: getISODateString(date),
              absence_count: { homeroom: null, assembly: null },
            })),
        ),
      // Remove overlapping dates
      // (The dates with data come first anyway so data wouldn’t be overwritten)
      (item) => item.date,
    ),
    // Sort by date
    (item) => new Date(item.date).getTime(),
    true, // <-- Descending
  );

  return { data: attendanceAtDates, error: null };
}
