import { StylableFC } from "@/utils/types/common";
import cn from "@/utils/helpers/cn";
import tallyCheerAttendances from "@/utils/helpers/attendance/cheer/tallyCheerAttendances";
import { sum } from "radash";
import { CheerPracticePeriod } from "@/utils/types/cheer";
const CHART_HEIGHT = 48;
const CheerMonthBarSparkLine: StylableFC<{
  summary: { practice_period: CheerPracticePeriod } & ReturnType<
    typeof tallyCheerAttendances
  >;
}> = ({ summary, style, className }) => {
  const { practice_period, ...counts } = summary;
  let total = sum(Object.values(counts));
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
        style={{ height: (summary.absentWithRemedial / total) * CHART_HEIGHT }}
        className="bg-outline-variant dark:bg-outline"
      />
      <div
        style={{ height: (summary.absentWithRemedial / total) * CHART_HEIGHT }}
        className="bg-secondary-container dark:bg-secondary"
      />
      <div
        style={{ height: (summary.missing / total) * CHART_HEIGHT }}
        className="bg-error"
      />
      <div
        style={{ height: (summary.empty / total) * CHART_HEIGHT }}
        className="bg-surface-container"
      />
    </div>
  );
};

export default CheerMonthBarSparkLine;
