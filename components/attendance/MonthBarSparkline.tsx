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
  summary: {
    present: number;
    late: number;
    onLeave: number;
    absent: number;
    empty: number;
  };
}> = ({ summary, style, className }) => {
  const total = sum(Object.values(summary));

  return (
    <div
      style={{ ...style, height: CHART_HEIGHT }}
      className={cn(
        `w-full overflow-hidden rounded-full *:rounded-xs`,
        total === 0 && `bg-surface-2`,
        className,
      )}
    >
      <div
        style={{ height: (summary.present / total) * CHART_HEIGHT }}
        className="bg-primary-container"
      />
      <div
        style={{ height: (summary.late / total) * CHART_HEIGHT }}
        className="bg-tertiary-container"
      />
      <div
        style={{ height: (summary.onLeave / total) * CHART_HEIGHT }}
        className="bg-outline"
      />
      <div
        style={{ height: (summary.absent / total) * CHART_HEIGHT }}
        className="bg-error"
      />
      <div
        style={{ height: (summary.empty / total) * CHART_HEIGHT }}
        className="bg-surface-2"
      />
    </div>
  );
};

export default MonthBarSparkline;
