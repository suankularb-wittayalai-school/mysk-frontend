// Imports
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { logError } from "@/utils/helpers/debug";
import { User } from "@/utils/types/person";

/**
 * TODO
 *
 * @param supabase A Supabase client.
 * @param email TODO
 *
 * @returns TODO
 */
export default async function getUserByEmail(
  supabase: DatabaseClient,
  email: string,
): Promise<BackendReturn<User | null>> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .maybeSingle();

  if (error) {
    logError("getUserByEmail", error);
    return { data: null, error };
  }

  return { data, error: null };
}
