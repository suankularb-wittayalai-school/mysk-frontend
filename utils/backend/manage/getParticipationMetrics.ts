import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { ParticipationMetrics } from "@/utils/types/management";

/**
 * Get the participation metrics for the Manage page.
 * 
 * @param supabase The Supabase client to use.
 */
export default async function getParticipationMetrics(
  supabase: DatabaseClient,
): Promise<BackendReturn<ParticipationMetrics>> {
  return {
    data: {
      onboarded_users: 1498,
      total_users: 2654,
      total_teachers: 248,
      teachers_with_schedule: 2,
      students_with_additional_account_data: 1376,
      students_with_classroom: 2408,
    },
    error: null,
  };
}
