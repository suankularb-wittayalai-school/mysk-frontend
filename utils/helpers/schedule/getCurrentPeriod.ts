import getTodaySetToPeriodTime from "@/utils/helpers/schedule/getTodaySetToPeriodTime";
import { differenceInMinutes } from "date-fns";

/**
 * Get the current period number.
 *
 * @returns A number from 1 to 10.
 */
export default function getCurrentPeriod(): number {
  // Calculate the period number from the distance from now to the start of
  // period 1.
  const calculatedPeriod =
    Math.floor(
      differenceInMinutes(new Date(), getTodaySetToPeriodTime(1)) / 50,
    ) + 1;
  // Clamp the calculated period to be between 1 and 10.
  return Math.min(Math.max(calculatedPeriod), 1), 10;
}
