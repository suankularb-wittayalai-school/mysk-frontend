// Helpers
import { arePeriodsOverlapping } from "@/utils/helpers/schedule";

// Supabase
import { supabase } from "@/utils/supabase-client";

// Types
import { PeriodContentItem } from "@/utils/types/schedule";

export async function isOverlappingExistingItems(
  day: number,
  schedulePeriod: Pick<PeriodContentItem, "id" | "startTime" | "duration">,
  teacherID: number
): Promise<boolean> {
  // Get the Schedule Items taught by this teacher in that day
  const { data: itemsSameTeacher, error: itemsSameTeacherError } =
    await supabase
      .from("schedule_items")
      .select("id, start_time, duration")
      .match({ teacher: teacherID, day });

  if (itemsSameTeacherError || !itemsSameTeacher) {
    console.error(itemsSameTeacherError);
    return false;
  }

  // Check for overlap
  for (let item of itemsSameTeacher) {
    if (
      item.id !== schedulePeriod.id &&
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
        "new period duration causes it to overlap with other relevant periods."
      );
      return true;
    }
  }

  return false;
}
