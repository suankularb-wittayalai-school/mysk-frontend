import tallyCheerAttendances from "@/utils/helpers/attendance/cheer/tallyCheerAttendances";
import { CheerPracticePeriod } from "@/utils/types/cheer";
import { Classroom } from "@/utils/types/classroom";
import { StylableFC } from "@/utils/types/common";
import { Card, Text } from "@suankularb-components/react";
import cn from "@/utils/helpers/cn";
import CheerAttendanceFigureDay from "./CheerAttendanceFigureDay";
import CheerMonthBarSparkLine from "./CheerMonthBarSparkLine";
import getCurrentAcademicYear from "@/utils/helpers/getCurrentAcademicYear";
import useTranslation from "next-translate/useTranslation";
import { sort } from "radash";

const ClassCheerAttendanceSummary: StylableFC<{
  classroom: Pick<Classroom, "number">;
  practiceDates: string[];
  summaries: ({ practice_period: CheerPracticePeriod } & ReturnType<
    typeof tallyCheerAttendances
  >)[];
}> = ({ classroom, practiceDates, summaries, style, className }) => {
  const { t } = useTranslation("common");
  summaries.sort((a, b) => {
    return a.practice_period.date.localeCompare(b.practice_period.date);
  });
  return (
    <Card
      appearance="outlined"
      style={style}
      className={cn(
        `!grid !items-end pb-4 md:grid-cols-[3fr,7fr,2fr] md:!gap-6 md:!rounded-none md:!border-0 md:!border-b-1 md:!py-1 md:pb-0`,
        className,
      )}
    >
      <hgroup className="py-3 pl-4 pr-1">
        <Text type="title-large" element="h3">
          {t("class", { number: classroom.number })}
        </Text>
        <Text
          type="title-medium"
          element="p"
          className="text-on-surface-variant"
        >
          {getCurrentAcademicYear()}
        </Text>
      </hgroup>
      <div className="overflow-auto md:contents">
        <figure
          style={style}
          className={cn(
            `flex h-20 w-fit flex-row items-center gap-0.5 px-4 md:w-full md:px-0 [&_[role=separator]]:md:!h-[calc(4rem+1px)]`,
            className,
          )}
        >
          {summaries.map((summary) => (
            <CheerAttendanceFigureDay
              key={summary.practice_period.id}
              date={summary.practice_period.date}
              practiceDates={practiceDates}
            >
              <CheerMonthBarSparkLine summary={summary} />
            </CheerAttendanceFigureDay>
          ))}
        </figure>
      </div>
    </Card>
  );
};

export default ClassCheerAttendanceSummary;
