// Imports
import { getLocaleString } from "@/utils/helpers/string";
import { LangCode } from "@/utils/types/common";
import { Schedule, SchedulePeriod } from "@/utils/types/schedule";
import { Subject } from "@/utils/types/subject";
import {
  differenceInMinutes,
  isFuture,
  isPast,
  isSaturday,
  isSunday,
  isWithinInterval,
} from "date-fns";
import { list } from "radash";

/**
 * The start times of each period (index 0-9; period 1-10).
 *
 * Note: `periodTimes[10]` is the end time of period 10.
 */
export const periodTimes = [
  { hours: 8, min: 30 },
  { hours: 9, min: 20 },
  { hours: 10, min: 10 },
  { hours: 11, min: 0 },
  { hours: 11, min: 50 },
  { hours: 12, min: 40 },
  { hours: 13, min: 30 },
  { hours: 14, min: 20 },
  { hours: 15, min: 10 },
  { hours: 16, min: 0 },
  { hours: 16, min: 50 },
];

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
export function isInPeriod(
  date: Date,
  periodDay: Date,
  periodStart: number,
  periodDuration: number,
) {
  return isWithinInterval(date, {
    start: new Date(
      periodDay.setHours(
        periodTimes[periodStart - 1].hours,
        periodTimes[periodStart - 1].min,
        0,
        0,
      ),
    ),
    end: new Date(
      periodDay.setHours(
        periodTimes[periodStart + periodDuration - 1].hours,
        periodTimes[periodStart + periodDuration - 1].min,
        0,
        0,
      ),
    ),
  });
}

/**
 * Get the current period number.
 *
 * @returns A number from 1 to 10.
 */
export function getCurrentPeriod(): number {
  return isPast(new Date().setHours(periodTimes[10].hours, periodTimes[10].min))
    ? 0
    : Math.floor(
        differenceInMinutes(
          new Date(),
          new Date().setHours(periodTimes[0].hours, periodTimes[0].min),
        ) / 50,
      ) + 1;
}

/**
 * Check if school is in session now.
 *
 * @returns
 * `before` — it’s morning and school haven’t started;
 * `in-session` — school is in session;
 * `after` —  it’s after school or it’s the weekend.
 */
export function isSchoolInSessionNow(): "before" | "in-session" | "after" {
  // Weekend check
  if (isSaturday(new Date()) || isSunday(new Date())) return "after";

  // Time check
  return isFuture(new Date().setHours(periodTimes[0].hours, periodTimes[0].min))
    ? "before"
    : isPast(new Date().setHours(periodTimes[10].hours, periodTimes[10].min))
    ? "after"
    : "in-session";
}

export function getTodaySetToPeriodTime(
  periodNumber: number,
  edge?: "start" | "end",
): Date {
  return new Date(
    new Date().setHours(
      periodTimes[periodNumber + (edge === "end" ? 0 : -1)].hours,
      periodTimes[periodNumber + (edge === "end" ? 0 : -1)].min,
      0,
    ),
  );
}

export function arePeriodsOverlapping(
  period1: { day?: Day; startTime: number; duration: number },
  period2: { day?: Day; startTime: number; duration: number },
): boolean {
  // If the Periods are not on the same day, they are not overlapping
  if (period1.day && period2.day && period1.day != period2.day) return false;

  // Check if Period 1 starts at a time where Period 2 is ongoing
  if (
    period1.startTime >= period2.startTime &&
    period1.startTime <= period2.startTime + period2.duration - 1
  )
    return true;

  // Check if Period 2 starts at a time where Period 1 is ongoing
  if (
    period2.startTime >= period1.startTime &&
    period2.startTime <= period1.startTime + period1.duration - 1
  )
    return true;

  // If both checks fail, the Periods are not overlapping
  return false;
}

/**
 * Converts a cursor position into a Period Location.
 *
 * @param x The horizontal position of the cursor on the screen.
 * @param y The vertical position of the cursor on the screen.
 * @param constraints The Schedule element, used in getting the bounding rectangle to used as anchor points.
 *
 * @returns A Period Location with `startTime` and `day`.
 */
export function positionPxToPeriod(x: number, y: number, constraints: Element) {
  // Get rectangle
  const { top, left } = constraints.getBoundingClientRect();

  // Calculate the drop position within the Schedule content area
  const dropPosition = {
    top: y - top - 60,
    left: x + constraints.scrollLeft - left - 152,
  };

  // Calculate `startTime` and `day`
  const startTime = Math.ceil((dropPosition.left - 104 * 0.75) / 104) + 1;
  const day = Math.ceil(dropPosition.top / 60) as Day;

  // Validate calculated position
  if (startTime < 1 || startTime > 10) return { startTime: null, day: null };
  if (day < 1 || day > 5) return { startTime: null, day: null };

  return { startTime, day };
}

export function periodDurationToWidth(duration: number) {
  return (
    // Calculate period width by duration
    duration * 96 +
    // Correct for missing gap in the middle of multi-period periods
    (duration - 1) * 8
  );
}

/**
 * Format a Subject Period’s Subject name with the duration in mind.
 *
 * @param duration The length of this Period.
 * @param subject The Subject name object.
 *
 * @returns A formatted Subject name to be shown in a Subject Period.
 */
export function getSubjectName(
  duration: SchedulePeriod["duration"],
  subject: Pick<Subject, "name" | "short_name">,
  locale: LangCode,
) {
  return duration < 2
    ? // If short period, use short name
      subject.short_name[locale] ||
        subject.short_name.th ||
        // If no short name, use name
        subject.name[locale] ||
        subject.name.th
    : // If long period, use name
      getLocaleString(subject.name, locale);
}

/**
 * Creates a Schedule with no Subject Periods (put simply, the `content` arrays
 * are empty).
 *
 * @param startDay The first day of the Schedule (1 to 7; Monday to Sunday).
 * @param endDay The last day of the Schedule (1 to 7; Monday to Sunday).
 *
 * @returns An empty Schedule.
 */
export function createEmptySchedule(startDay: Day, endDay?: Day): Schedule {
  return {
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
