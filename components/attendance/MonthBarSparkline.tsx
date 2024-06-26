import tallyAttendances from "@/utils/helpers/attendance/tallyAttendances";
import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { sum } from "radash";

const CHART_HEIGHT = 48;

/**
 * A bar sparkline visualizing how Attendance is distributed in a day.
 *
 * @param summary The summary of Attendance counts.
 */
const MonthBarSparkline: StylableFC<{
  summary: ReturnType<typeof tallyAttendances>;
}> = ({ summary, style, className }) => {
  const total = sum(Object.values(summary));

  return (
    <div
      style={{ ...style, height: CHART_HEIGHT }}
      className={cn(
        `w-full overflow-hidden rounded-full *:rounded-xs`,
        total === 0 && `bg-surface-container`,
        className,
      )}
    >
      <div
        style={{ height: (summary.present / total) * CHART_HEIGHT }}
        className="bg-primary-container"
      />
      <div
        style={{ height: (summary.late / total) * CHART_HEIGHT }}
        className="bg-tertiary-container dark:bg-tertiary"
      />
      <div
        style={{ height: (summary.onLeave / total) * CHART_HEIGHT }}
        className="bg-outline-variant dark:bg-outline"
      />
      <div
        style={{ height: (summary.absent / total) * CHART_HEIGHT }}
        className="bg-error"
      />
      <div
        style={{ height: (summary.empty / total) * CHART_HEIGHT }}
        className="bg-surface-container"
      />
    </div>
  );
};

export default MonthBarSparkline;
