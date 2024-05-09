import setDateToPeriodTime from "@/utils/helpers/schedule/setDateToPeriodTime";
import { differenceInMinutes } from "date-fns";
import { toZonedTime } from "date-fns-tz";

/**
 * Get the current period number.
 *
 * @returns A number from 1 to 10.
 */
export default function periodNumberAt(date: Date = new Date()): number {
  const zonedDate = toZonedTime(date, process.env.NEXT_PUBLIC_SCHOOL_TZ);

  // Calculate the period number from the distance from now to the start of
  // period 1.
  const calculatedPeriod =
    Math.floor(
      differenceInMinutes(zonedDate, setDateToPeriodTime(zonedDate, 1)) / 50,
    ) + 1;
  // Clamp the calculated period to be between 1 and 10.
  return Math.min(Math.max(calculatedPeriod, 1), 10);
}
