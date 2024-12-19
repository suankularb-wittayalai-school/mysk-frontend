import {
  AbsenceType,
  AttendanceEvent,
  StudentAttendance,
} from "@/utils/types/attendance";

/**
 * Summarizes an array of Attendance records.
 *
 * @param attendances An array of attendance records.
 *
 * @returns An object of counts.
 */
export default function tallyAttendances(
  attendances: Pick<
    StudentAttendance[AttendanceEvent],
    "is_present" | "absence_type"
  >[],
): {
  present: number;
  late: number;
  onLeave: number;
  absent: number;
  empty: number;
} {
  const summary = { present: 0, late: 0, onLeave: 0, absent: 0, empty: 0 };

  for (const attendance of attendances) {
    if (attendance.is_present === null) summary.empty++;
    else if (
      attendance.is_present ||
      attendance.absence_type === AbsenceType.dropped ||
      attendance.absence_type === AbsenceType.activity
    )
      summary.present++;
    else if (attendance.absence_type === AbsenceType.late) summary.late++;
    else if (attendance.absence_type === AbsenceType.absent) summary.absent++;
    else summary.onLeave++;
  }

  return summary;
}
