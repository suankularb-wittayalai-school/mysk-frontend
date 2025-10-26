import {
  CheerAttendanceRecord,
  CheerAttendanceType,
} from "@/utils/types/cheer";

export default function tallyCheerAttendances(
  attendances: Pick<CheerAttendanceRecord, "presence" | "presence_at_end">[],
) {
  const summary = {
    present: 0,
    late: 0,
    onLeaveNoRemedial: 0,
    onLeaveWithRemedial: 0,
    missing: 0,
    empty: 0,
  };
  for (const attendance of attendances) {
    if (!attendance.presence || !attendance.presence_at_end) {
      summary.empty++;
    } else if (
      (attendance.presence === CheerAttendanceType.present ||
        attendance.presence === CheerAttendanceType.late) &&
      attendance.presence_at_end === CheerAttendanceType.missing
    ) {
      summary.missing++;
    } else if (
      attendance.presence === CheerAttendanceType.present &&
      attendance.presence_at_end === CheerAttendanceType.present
    ) {
      summary.present++;
    } else if (
      attendance.presence === CheerAttendanceType.late &&
      attendance.presence_at_end === CheerAttendanceType.present
    ) {
      summary.late++;
    } else if (attendance.presence === CheerAttendanceType.onLeaveNoRemedial) {
      summary.onLeaveNoRemedial++;
    } else if (
      attendance.presence === CheerAttendanceType.onLeaveWithRemedial
    ) {
      summary.onLeaveWithRemedial++;
    } else if (attendance.presence === CheerAttendanceType.missing) {
      summary.missing++;
    }
  }
  return summary;
}
