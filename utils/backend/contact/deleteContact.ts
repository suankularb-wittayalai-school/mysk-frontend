import logError from "@/utils/helpers/logError";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";

/**
 * Deletes a Contact from the database. Any links should be removed
 * automatically by Supabase via CASCADE.
 * 
 * @param supabase The Supabase client.
 * @param id The ID of the contact to be deleted.
 * 
 * @returns A Backend Return.
 */
export default async function deleteContact(
  supabase: DatabaseClient,
  id: string,
): Promise<BackendReturn> {
  const { error } = await supabase.from("contacts").delete().eq("id", id);
  if (error) logError("deleteContact", error);
  return { data: null, error };
}
