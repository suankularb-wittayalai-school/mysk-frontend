// Imports
import getPeriodBoundaryTime from "@/utils/helpers/schedule/getPeriodBoundaryTime";
import { differenceInMinutes, isPast } from "date-fns";

/**
 * Get the current period number.
 *
 * @returns A number from 1 to 10.
 */
export default function getCurrentPeriod(): number {
  return isPast(
    new Date().setHours(
      getPeriodBoundaryTime(10).hours,
      getPeriodBoundaryTime(10).min,
    ),
  )
    ? 0
    : Math.floor(
        differenceInMinutes(
          new Date(),
          new Date().setHours(
            getPeriodBoundaryTime(0).hours,
            getPeriodBoundaryTime(0).min,
          ),
        ) / 50,
      ) + 1;
}
