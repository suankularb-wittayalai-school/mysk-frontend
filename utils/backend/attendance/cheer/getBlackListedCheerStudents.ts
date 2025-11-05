import logError from "@/utils/helpers/logError";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";

export default async function getBlackListedCheerStudents(
  supabase: DatabaseClient,
): Promise<BackendReturn<{ student_id: string }[]>> {
  const { data, error } = await supabase
    .from("cheer_practice_blacklisted_students")
    .select("student_id");
  if (error) {
    logError("getBlackListedCheerStudents", error);
    return { data: null, error: error };
  }
  return { data, error: null };
}
