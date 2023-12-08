import cn from "@/utils/helpers/cn";
import { ManagementAttendanceSummary } from "@/utils/types/attendance";
import { StylableFC } from "@/utils/types/common";
import { Card, CardHeader } from "@suankularb-components/react";
import { useTranslation } from "next-i18next";

/**
 * A summary of attendance statistics for management.
 *
 * @param title The title of the summary: today or this week.
 * @param summary The summary of the presence, late, and absence counts.
 * @param total The total number of Students.
 */
const AttendanceSummary: StylableFC<{
  title?: string | JSX.Element;
  summary: ManagementAttendanceSummary;
  total: number;
}> = ({ title, summary, total, style, className }) => {
  const { t } = useTranslation("manage", {
    keyPrefix: "attendance.summary.card",
  });

  const fractions = Object.fromEntries(
    Object.entries(summary).map(([key, value]) => [key, value / total]),
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
            title={t("title.present", { count: summary.presence })}
            subtitle={t("content", { percentage: fractions.presence })}
          />
        </Card>

        {/* Late */}
        <Card
          appearance="filled"
          className="!bg-secondary-container !text-on-secondary-container"
        >
          <CardHeader
            title={t("title.late", { count: summary.late })}
            subtitle={t("content", { percentage: fractions.late })}
          />
        </Card>

        {/* Absence */}
        <Card appearance="filled">
          <CardHeader
            title={t("title.absent", { count: summary.absence })}
            subtitle={t("content", { percentage: fractions.absence })}
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
          style={{ width: `${fractions.presence * 100}%` }}
        />
        <div
          className="h-full bg-secondary ring-2 ring-surface-variant"
          style={{ width: `${fractions.late * 100}%` }}
        />
      </div>
    </Card>
  );
};

export default AttendanceSummary;
