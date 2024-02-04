import cn from "@/utils/helpers/cn";
import {
  AbsenceType,
  AttendanceEvent,
  StudentAttendance,
} from "@/utils/types/attendance";
import { StylableFC } from "@/utils/types/common";
import { MaterialIcon } from "@suankularb-components/react";

enum CellType {
  present,
  late,
  onLeave,
  absent,
  empty,
}

/**
 * A minimal representation of a Student’s attendance during an Attendance
 * Event, representing the status through color and icon. Part of the Attendance
 * Figure.
 *
 * @param attendance The Attendance of the Student during the event, if available.
 */
const AttendanceFigureEvent: StylableFC<{
  attendance:
    | (Pick<
        StudentAttendance[AttendanceEvent],
        "is_present" | "absence_type"
      > & { absence_reason?: string | null })
    | null;
}> = ({ attendance, style, className }) => {
  const type = (() => {
    if (!attendance || attendance.is_present === null) return CellType.empty;
    else if (attendance.is_present) return CellType.present;
    else if (attendance.absence_type === AbsenceType.late) return CellType.late;
    else if (attendance.absence_type === AbsenceType.absent)
      return CellType.absent;
    else return CellType.onLeave;
  })();

  return (
    <div
      title={attendance?.absence_reason || undefined}
      style={style}
      className={cn(
        `relative h-6 w-full rounded-xs *:absolute *:left-1/2 *:top-1/2
        *:-translate-x-1/2 *:-translate-y-1/2 *:!text-lg
        *:![font-variation-settings:'opsz'20]`,
        [
          `bg-primary-container`,
          `bg-tertiary-container text-on-tertiary-container`,
          `bg-surface-variant text-on-surface-variant`,
          `bg-error text-on-error`,
          `bg-surface-2`,
        ][type],
        className,
      )}
    >
      {type === CellType.late ? (
        <MaterialIcon icon="alarm" />
      ) : [CellType.absent, CellType.onLeave].includes(type) ? (
        <MaterialIcon icon="close" />
      ) : null}
    </div>
  );
};

export default AttendanceFigureEvent;
