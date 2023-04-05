// External libraries
import {
  differenceInMinutes,
  isFuture,
  isPast,
  isWithinInterval,
} from "date-fns";

// Helpers
import { range } from "@/utils/helpers/array";

// Types
import { LangCode } from "@/utils/types/common";
import { Schedule, SchedulePeriod } from "@/utils/types/schedule";
import { Subject } from "@/utils/types/subject";

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

export function isInPeriod(
  date: Date,
  periodDay: Date,
  periodStart: number,
  periodDuration: number
) {
  return isWithinInterval(date, {
    start: new Date(
      periodDay.setHours(
        periodTimes[periodStart - 1].hours,
        periodTimes[periodStart - 1].min,
        0,
        0
      )
    ),
    end: new Date(
      periodDay.setHours(
        periodTimes[periodStart + periodDuration - 1].hours,
        periodTimes[periodStart + periodDuration - 1].min,
        0,
        0
      )
    ),
  });
}

export function getCurrentPeriod(): number {
  return isPast(new Date().setHours(periodTimes[10].hours, periodTimes[10].min))
    ? 0
    : Math.floor(
        differenceInMinutes(
          new Date(),
          new Date().setHours(periodTimes[0].hours, periodTimes[0].min)
        ) / 50
      ) + 1;
}

export function isSchoolInSessionNow(): "before" | "in-session" | "after" {
  return isFuture(new Date().setHours(periodTimes[0].hours, periodTimes[0].min))
    ? "before"
    : isPast(new Date().setHours(periodTimes[10].hours, periodTimes[10].min))
    ? "after"
    : "in-session";
}

export function arePeriodsOverlapping(
  period1: { day?: Day; startTime: number; duration: number },
  period2: { day?: Day; startTime: number; duration: number }
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
 * Format a Subject Period’s Subject name with the duration in mind
 *
 * @param duration The length of this Period
 * @param subjectName The Subject name object
 *
 * @returns A formatted Subject name to be shown in a Subject Period
 */
export function getSubjectName(
  duration: SchedulePeriod["duration"],
  subjectName: Subject["name"],
  locale: LangCode
) {
  return duration < 2
    ? // If short period, use short name
      subjectName[locale]?.shortName ||
        subjectName.th.shortName ||
        // If no short name, use name
        subjectName[locale]?.name ||
        subjectName.th.name
    : // If long period, use name
      subjectName[locale]?.name || subjectName.th.name;
}

export function createEmptySchedule(startDay: Day, endDay?: Day): Schedule {
  return {
    content: range(endDay ? endDay - startDay + 1 : 1).map((day) => ({
      day: (day + startDay) as Day,
      content: range(10, 1).map((startTime) => ({
        startTime,
        duration: 1,
        content: [],
      })),
    })),
  };
}
