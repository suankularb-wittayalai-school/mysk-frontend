export function arePeriodsOverlapping(
  period1: { day?: Day; startTime: number; duration: number },
  period2: { day?: Day; startTime: number; duration: number },
): boolean {
  // If the Periods are not on the same day, they are not overlapping
  if (period1.day && period2.day && period1.day != period2.day) return false;

  // Check if Period 1 starts at a time where Period 2 is ongoing
  if (
    period1.startTime >= period2.startTime &&
    period1.startTime <= period2.startTime + period2.duration - 1
  )
    return true;

  // Check if Period 2 starts at a time where Period 1 is ongoing
  if (
    period2.startTime >= period1.startTime &&
    period2.startTime <= period1.startTime + period1.duration - 1
  )
    return true;

  // If both checks fail, the Periods are not overlapping
  return false;
}
