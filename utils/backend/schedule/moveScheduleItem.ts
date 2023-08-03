// Imports
import { logError } from "@/utils/helpers/debug";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { SchedulePeriod } from "@/utils/types/schedule";
import { omit } from "radash";

export default async function moveScheduleItem(
  supabase: DatabaseClient,
  scheduleItem: Omit<SchedulePeriod, "content"> & { day: number },
): Promise<BackendReturn<null>> {
  console.log(omit(scheduleItem, ["id"]));
  const { error } = await supabase
    .from("schedule_items")
    .update(omit(scheduleItem, ["id"]))
    .eq("id", scheduleItem.id);

  if (error) logError("moveScheduleItem", error);

  return { data: null, error };
}
