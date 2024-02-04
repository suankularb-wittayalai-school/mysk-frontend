import MonthBarSparkline from "@/components/attendance/MonthBarSparkline";
import cn from "@/utils/helpers/cn";
import useLocale from "@/utils/helpers/useLocale";
import { Classroom } from "@/utils/types/classroom";
import { StylableFC } from "@/utils/types/common";
import { Card, Text } from "@suankularb-components/react";
import { getDaysInMonth } from "date-fns";
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
  counts: {
    date: Date;
    present: number;
    late: number;
    onLeave: number;
    absent: number;
    empty: number;
  }[];
}> = ({ date, classroom, counts, style, className }) => {
  const locale = useLocale();
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
        `!grid !items-center md:h-20 md:grid-cols-[3fr,7fr,2fr] md:!gap-6
        md:!rounded-none md:!border-0 md:!border-b-1`,
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
          {date.toLocaleDateString(locale, { month: "long", year: "numeric" })}
        </Text>
      </hgroup>
      <div className="overflow-auto md:contents">
        <figure
          style={style}
          className={cn(`flex h-20 flex-row items-center gap-0.5`, className)}
        >
          {formattedCounts.map((summary) => (
            <div key={summary.date.getDay()} className="w-[1.375rem]">
              <MonthBarSparkline summary={omit(summary, ["date"])} />
            </div>
          ))}
        </figure>
      </div>
    </Card>
  );
};

export default MonthAttendanceSummary;
