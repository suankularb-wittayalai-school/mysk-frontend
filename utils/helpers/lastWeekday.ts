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

  const getDate = date.getDate();
  const getMonth = date.getMonth() + 1;
  
  if (
    `${date.getFullYear()}-${getMonth + 1 > 9 ? getMonth : "0" + getMonth}-${getDate + 1 > 9 ? getDate : "0" + getDate}` ==
    process.env.NEXT_PUBLIC_ATTENDANCE_SPECIAL_DATE
  ) return date;

  if (day === 0) return setDay(addDays(date, -1), 5);
  if (day === 6) return setDay(date, 5);
  return date;
}
