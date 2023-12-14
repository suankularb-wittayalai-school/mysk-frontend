/**
 * Returns the current semester based on the month of the date.
 * 
 * @param date The date to check. Defaults to the current date.
 */
export default function getCurrentSemester(date?: Date): 1 | 2 {
  const month = (date || new Date()).getMonth() + 1;
  if (month >= 3 && month < 10) return 1;
  else return 2;
}
