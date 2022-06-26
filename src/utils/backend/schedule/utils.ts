// Helpers
import { arePeriodsOverlapping } from "@utils/helpers/schedule";

// Supabase
import { supabase } from "@utils/supabaseClient";

// Types
import { ScheduleItemTable } from "@utils/types/database/schedule";
import { SchedulePeriod } from "@utils/types/schedule";

export async function isOverlappingExistingItems(
  day: Day,
  schedulePeriod: SchedulePeriod,
  teacherID: number
): Promise<boolean> {
  // Get the Schedule Items of that class or taught by this teacher in that day
  const { data: itemsSameClass, error: itemsSameClassError } = await supabase
    .from<ScheduleItemTable>("schedule_items")
    .select("id, start_time, duration")
    .match({ classroom: schedulePeriod.class?.id, day });

  if (itemsSameClassError || !itemsSameClass) {
    console.error(itemsSameClassError);
    return false;
  }

  const { data: itemsSameTeacher, error: itemsSameTeacherError } =
    await supabase
      .from<ScheduleItemTable>("schedule_items")
      .select("id, start_time, duration")
      .match({ teacher: teacherID, day });

  if (itemsSameTeacherError || !itemsSameTeacher) {
    console.error(itemsSameClassError);
    return false;
  }

  // Check for overlap
  const exisitingItems = itemsSameClass.concat(itemsSameTeacher);

  for (let item of exisitingItems) {
    if (
      item.id != schedulePeriod.id &&
      arePeriodsOverlapping(
        {
          startTime: schedulePeriod.startTime,
          duration: schedulePeriod.duration,
        },
        {
          startTime: item.start_time,
          duration: item.duration,
        }
      )
    ) {
      console.error(
        "new period duration causes it to overlap with other relevant periods"
      );
      return true;
    }
  }

  return false;
}
