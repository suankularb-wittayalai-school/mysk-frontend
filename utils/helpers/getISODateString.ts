import { subMinutes } from "date-fns";

/**
 * Returns the ISO date string of a Date.
 *
 * @param date The Date to convert.
 *
 * @returns A string.
 */
export default function getISODateString(date: Date) {
  // Since ISO dates are in UTC, we lose the timezone offset when
  // converting to ISO. We correct this by adding the timezone offset back.
  // We also remove the time portion of the date, since we only want to
  // match the date.
  return subMinutes(date, date.getTimezoneOffset()).toISOString().split("T")[0];
}
