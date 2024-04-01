import { SEMESTER_1_START_MONTH } from "@/utils/helpers/getCurrentSemester";

/**
 * Returns the current academic year based on a date. The academic year starts
 * from April to March, which means it might be different from the calendar year.
 *
 * @param date The date to check. Defaults to the current date.
 */
export default function getCurrentAcademicYear(date?: Date): number {
  date = date || new Date();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  if (month < SEMESTER_1_START_MONTH) return year - 1;
  else return year;
}
