import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { MaterialIcon } from "@suankularb-components/react";
import { useTranslation } from "next-i18next";

/**
 * Displays a grid of numbers for presence, late, on leave, and absence.
 * 
 * @param counts The counts of each Attendance status as returned from `getAttendanceSummary`.
 */
const AttendanceCountsGrid: StylableFC<{
  counts: {
    [key in "present" | "late" | "onLeave" | "absent" | "empty"]: number;
  };
}> = ({ counts, style, className }) => {
  const { t } = useTranslation("attendance", { keyPrefix: "month" });

  return (
    <ul
      style={style}
      className={cn(
        `flex flex-row flex-wrap items-center gap-x-1 *:flex *:min-w-8
        *:flex-row *:items-center`,
        className,
      )}
    >
      <li title={t("legend.present")}>
        <MaterialIcon icon="done" size={20} className="text-primary" />
        <span>{counts.present}</span>
      </li>
      <li title={t("legend.late")}>
        <MaterialIcon icon="alarm" size={20} className="text-tertiary" />
        <span>{counts.late}</span>
      </li>
      <li title={t("legend.onLeave")}>
        <MaterialIcon
          icon="close"
          size={20}
          className="text-on-surface-variant"
        />
        <span>{counts.onLeave}</span>
      </li>
      <li title={t("legend.absent")}>
        <MaterialIcon icon="close" size={20} className="text-error" />
        <span>{counts.absent}</span>
      </li>
    </ul>
  );
};

export default AttendanceCountsGrid;
