// Imports
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { PeriodLocation, SchedulePeriod } from "@/utils/types/schedule";

export default async function moveScheduleItem(
  supabase: DatabaseClient,
  location: Omit<SchedulePeriod, "content"> & { day: number },
): Promise<BackendReturn<null>> {
  const { error } = await supabase
    .from("schedule_items")
    .update(location)
    .eq("id", location.id);

  return { data: null, error };
}
