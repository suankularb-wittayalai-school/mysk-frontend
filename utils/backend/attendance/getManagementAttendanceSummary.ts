import getISODateString from "@/utils/helpers/getISODateString";
import lastWeekday from "@/utils/helpers/lastWeekday";
import logError from "@/utils/helpers/logError";
import { ManagementAttendanceSummary } from "@/utils/types/attendance";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { getDay, startOfWeek } from "date-fns";

/**
 * Get the attendance summary for the Manage page.
 *
 * @param supabase The Supabase client to use.
 *
 * @returns A Backend Return with a Management Attendance Summary for today and this week.
 */
export default async function getManagementAttendanceSummary(
  supabase: DatabaseClient,
): Promise<
  BackendReturn<{ [key in "today" | "this_week"]: ManagementAttendanceSummary }>
> {
  const todayString = getISODateString(lastWeekday(new Date()));
  const mondayString = getISODateString(
    startOfWeek(lastWeekday(new Date()), { weekStartsOn: 1 }),
  );

  const {
    count: presentAtAssemblyCountToday,
    error: presenceAtAssemblyTodayError,
  } = await supabase
    .from("student_attendances")
    .select("id", { count: "exact", head: true })
    .eq("date", todayString)
    .eq("attendance_event", "assembly")
    .eq("is_present", true);

  if (presenceAtAssemblyTodayError) {
    logError(
      "getManagementAttendanceSummary (today assembly presence)",
      presenceAtAssemblyTodayError,
    );
    return { data: null, error: presenceAtAssemblyTodayError };
  }

  const {
    count: presenceAtHomeroomStudentCountToday,
    error: presenceAtHomeroomStudentCountTodayError,
  } = await supabase
    .from("student_attendances")
    .select(`id`, { count: "exact", head: true })
    .eq("date", todayString)
    .eq("attendance_event", "homeroom")
    .eq("is_present", true);

  if (presenceAtHomeroomStudentCountTodayError) {
    logError(
      "getManagementAttendanceSummary (today homeroom presence)",
      presenceAtHomeroomStudentCountTodayError,
    );
    return { data: null, error: presenceAtHomeroomStudentCountTodayError };
  }

  /**
   * The Attendance Event with the higher presence count. This will be used to
   * determine which Attendance Event to show the Attendance Summary for today.
   */
  const higherPresenceEventToday =
    (presentAtAssemblyCountToday ?? 0) >
    (presenceAtHomeroomStudentCountToday ?? 0)
      ? "assembly"
      : "homeroom";

  /**
   * The number of Students present for the Attendance Event with the higher
   * presence count.
   */
  const presenceToShowForToday =
    higherPresenceEventToday === "assembly"
      ? presentAtAssemblyCountToday
      : presenceAtHomeroomStudentCountToday;

  const { count: lateToday, error: lateTodayError } = await supabase
    .from("student_attendances")
    .select("id", { count: "exact", head: true })
    .eq("date", todayString)
    .eq("attendance_event", higherPresenceEventToday)
    .eq("absence_type", "late");

  if (lateTodayError) {
    logError("getManagementAttendanceSummary (today late)", lateTodayError);
    return { data: null, error: lateTodayError };
  }

  const { count: absenceToday, error: absenceError } = await supabase
    .from("student_attendances")
    .select("id", { count: "exact", head: true })
    .eq("date", todayString)
    .eq("attendance_event", higherPresenceEventToday)
    .neq("absence_type", "late");

  if (absenceError) {
    logError("getManagementAttendanceSummary (today absence)", absenceError);
    return { data: null, error: absenceError };
  }

  // === This week ===

  const {
    count: presentAtAssemblyThisWeek,
    error: presentAtAssemblyThisWeekError,
  } = await supabase
    .from("student_attendances")
    .select("id", { count: "exact", head: true })
    .gte("date", mondayString)
    .eq("attendance_event", "assembly")
    .eq("is_present", true);

  if (presentAtAssemblyThisWeekError) {
    logError(
      "getManagementAttendanceSummary (this week assembly presence)",
      presentAtAssemblyThisWeekError,
    );
    return { data: null, error: presentAtAssemblyThisWeekError };
  }

  const {
    count: presentAtHomeroomThisWeek,
    error: presentAtHomeroomThisWeekError,
  } = await supabase
    .from("student_attendances")
    .select("id", { count: "exact", head: true })
    .gte("date", mondayString)
    .eq("attendance_event", "homeroom")
    .eq("is_present", true);

  if (presentAtHomeroomThisWeekError) {
    logError(
      "getManagementAttendanceSummary (this week homeroom presence)",
      presentAtHomeroomThisWeekError,
    );
    return { data: null, error: presentAtHomeroomThisWeekError };
  }

  /**
   * The Attendance Event with the higher presence count. This will be used to
   * determine which Attendance Event to show the Attendance Summary for this
   * week.
   */
  const higherPresenceEventThisWeek =
    (presentAtAssemblyThisWeek ?? 0) > (presentAtHomeroomThisWeek ?? 0)
      ? "assembly"
      : "homeroom";

  /**
   * The number of days since Monday, inclusive. This will be used to
   * calculate the average Attendance for this week.
   */
  const daysSinceMonday = Math.min(getDay(new Date()), 5);

  /**
   * The number of Students present this week for the Attendance Event with the
   * higher presence count.
   */
  const presenceToShowThisWeek =
    higherPresenceEventThisWeek === "assembly"
      ? presentAtAssemblyThisWeek
      : presentAtHomeroomThisWeek;

  const { count: lateThisWeek, error: lateThisWeekError } = await supabase
    .from("student_attendances")
    .select("id", { count: "exact", head: true })
    .gte("date", mondayString)
    .eq("attendance_event", higherPresenceEventThisWeek)
    .eq("absence_type", "late");

  if (lateThisWeekError) {
    logError(
      "getManagementAttendanceSummary (this week late)",
      lateThisWeekError,
    );
    return { data: null, error: lateThisWeekError };
  }

  const { count: absenceThisWeek, error: absenceThisWeekError } = await supabase
    .from("student_attendances")
    .select("id", { count: "exact", head: true })
    .gte("date", mondayString)
    .eq("attendance_event", higherPresenceEventThisWeek)
    .neq("absence_type", "late");

  if (absenceThisWeekError) {
    logError(
      "getManagementAttendanceSummary (this week absence)",
      absenceThisWeekError,
    );
    return { data: null, error: absenceThisWeekError };
  }

  return {
    data: {
      today: {
        presence: presenceToShowForToday ?? 0,
        late: lateToday ?? 0,
        absence: absenceToday ?? 0,
      },
      this_week: {
        presence: (presenceToShowThisWeek ?? 0) / daysSinceMonday,
        late: (lateThisWeek ?? 0) / daysSinceMonday,
        absence: (absenceThisWeek ?? 0) / daysSinceMonday,
      },
    },
    error: null,
  };
}
