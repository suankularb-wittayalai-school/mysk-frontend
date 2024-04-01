import { isAfter, isSaturday, isSunday } from "date-fns";

/**
 * The start time of assembly.
 */
export const ASSEMBLY_START: Parameters<Date["setHours"]> = [7, 30, 0, 0];

/**
 * The start time of homeroom.
 */
export const HOMEROOM_START: Parameters<Date["setHours"]> = [8, 0, 0, 0];

/**
 * The start time of period 1.
 */
export const SCHEDULE_START: Parameters<Date["setHours"]> = [8, 30, 0, 0];

/**
 * The start time of period 10.
 */
export const SCHEDULE_END: Parameters<Date["setHours"]> = [16, 50, 0, 0];

export enum SchoolSessionState {
  before = "before",
  assembly = "assembly",
  homeroom = "homeroom",
  schedule = "schedule",
  after = "after",
}

function isAfterTime(time: Parameters<Date["setHours"]>, date: Date) {
  return isAfter(new Date(date).setHours(...time), date);
}

/**
 * Get the current School Session State, calculated from the current time.
 *
 * @returns The current School Session State.
 *
 * @see {@link SchoolSessionState School Session State}
 */
export default function schoolSessionStateAt(
  date: Date = new Date(),
): SchoolSessionState {
  // Here’s a diagram of how School Session States are laid out:

  // +--------------------------------+
  // | <-B                            | where B is SchoolSessionState.before
  // |   | ASSEMBLY_START             |
  // |   <-A->                        | where A is SchoolSessionState.assembly
  // |       | HOMEROOM_START         |
  // |       <-H->                    | where H is SchoolSessionState.homeroom
  // |           | SCHEDULE_START     |
  // |           <-S->                | where S is SchoolSessionState.schedule
  // |               | SCHEDULE_END   |
  // |               E->              | where E is SchoolSessionState.after
  // +--------------------------------+

  // Weekends
  if (isSaturday(date) || isSunday(date)) return SchoolSessionState.after;

  // Before Schedule starts
  if (isAfterTime(ASSEMBLY_START, date)) return SchoolSessionState.before;
  if (isAfterTime(HOMEROOM_START, date)) return SchoolSessionState.assembly;
  if (isAfterTime(SCHEDULE_START, date)) return SchoolSessionState.homeroom;

  // During scheduled time
  if (isAfterTime(SCHEDULE_END, date)) return SchoolSessionState.schedule;

  // After Schedule ends
  return SchoolSessionState.after;
}
