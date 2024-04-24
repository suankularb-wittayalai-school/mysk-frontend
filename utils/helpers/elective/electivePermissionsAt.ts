import getCurrentAcademicYear from "@/utils/helpers/getCurrentAcademicYear";
import { addHours, isBefore, isWithinInterval, subMinutes } from "date-fns";

/**
 * The permissions available to a Student for Electives.
 */
export type ElectivePermissions = {
  /** Can view the Electives available to them. */
  view: boolean;
  /** Can choose and change their enrollment. */
  choose: boolean;
  /** Can trade Electives with others. */
  trade: boolean;
};

/**
 * Get the Elective permissions at a given date.
 *
 * @param date The date to check. Defaults to the current date.
 *
 * @todo Currently only supports Semester 1. Instructions on handling Semester 2 are still pending.
 */
export default function electivePermissionsAt(date: Date = new Date()) {
  // Convert the date to UTC+7 (the school’s timezone).
  const normalizedDate = addHours(
    // Remove initial timezone offset.
    subMinutes(date, date.getTimezoneOffset()),
    // Add new timezone offset.
    7,
  );

  const year = getCurrentAcademicYear(normalizedDate);
  const permissions = { view: false, choose: false, trade: false };

  // Remember that months are 0-indexed in JavaScript.
  // (January is 0, February is 1, etc.)

  // The comments below are excerpts from the March 27 meeting notes.

  // May 10
  // - Instruction on how to log in to MySK and MySK Elective.
  // - Student can see subject info on MySK Elective and make their decision.
  if (!isBefore(normalizedDate, new Date(year, 4, 10))) permissions.view = true;

  // May 14
  // - The system is open to subject registration from 08:00 until 16:00 allowing
  //   the students to only register within the time frame.
  // May 15
  // - The registration opens again for people who have not registered.
  if (
    isWithinInterval(normalizedDate, {
      start: new Date(year, 4, 14),
      end: new Date(year, 4, 16),
    }) &&
    isWithinInterval(normalizedDate, {
      start: new Date(normalizedDate).setHours(8, 0, 0, 0),
      end: new Date(normalizedDate).setHours(16, 0, 0, 0),
    })
  )
    permissions.choose = true;

  // May 29
  // - The system is open to subject changes and trades from 17:30 to 00:00.
  if (
    isWithinInterval(normalizedDate, {
      start: new Date(year, 4, 29, 17, 30),
      end: new Date(year, 4, 30),
    })
  )
    permissions.trade = true;

  return permissions;
}
