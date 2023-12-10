import getISODateString from "@/utils/helpers/getISODateString";
import logError from "@/utils/helpers/logError";
import { ManagementAttendanceSummary } from "@/utils/types/attendance";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { addDays } from "date-fns";
import { list } from "radash";

/**
 * Gets **aproximate** values summarising the Attendance of all Classrooms on a
 * given week, starting from the given Monday.
 *
 * This function is only to be used in charts, as it does not return the precise
 * values. **Do not display the values returned by this function to the user.**
 *
 * @param supabase The Supabase client to use.
 * @param monday The Monday of the week to get the Attendance summary of.
 *
 * @returns A Backend Return containing the Attendance summary of each day of the week.
 */
export default async function getWeekAttendance(
  supabase: DatabaseClient,
  monday: Date,
): Promise<BackendReturn<ManagementAttendanceSummary[]>> {
  const week = await Promise.all(
    // Iterate over a list of 5 elements (representing 5 days of the week).
    list(4).map(async (i) => {
      const dateString = getISODateString(addDays(monday, i));

      // Fetch Attendance counts for the current day. The higher one will act as
      // the cap.
      const { count: assemblyAttendance, error: assemblyAttendanceError } =
        await supabase
          .from("student_attendances")
          .select("id", { count: "estimated", head: true })
          .eq("attendance_event", "assembly")
          .eq("date", dateString);
      const { count: homeroomAttendance, error: homeroomAttendanceError } =
        await supabase
          .from("student_attendances")
          .select("id", { count: "estimated", head: true })
          .eq("attendance_event", "homeroom")
          .eq("date", dateString);

      // The preferred Attendance Event is the one with the highest Attendance
      const preferredAttendanceEvent =
        homeroomAttendance! > assemblyAttendance! ? "homeroom" : "assembly";
      const attendance = Math.max(homeroomAttendance!, assemblyAttendance!);
      if (i === 4) console.log(attendance, 175 + 8 + 18);

      // Fetch late count for the current day.
      const { count: late, error: lateError } = await supabase
        .from("student_attendances")
        .select("id", { count: "estimated", head: true })
        .eq("attendance_event", "assembly")
        .eq("absence_reason", "late")
        .eq("date", dateString);

      // Fetch absence count for the current day.
      const { count: absence, error: absenceError } = await supabase
        .from("student_attendances")
        .select("id", { count: "estimated", head: true })
        .eq("attendance_event", preferredAttendanceEvent)
        .eq("is_present", false)
        .neq("absence_reason", "late")
        .eq("date", dateString);

      // Error handling
      const error =
        assemblyAttendanceError ||
        homeroomAttendanceError ||
        lateError ||
        absenceError;
      if (error) {
        logError("getWeekAttendance", error);
        return { presence: 0, late: 0, absence: 0 };
      }

      return {
        // The presence count is those who aren’t late or absent. This is done
        // this way to ensure that the sum of each status does not exceed the
        // actual attendance count.
        presence: attendance - late! - absence!,
        late,
        absence,
      } as ManagementAttendanceSummary;
    }),
  );

  return { data: week, error: null };
}
