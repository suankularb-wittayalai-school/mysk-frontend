import { StylableFC } from "@/utils/types/common";
import cn from "@/utils/helpers/cn";
import { MaterialIcon } from "@suankularb-components/react";
import tallyCheerAttendances from "@/utils/helpers/attendance/cheer/tallyCheerAttendances";

const CheerAttendanceCountGrid: StylableFC<{
  counts: ReturnType<typeof tallyCheerAttendances>;
}> = ({ counts, style, className }) => {
  return (
    <ul
      style={style}
      className={cn(
        `flex flex-row flex-wrap items-center gap-x-1 *:flex *:min-w-8 *:flex-row *:items-center`,
        className,
      )}
    >
      <li title={"Present"}>
        <MaterialIcon icon="done" size={20} className="text-primary" />
        <span>{counts.present}</span>
      </li>
      <li title={"Late"}>
        <MaterialIcon icon="alarm" size={20} className="text-tertiary" />
        <span>{counts.late}</span>
      </li>

      <li title={"Absent No Remedial"}>
        <MaterialIcon
          icon="close"
          size={20}
          className="text-on-surface-variant"
        />
        <span>{counts.absentNoRemedial}</span>
      </li>
      <li title={"Absent With Remedial"}>
        <MaterialIcon
          icon="history"
          size={20}
          className="text-on-secondary-container"
        />
        <span>{counts.absentWithRemedial}</span>
      </li>
      <li title={"Absent"}>
        <MaterialIcon icon="close" size={20} className="text-error" />
        <span>{counts.missing}</span>
      </li>
    </ul>
  );
};

export default CheerAttendanceCountGrid;
