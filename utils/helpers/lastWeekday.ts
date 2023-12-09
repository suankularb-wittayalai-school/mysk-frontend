import { addDays, setDay } from "date-fns";

/**
 * Returns the nearest past weekday to the given date.
 *
 * @param date The date to check.
 *
 * @returns The calculated date.
 */
export default function lastWeekday(date: Date) {
  const day = date.getDay();
  if (day === 0) return setDay(addDays(date, -1), 1);
  if (day === 6) return setDay(date, 5);
  return date;
}
