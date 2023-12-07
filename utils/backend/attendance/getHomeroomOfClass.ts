import logError from "@/utils/helpers/logError";
import { HomeroomContent } from "@/utils/types/attendance";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";

/**
 * Gets the Homeroom Content of a Classroom on a specific date if it exists.
 *
 * @param supabase The Supabase client to use.
 * @param classID The ID of the Classroom to get the Homeroom Content of.
 * @param date The date to get the Homeroom Content of.
 *
 * @returns A Backend Return with the Homeroom Content.
 */
export default async function getHomeroomOfClass(
  supabase: DatabaseClient,
  classID: string,
  date: string,
): Promise<BackendReturn<HomeroomContent | null>> {
  const { data, error } = await supabase
    .from("classroom_homeroom_contents")
    .select(`id, date, homeroom_content`)
    .eq("classroom_id", classID)
    .eq("date", date)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    logError("getHomeroomOfClass", error);
    return { data: null, error };
  }

  return { data, error: null };
}
