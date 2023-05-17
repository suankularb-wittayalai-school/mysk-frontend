// Helpers
import {
  getCurrentAcademicYear,
  getCurrentSemester,
} from "@/utils/helpers/date";
import { arePeriodsOverlapping } from "@/utils/helpers/schedule";

// Supabase
import { supabase } from "@/utils/supabase-client";

// Types
import { PeriodContentItem } from "@/utils/types/schedule";

export async function isOverlappingExistingItems(
  day: number,
  schedulePeriod: Pick<PeriodContentItem, "id" | "startTime" | "duration"> &
    Partial<Pick<PeriodContentItem, "subject">>,
  teacherID: number,
  options?: Partial<{ allowSameSubject: boolean }>
): Promise<boolean> {
  // Get the Schedule Items taught by this teacher in that day
  const { data: itemsSameTeacher, error: itemsSameTeacherError } =
    await supabase
      .from("schedule_items")
      .select("id, start_time, duration, subject(id)")
      .match({
        teacher: teacherID,
        day,
        year: getCurrentAcademicYear(),
        semester: getCurrentSemester(),
      });

  if (itemsSameTeacherError || !itemsSameTeacher) {
    console.error(itemsSameTeacherError);
    return false;
  }

  // Check for overlap
  for (let item of itemsSameTeacher) {
    if (
      options?.allowSameSubject &&
      (item.subject as { id: number })?.id === schedulePeriod.subject?.id
    )
      return false;
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
