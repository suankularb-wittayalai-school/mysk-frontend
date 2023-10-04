import logError from "@/utils/helpers/logError";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { PeriodContentItem } from "@/utils/types/schedule";
import { pick } from "radash";

export default async function updateScheduleItemDuration(
  supabase: DatabaseClient,
  scheduleItem: Pick<PeriodContentItem, "id" | "duration">,
): Promise<BackendReturn<null>> {
  const { error } = await supabase
    .from("schedule_items")
    .update(pick(scheduleItem, ["duration"]))
    .eq("id", scheduleItem.id);

  if (error) logError("moveScheduleItem", error);

  return { data: null, error };
}
