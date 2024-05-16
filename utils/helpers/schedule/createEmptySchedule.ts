import { Schedule } from "@/utils/types/schedule";
import { Day } from "date-fns";
import { list } from "radash";

/**
 * Creates a Schedule with no Subject Periods (put simply, the `content` arrays
 * are empty).
 *
 * @param startDay The first day of the Schedule (1 to 7; Monday to Sunday).
 * @param endDay The last day of the Schedule (1 to 7; Monday to Sunday).
 *
 * @returns An empty Schedule.
 */
export default function createEmptySchedule(
  startDay: Day,
  endDay?: Day,
): Schedule {
  return {
    classroom: null,
    content: list(endDay ? endDay - startDay : 0).map((day) => ({
      day: (day + startDay) as Day,
      content: list(1, 10).map((startTime) => ({
        start_time: startTime,
        duration: 1,
        content: [],
      })),
    })),
  };
}
