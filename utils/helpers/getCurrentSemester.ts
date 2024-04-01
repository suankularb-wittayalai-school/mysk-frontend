/**
 * Returns the current semester based on the month of the date.
 *
 * - An academic year is divided into two semesters and lasts from May to April.
 * - Semester 1 lasts from May to September.
 * - Semester 2 lasts from October to April.
 *
 * @param date The date to check. Defaults to the current date.
 */
export default function getCurrentSemester(date?: Date): 1 | 2 {
  const month = (date || new Date()).getMonth() + 1;
  if (month >= 5 && month < 10) return 1;
  else return 2;
}
