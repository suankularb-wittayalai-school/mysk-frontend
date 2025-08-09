import logError from "@/utils/helpers/logError";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";

export default async function getCheerStaffs(
  supabase: DatabaseClient,
): Promise<BackendReturn<{ student_id: string }[]>> {
  const { data, error } = await supabase
    .from("cheer_practice_staffs")
    .select("student_id");
  if (error) {
    logError("getCheerStaffs", error);
    return { data: null, error };
  }
  return { data, error: null };
}
