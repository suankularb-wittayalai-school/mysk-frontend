import AttendanceFigureDay from "@/components/attendance/AttendanceFigureDay";
import MonthBarSparkline from "@/components/attendance/MonthBarSparkline";
import tallyAttendances from "@/utils/helpers/attendance/tallyAttendances";
import cn from "@/utils/helpers/cn";
import { Classroom } from "@/utils/types/classroom";
import { StylableFC } from "@/utils/types/common";
import { Card, Text } from "@suankularb-components/react";
import { getDaysInMonth, lastDayOfMonth } from "date-fns";
import { useTranslation } from "next-i18next";
import { list, omit } from "radash";

/**
 * A Card displaying bar sparklines for each day of the month, showing the
 * Attendance summary of a Classroom.
 *
 * @param date The first date of the month.
 * @param classroom The Classroom to display the summary of.
 * @param counts The Attendance summary of each day in the month.
 */
const MonthAttendanceSummary: StylableFC<{
  date: Date;
  classroom: Pick<Classroom, "number">;
  counts: ({ date: Date } & ReturnType<typeof tallyAttendances>)[];
}> = ({ date, classroom, counts, style, className }) => {
  const { t } = useTranslation("attendance", { keyPrefix: "month.summary" });
  const { t: tx } = useTranslation("common");

  const formattedCounts = (() => {
    const result = list(getDaysInMonth(date) - 1).map((day) => ({
      date: new Date(date.setDate(day + 1)),
      present: 0,
      late: 0,
      onLeave: 0,
      absent: 0,
      empty: 0,
    }));
    for (const summary of counts)
      result[Number(summary.date.getDate()) - 1] = summary;
    return result;
  })();

  return (
    <Card
      appearance="outlined"
      style={style}
      className={cn(
        `!grid !items-end pb-4 md:grid-cols-[3fr,7fr,2fr] md:!gap-6
        md:!rounded-none md:!border-0 md:!border-b-1 md:!py-1 md:pb-0`,
        className,
      )}
    >
      <hgroup className="py-3 pl-4 pr-1">
        <Text type="title-large" element="h3">
          {tx("class", classroom)}
        </Text>
        <Text
          type="title-medium"
          element="p"
          className="text-on-surface-variant"
        >
          {t("subtitle", { date })}
        </Text>
      </hgroup>
      <div className="overflow-auto md:contents">
        <figure
          style={style}
          className={cn(
            `flex h-20 w-fit flex-row items-center gap-0.5 px-4 md:w-full
            md:px-0 [&_[role=separator]]:md:!h-[calc(4rem+1px)]`,
            className,
          )}
        >
          {formattedCounts.map((summary) => (
            <AttendanceFigureDay
              key={summary.date.toISOString()}
              date={summary.date}
              interval={{ start: date, end: lastDayOfMonth(date) }}
              className="md:[&_span]:!block"
            >
              <MonthBarSparkline summary={omit(summary, ["date"])} />
            </AttendanceFigureDay>
          ))}
        </figure>
      </div>
    </Card>
  );
};

export default MonthAttendanceSummary;
