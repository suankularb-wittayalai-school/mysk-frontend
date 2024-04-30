import { toZonedTime } from "date-fns-tz";

export const SEMESTER_1_START_MONTH = 4;
export const SEMESTER_2_START_MONTH = 10;

/**
 * Returns the current semester based on the month of the date.
 *
 * - An academic year is divided into two semesters and lasts from April to
 *   March.
 * - Semester 1 lasts from April to September.
 * - Semester 2 lasts from October to March.
 *
 * @param date The date to check. Defaults to the current date.
 */
export default function getCurrentSemester(date: Date = new Date()): 1 | 2 {
  const zonedDate = toZonedTime(date, process.env.NEXT_PUBLIC_SCHOOL_TZ);
  const month = zonedDate.getMonth() + 1;
  if (month >= SEMESTER_1_START_MONTH && month < SEMESTER_2_START_MONTH)
    return 1;
  else return 2;
}
