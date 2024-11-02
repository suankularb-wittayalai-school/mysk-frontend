import { addDays, getDate, setDay } from "date-fns";

/**
 * Returns the nearest past weekday to the given date.
 *
 * @param date The date to check.
 *
 * @returns The calculated date.
 */
export default function lastWeekday(date: Date) {
  const day = date.getDay();

  // To-do: Fix this hard code (blame @pixelpxed)
  if ((`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`) == '2024-11-2') return date
  
  if (day === 0) return setDay(addDays(date, -1), 5);
  if (day === 6) return setDay(date, 5);
  return date;
}
