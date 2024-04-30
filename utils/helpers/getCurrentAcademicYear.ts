import { SEMESTER_1_START_MONTH } from "@/utils/helpers/getCurrentSemester";
import { toZonedTime } from "date-fns-tz";

/**
 * Returns the current academic year based on a date. The academic year starts
 * from April to March, which means it might be different from the calendar year.
 *
 * @param date The date to check. Defaults to the current date.
 */
export default function getCurrentAcademicYear(
  date: Date = new Date(),
): number {
  const zonedDate = toZonedTime(date, process.env.NEXT_PUBLIC_SCHOOL_TZ);
  const month = zonedDate.getMonth() + 1;
  const year = zonedDate.getFullYear();
  if (month < SEMESTER_1_START_MONTH) return year - 1;
  else return year;
}
