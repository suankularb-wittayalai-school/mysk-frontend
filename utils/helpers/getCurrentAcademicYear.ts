/**
 * Returns the current academic year based on a date. The academic year starts
 * from May to April, which means it might be different from the calendar year.
 *
 * @param date The date to check. Defaults to the current date.
 */
export default function getCurrentAcademicYear(date?: Date): number {
  date = date || new Date();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  if (month <= 4) return year - 1;
  else return year;
}
