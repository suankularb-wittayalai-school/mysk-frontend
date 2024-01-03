import { isFuture, isSaturday, isSunday } from "date-fns";

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

/**
 * Get the current School Session State, calculated from the current time.
 *
 * @returns The current School Session State.
 *
 * @see {@link SchoolSessionState School Session State}
 */
export default function getCurrentSchoolSessionState(): SchoolSessionState {
  // Note: replace this variable to test different times. Useful if you want to
  // test Home Glance.
  const now = new Date();

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
  if (isSaturday(now) || isSunday(now)) return SchoolSessionState.after;

  // Before Schedule starts
  if (isFuture(now.setHours(...ASSEMBLY_START)))
    return SchoolSessionState.before;
  if (isFuture(now.setHours(...HOMEROOM_START)))
    return SchoolSessionState.assembly;
  if (isFuture(now.setHours(...SCHEDULE_START)))
    return SchoolSessionState.homeroom;

  // During scheduled time
  if (isFuture(now.setHours(...SCHEDULE_END)))
    return SchoolSessionState.schedule;

  // After Schedule ends
  return SchoolSessionState.after;
}
