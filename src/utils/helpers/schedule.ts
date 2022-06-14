import { isWithinInterval } from "date-fns";
import { range } from "@utils/helpers/array";
import { Schedule } from "@utils/types/schedule";

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
  { hours: 17, min: 40 },
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
        periodTimes[periodStart].hours,
        periodTimes[periodStart].min,
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

export function createEmptySchedule(startDay: Day, endDay?: Day): Schedule {
  return {
    content: range(endDay ? endDay - startDay + 1 : startDay).map((day) => ({
      day: (day + startDay) as Day,
      content: [
        { startTime: 1, duration: 1 },
        { startTime: 2, duration: 1 },
        { startTime: 3, duration: 1 },
        { startTime: 4, duration: 1 },
        { startTime: 5, duration: 1 },
        { startTime: 6, duration: 1 },
        { startTime: 7, duration: 1 },
        { startTime: 8, duration: 1 },
        { startTime: 9, duration: 1 },
        { startTime: 10, duration: 1 },
      ],
    })),
  };
}
