// Imports
import getPeriodBoundaryTime from "@/utils/helpers/schedule/getPeriodBoundaryTime";
import { isFuture, isPast, isSaturday, isSunday } from "date-fns";

/**
 * Check if school is in session now.
 *
 * @returns
 * `before` — it’s morning and school haven’t started;
 * `in-session` — school is in session;
 * `after` —  it’s after school or it’s the weekend.
 */
export default function getCurrentSchoolSessionState():
  | "before"
  | "in-session"
  | "after" {
  // Weekend check
  if (isSaturday(new Date()) || isSunday(new Date())) return "after";

  // Time check
  return isFuture(
    new Date().setHours(
      getPeriodBoundaryTime(0).hours,
      getPeriodBoundaryTime(0).min,
    ),
  )
    ? "before"
    : isPast(
        new Date().setHours(
          getPeriodBoundaryTime(10).hours,
          getPeriodBoundaryTime(10).min,
        ),
      )
    ? "after"
    : "in-session";
}
