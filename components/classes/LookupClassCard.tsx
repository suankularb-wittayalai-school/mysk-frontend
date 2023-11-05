// Imports
import cn from "@/utils/helpers/cn";
import getLocaleString from "@/utils/helpers/getLocaleString";
import getCurrentPeriod from "@/utils/helpers/schedule/getCurrentPeriod";
import getTodaySetToPeriodTime from "@/utils/helpers/schedule/getTodaySetToPeriodTime";
import useLocale from "@/utils/helpers/useLocale";
import useNow from "@/utils/helpers/useNow";
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
 * @param period The currently relevant Schedule Item for this Classroom.
 * @param onClick The function to call when the card is clicked. Should select this Classroom.
 */
const LookupClassCard: StylableFC<{
  classroom: Pick<Classroom, "id" | "number" | "main_room">;
  period: SchedulePeriod;
  selected?: string;
  onClick: (value: string) => void;
}> = ({ classroom, period, selected, onClick, style, className }) => {
  const locale = useLocale();
  const { t } = useTranslation("classes", { keyPrefix: "list.item" });
  const { t: tx } = useTranslation("common");

  const currentPeriodNumber = getCurrentPeriod();
  const periodIsCurrent =
    period &&
    period.start_time <= currentPeriodNumber &&
    period.start_time + period.duration > currentPeriodNumber;

  const now = useNow();
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
        `group !grid w-full !grid-cols-[minmax(0,1fr),calc(4.5rem+2px)] items-center
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
              : t("period.upcoming", {
                  duration: formatDistanceToNowStrict(
                    getTodaySetToPeriodTime(period.start_time, "start"),
                    { locale: locale === "en-US" ? enUS : th },
                  ),
                })
            : t("period.finished"),
        ].join(" • ")}
        className="grow [&>*>*]:block [&>*>*]:!truncate [&>*]:w-full"
      />
      {periodIsCurrent ? (
        <Progress
          appearance="circular"
          alt="Period progress in percent"
          value={percentage}
          visible={periodIsCurrent}
          // +1px on all sides to compensate for the lack of border
          className="m-[calc(0.75rem+1px)]"
        />
      ) : (
        <div
          className={cn(
            `m-3 rounded-full border-1 border-outline-variant bg-surface-2 p-3
            transition-[border-color]`,
            classroom.id === selected && `sm:group-focus:border-primary`,
          )}
        >
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
