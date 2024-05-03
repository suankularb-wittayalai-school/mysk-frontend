export const PERIOD_TIMES = [
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
];

export default function setDateToPeriodTime(
  date: Date,
  periodNumber: number,
  edge?: "start" | "end",
) {
  return new Date(
    new Date(date).setHours(
      ...(Object.values(
        PERIOD_TIMES[periodNumber + (edge === "end" ? 0 : -1)],
      ) as [number, number]),
      0,
      0,
    ),
  );
}
