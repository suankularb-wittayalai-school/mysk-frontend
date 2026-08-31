import logError from "@/utils/helpers/logError";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";

/**
 * Retrieves the List of Cheer teacher ID.
 *
 * @param supabase The Supabase client to use.
 *
 * @returns A Backend Return of an array of teacher ID.
 */
export default async function getCheerTeacher(
  supabase: DatabaseClient,
): Promise<BackendReturn<{ teacher_id: string }[]>> {
  const { data, error } = await supabase
    .from("cheer_practice_teachers")
    .select("teacher_id");
  if (error) {
    logError("getCheerTeacher", error);
    return { data: null, error };
  }
  return { data, error: null };
}
