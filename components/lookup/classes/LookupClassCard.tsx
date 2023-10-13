// Imports
import cn from "@/utils/helpers/cn";
import getLocaleString from "@/utils/helpers/getLocaleString";
import getCurrentPeriod from "@/utils/helpers/schedule/getCurrentPeriod";
import getCurrentSchoolSessionState from "@/utils/helpers/schedule/getCurrentSchoolSessionState";
import getTodaySetToPeriodTime from "@/utils/helpers/schedule/getTodaySetToPeriodTime";
import useLocale from "@/utils/helpers/useLocale";
import { Classroom } from "@/utils/types/classroom";
import { StylableFC } from "@/utils/types/common";
import { SchedulePeriod } from "@/utils/types/schedule";
import {
  Card,
  CardHeader,
  MaterialIcon,
  Progress,
} from "@suankularb-components/react";
import { differenceInSeconds, formatDistanceToNowStrict } from "date-fns";
import { enUS, th } from "date-fns/locale";
import { useTranslation } from "next-i18next";

/**
 * Lookup Class Card is a card that displays a Classroom in the Lookup Classes
 * list.
 *
 * @param classroom The Classroom to display.
 * @param period The currently relevant Schedule Item fro this Classroom.
 * @param now The current time. Should be the same across all Cards to prevent them going out of sync with each other.
 * @param onClick The function to call when the card is clicked. Should select this Classroom.
 */
const LookupClassCard: StylableFC<{
  classroom: Pick<Classroom, "id" | "number" | "main_room">;
  period: SchedulePeriod;
  now: Date;
  selected?: string;
  onClick: (value: string) => void;
}> = ({ classroom, period, now, selected, onClick, style, className }) => {
  const locale = useLocale();
  const { t } = useTranslation("lookup");
  const { t: tx } = useTranslation("common");

  const currentPeriodNumber = getCurrentPeriod();
  const periodIsCurrent =
    period &&
    period.start_time <= currentPeriodNumber &&
    period.start_time + period.duration > currentPeriodNumber;

  const percentage = periodIsCurrent
    ? (differenceInSeconds(now, getTodaySetToPeriodTime(period.start_time)) /
        (period.duration * 3000)) *
      100
    : 100;

  return (
    <Card
      appearance="outlined"
      direction="row"
      stateLayerEffect
      onClick={() => onClick(classroom.id)}
      style={style}
      className={cn(
        `!grid w-full !grid-cols-[minmax(0,1fr),4.5rem] items-center
        !rounded-none !border-transparent !bg-transparent text-left
        !transition-[padding,border,background-color] sm:!rounded-full`,
        classroom.id === selected &&
          `sm:!border-outline-variant sm:!bg-primary-container sm:pl-2
          sm:!text-on-primary-container sm:focus:!border-primary`,
        className,
      )}
    >
      <CardHeader
        title={tx("class", { number: classroom.number })}
        subtitle={[
          classroom.main_room,
          period
            ? periodIsCurrent
              ? getLocaleString(period.content[0].subject.name, locale)
              : `Next in ${formatDistanceToNowStrict(
                  getTodaySetToPeriodTime(period.start_time, "start"),
                  { locale: locale === "en-US" ? enUS : th },
                )}`
            : "Finished for today",
        ].join(" • ")}
        className="grow [&>*>*]:block [&>*>*]:!truncate [&>*]:w-full"
      />
      {periodIsCurrent ? (
        <Progress
          appearance="circular"
          alt="Period progress in percent"
          value={percentage}
          visible={periodIsCurrent}
          className="m-3"
        />
      ) : (
        <div className="m-3 rounded-full bg-surface-2 p-3">
          {period ? (
            <MaterialIcon icon="fastfood" className="text-tertiary" />
          ) : (
            <MaterialIcon icon="home" className="text-secondary" />
          )}
        </div>
      )}
    </Card>
  );
};

export default LookupClassCard;
