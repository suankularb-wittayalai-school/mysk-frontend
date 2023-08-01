// Imports
import { logError } from "@/utils/helpers/debug";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";

export default async function deleteScheduleItem(
  supabase: DatabaseClient,
  scheduleItemID: string,
): Promise<BackendReturn<null>> {
  const { error } = await supabase
    .from("schedule_items")
    .delete()
    .eq("id", scheduleItemID);

  if (error) logError("deleteScheduleItem", error);

  return { data: null, error };
}
