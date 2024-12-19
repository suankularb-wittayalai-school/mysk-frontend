import { YYYYMMDDRegex } from "@/utils/patterns";
import { isAfter, isWeekend } from "date-fns";
import { toZonedTime } from "date-fns-tz";

/**
 * Checks if a given date is a valid date to view Attendance.
 * @param date The date to check.
 * @returns Whether the date is valid for viewing Attendance.
 */
export default function isValidAttendanceDate(date: Date | string): boolean {
  if (date == process.env.ATTENDANCE_SPECIAL_DATE) return true;
  if (!(date instanceof Date || YYYYMMDDRegex.test(date))) return false;
  const parsedDate = new Date(date);
  if (isWeekend(parsedDate)) return false;
  const zonedToday = toZonedTime(new Date(), process.env.NEXT_PUBLIC_SCHOOL_TZ);
  if (isAfter(parsedDate, zonedToday)) return false;
  return true;
}
