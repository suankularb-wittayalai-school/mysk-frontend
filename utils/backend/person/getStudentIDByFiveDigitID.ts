import logError from "@/utils/helpers/logError";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";

/**
 * Find a Student’s database ID by their email.
 *
 * @param supabase The Supabase Client to use.
 * @param email The email of the Student to find.
 *
 * @returns A Backend Return with the Student ID, or null if not found.
 */
export default async function getStudentIDByEmail(
  supabase: DatabaseClient,
  email: string,
): Promise<BackendReturn<string | null>> {
  const { data, error } = await supabase
    .from("users")
    .select(`students(id)`)
    .eq("email", email)
    .limit(1)
    .maybeSingle();

  if (error) {
    logError("", error);
    return { data: null, error };
  }

  return { data: data?.students[0]?.id || null, error: null };
}
