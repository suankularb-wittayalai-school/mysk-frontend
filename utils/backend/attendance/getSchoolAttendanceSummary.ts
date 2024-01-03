import getISODateString from "@/utils/helpers/getISODateString";
import logError from "@/utils/helpers/logError";
import { ManagementAttendanceSummary } from "@/utils/types/attendance";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";

/**
 * Get the Attendance summary of the entire school for Teachers.
 *
 * @param supabase The Supabase client to use.
 * @param date The date to get the summary for.
 *
 * @returns A Backend Return with a Management Attendance Summary.
 */
export default async function getSchoolAttendanceSummary(
  supabase: DatabaseClient,
  date: string | Date,
): Promise<BackendReturn<ManagementAttendanceSummary>> {
  const dateString = typeof date === "string" ? date : getISODateString(date);

  const counts = await Promise.all([
    supabase
      .from("student_attendances")
      .select("id", { count: "exact", head: true })
      .eq("date", dateString)
      .eq("attendance_event", "homeroom")
      .eq("is_present", true),
    supabase
      .from("student_attendances")
      .select("id", { count: "exact", head: true })
      .eq("date", dateString)
      .eq("attendance_event", "assembly")
      .eq("absence_type", "late"),
    supabase
      .from("student_attendances")
      .select("id", { count: "exact", head: true })
      .eq("date", dateString)
      .eq("attendance_event", "homeroom")
      .eq("is_present", false),
  ]);

  const [
    { count: presence, error: presenceError },
    { count: late, error: lateError },
    { count: absence, error: absenceError },
  ] = counts;

  const error = presenceError || lateError || absenceError;
  if (error) {
    logError("getTodaySchoolAttendanceSummary", error);
    return { data: null, error: error };
  }

  return {
    data: { presence, late, absence } as ManagementAttendanceSummary,
    error: null,
  };
}
