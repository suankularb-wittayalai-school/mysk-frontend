import { ManagementAttendanceSummary } from "@/utils/types/attendance";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";

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
  return {
    data: {
      today: { presence: 2436, late: 356, absence: 38 },
      this_week: { presence: 2785, late: 7, absence: 38 },
    },
    error: null,
  };
}
