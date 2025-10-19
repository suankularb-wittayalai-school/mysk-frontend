import cn from "@/utils/helpers/cn";
import { CheerAttendanceType } from "@/utils/types/cheer";
import { StylableFC } from "@/utils/types/common";
import { MaterialIcon } from "@suankularb-components/react";
enum CellType {
  present,
  late,
  absentNoRemedial,
  absentWithRemedial,
  missing,
  empty,
}

const CheerAttendanceFigureEvent: StylableFC<{
  attendance: CheerAttendanceType | null;
}> = ({ attendance, style, className }) => {
  const type = (() => {
    if (attendance == CheerAttendanceType.present) return CellType.present;
    else if (attendance == CheerAttendanceType.late) return CellType.late;
    else if (attendance == CheerAttendanceType.absentNoRemedial)
      return CellType.absentNoRemedial;
    else if (attendance == CheerAttendanceType.absentWithRemedial)
      return CellType.absentWithRemedial;
    else if (attendance == CheerAttendanceType.missing) return CellType.missing;
    else return CellType.empty;
  })();
  return (
    <div
      style={style}
      className={cn(
        `relative h-6 w-full *:absolute *:left-1/2 *:top-1/2 *:-translate-x-1/2 *:-translate-y-1/2 *:!text-lg *:![font-variation-settings:'opsz'20]`,
        [
          `bg-primary-container`,
          `bg-tertiary-container text-on-tertiary-container`,
          `bg-surface-variant text-on-surface-variant`,
          `bg-secondary-container text-on-secondary-container`,
          `bg-error text-on-error`,
          `bg-surface-container`,
        ][type],
        className,
      )}
    >
      {type === CellType.late && <MaterialIcon icon="alarm" />}
      {type === CellType.absentNoRemedial && <MaterialIcon icon="close" />}
      {type === CellType.absentWithRemedial && <MaterialIcon icon="history" />}
      {type === CellType.missing && <MaterialIcon icon="close" />}
    </div>
  );
};

export default CheerAttendanceFigureEvent;
