// Imports
import setDateToPeriodTime from "@/utils/helpers/schedule/setDateToPeriodTime";

export default function getTodaySetToPeriodTime(
  periodNumber: number,
  edge?: "start" | "end",
): Date {
  return setDateToPeriodTime(new Date(), periodNumber, edge);
}
