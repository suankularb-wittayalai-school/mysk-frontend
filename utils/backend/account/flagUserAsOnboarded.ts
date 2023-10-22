// Imports
import logError from "@/utils/helpers/logError";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";

/**
 * Flags a user as onboarded in the database.
 *
 * @param supabase The Supabase client to use.
 * @param userID The ID of the user to flag as onboarded.
 *
 * @returns A Backend Return.
 */
export default async function flagUserAsOnboarded(
  supabase: DatabaseClient,
  userID: string,
): Promise<BackendReturn> {
  const { error } = await supabase
    .from("users")
    .update({ onboarded: true })
    .eq("id", userID);

  if (error) logError("flagUserAsOnboarded", error);

  return { data: null, error };
}
