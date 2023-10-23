/**
 * Get the start time of each period (index 0-9; period 1-10).
 *
 * Note: Index 10 is the end time of period 10.
 */
export default function getPeriodBoundaryTime(idx: number) {
  return [
    { hours: 8, min: 30 },
    { hours: 9, min: 20 },
    { hours: 10, min: 10 },
    { hours: 11, min: 0 },
    { hours: 11, min: 50 },
    { hours: 12, min: 40 },
    { hours: 13, min: 30 },
    { hours: 14, min: 20 },
    { hours: 15, min: 10 },
    { hours: 16, min: 0 },
    { hours: 16, min: 50 },
  ][idx];
}
