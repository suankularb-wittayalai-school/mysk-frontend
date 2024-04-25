import logError from "@/utils/helpers/logError";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";

/**
 * Convert a 5-digit Student ID to the Student’s database ID.
 *
 * @param supabase The Supabase Client to use.
 * @param fiveDigitID The 5-digit Student ID to search for.
 *
 * @returns A Backend Return with the Student ID, or null if not found.
 */
export default async function getStudentIDByFiveDigitID(
  supabase: DatabaseClient,
  fiveDigitID: string,
): Promise<BackendReturn<string | null>> {
  const { data, error } = await supabase
    .from("students")
    .select("id")
    .eq("student_id", fiveDigitID)
    .limit(1)
    .maybeSingle();

  if (error) {
    logError("getStudentIDByFiveDigitID", error);
    return { data: null, error };
  }

  return { data: data?.id || null, error: null };
}
