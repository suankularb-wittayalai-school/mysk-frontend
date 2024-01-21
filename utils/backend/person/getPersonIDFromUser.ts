import logError from "@/utils/helpers/logError";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { User, UserRole } from "@/utils/types/person";

/**
 * Gets the Person ID of a user.
 * 
 * @param supabase The Supabase client to use.
 * @param user The user to get the Person ID of.
 * 
 * @returns A Backend Return with the Person ID string.
 */
export default async function getPersonIDFromUser(
  supabase: DatabaseClient,
  user: Pick<User, "id" | "role">,
): Promise<BackendReturn<string>> {
  const { data, error } = await supabase
    .from(user.role === UserRole.teacher ? "teachers" : "students")
    .select("person_id")
    .eq("user_id", user.id)
    .limit(1)
    .single();

  if (error) {
    logError("getPersonIDFromUser", error);
    return { data: null, error };
  }

  return { data: data!.person_id, error: null };
}
