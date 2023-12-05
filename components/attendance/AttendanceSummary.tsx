import cn from "@/utils/helpers/cn";
import { ManagementAttendanceSummary } from "@/utils/types/attendance";
import { StylableFC } from "@/utils/types/common";
import { Card, CardHeader, Columns } from "@suankularb-components/react";
import { sum } from "radash";

/**
 * A summary of attendance statistics for management.
 *
 * @param title The title of the summary: today or this week.
 * @param summary The summary of the presence, late, and absence counts.
 */
const AttendanceSummary: StylableFC<{
  title?: string | JSX.Element;
  summary: ManagementAttendanceSummary;
}> = ({ title, summary, style, className }) => {
  const total = sum(Object.values(summary));
  const percentages = Object.fromEntries(
    Object.entries(summary).map(([key, value]) => [key, (value / total) * 100]),
  ) as ManagementAttendanceSummary;

  return (
    <Card
      appearance="outlined"
      style={style}
      className={cn(`relative !gap-2 whitespace-nowrap !rounded-lg`, className)}
    >
      <div
        className={cn(`flex flex-row gap-2 overflow-auto p-3 pb-5
          [&_.skc-card-header]:!px-3 [&_.skc-card-header]:!py-2`)}
      >
        {title && <div className="mr-3 grow">{title}</div>}

        {/* Presence */}
        <Card
          appearance="filled"
          className="!bg-primary-container !text-on-primary-container"
        >
          <CardHeader
            title={`${summary.presence.toLocaleString()} present`}
            subtitle={percentages.presence.toFixed(1) + "%"}
          />
        </Card>

        {/* Late */}
        <Card
          appearance="filled"
          className="!bg-secondary-container !text-on-secondary-container"
        >
          <CardHeader
            title={`${summary.late.toLocaleString()} late`}
            subtitle={percentages.late.toFixed(1) + "%"}
          />
        </Card>

        {/* Absence */}
        <Card appearance="filled">
          <CardHeader
            title={`${summary.absence.toLocaleString()} absent`}
            subtitle={percentages.absence.toFixed(1) + "%"}
          />
        </Card>
      </div>

      {/* Progress */}
      <div
        className={cn(`absolute inset-3 bottom-0 top-auto flex h-2
          flex-row overflow-hidden rounded-t-xs bg-surface-variant`)}
      >
        <div
          className="h-full bg-primary"
          style={{ width: `${percentages.presence}%` }}
        />
        <div
          className="h-full bg-secondary ring-2 ring-surface-variant"
          style={{ width: `${percentages.late}%` }}
        />
      </div>
    </Card>
  );
};

export default AttendanceSummary;
