// Imports
import setDateToPeriodTime from "@/utils/helpers/schedule/setDateToPeriodTime";
import { isWithinInterval } from "date-fns";

/**
 * If a given date is within a given period.
 *
 * @param date The date to check against.
 * @param periodDay The day of the period to check against.
 * @param periodStart The starting period number of the period to check against.
 * @param periodDuration The duration of the period to check against.
 *
 * @returns A boolean representing whether the given date is within the given period.
 */
export default function isInPeriod(
  date: Date,
  periodDay: Date,
  periodStart: number,
  periodDuration: number,
) {
  return isWithinInterval(date, {
    start: setDateToPeriodTime(periodDay, periodStart, "start"),
    end: setDateToPeriodTime(
      periodDay,
      periodStart + periodDuration - 1,
      "end",
    ),
  });
}
