import getRelevantPeriodOfClass from "@/utils/backend/schedule/getRelevantPeriodOfClass";
import cn from "@/utils/helpers/cn";
import getLocaleString from "@/utils/helpers/getLocaleString";
import getTodaySetToPeriodTime from "@/utils/helpers/schedule/getTodaySetToPeriodTime";
import { SchoolSessionState } from "@/utils/helpers/schedule/schoolSessionStateAt";
import useLocale from "@/utils/helpers/useLocale";
import useNow from "@/utils/helpers/useNow";
import { Classroom } from "@/utils/types/classroom";
import { StylableFC } from "@/utils/types/common";
import { SchedulePeriod } from "@/utils/types/schedule";
import {
  Card,
  CardHeader,
  DURATION,
  EASING,
  MaterialIcon,
  Progress,
  transition,
} from "@suankularb-components/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import va from "@vercel/analytics";
import { differenceInSeconds, formatDistanceToNowStrict } from "date-fns";
import { enUS, th } from "date-fns/locale";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import { sift } from "radash";
import { useEffect, useState } from "react";

/**
 * Lookup Class Card is a card that displays a Classroom in the Lookup Classes
 * list.
 *
 * @param classroom The Classroom to display.
 * @param selected The ID of the currently selected Classroom.
 * @param onClick The function to call when the card is clicked. Should select this Classroom.
 */
const LookupClassCard: StylableFC<{
  classroom: Pick<Classroom, "id" | "number" | "main_room">;
  selected?: string;
  onClick: (value: string) => void;
}> = ({ classroom, selected, onClick, style, className }) => {
  const locale = useLocale();
  const { t } = useTranslation("classes", { keyPrefix: "list.item" });
  const { t: tx } = useTranslation("common");

  const supabase = useSupabaseClient();

  const [loading, setLoading] = useState(true);
  const {
    now,
    periodNumber,
    schoolSessionState: schooleSessionState,
  } = useNow();
  const [period, setPeriod] = useState<
    (SchedulePeriod & { is_current: boolean }) | null
  >(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error, isCurrent } = await getRelevantPeriodOfClass(
        supabase,
        classroom.id,
      );
      if (!error) setPeriod(data ? { ...data, is_current: isCurrent } : null);
      setLoading(false);
    })();
  }, [periodNumber]);

  const percentage = period?.is_current
    ? (differenceInSeconds(now, getTodaySetToPeriodTime(period.start_time)) /
        (period.duration * 3000)) *
      100
    : 100;

  return (
    <Card
      appearance="outlined"
      direction="row"
      stateLayerEffect
      onClick={() => {
        va.track("View Classroom", { number: `M.${classroom.number}` });
        onClick(classroom.id);
      }}
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
        subtitle={
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={period?.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={transition(DURATION.short4, EASING.standard)}
            >
              {sift([
                classroom.main_room,
                !loading &&
                  (period
                    ? period.is_current
                      ? getLocaleString(period.content[0].subject.name, locale)
                      : t("period.upcoming", {
                          duration: formatDistanceToNowStrict(
                            getTodaySetToPeriodTime(period.start_time, "start"),
                            { locale: locale === "en-US" ? enUS : th },
                          ),
                        })
                    : t("period.finished")),
              ]).join(" • ")}
            </motion.span>
          </AnimatePresence>
        }
        className="grow [&>*>*]:block [&>*>*]:!truncate [&>*]:w-full"
      />
      {loading || period?.is_current ? (
        // +1px on all sides to compensate for the lack of border
        <div className="m-[calc(0.75rem+1px)] h-12">
          <Progress
            appearance="circular"
            alt="Period progress in percent"
            value={percentage}
            visible={!loading && period?.is_current}
          />
        </div>
      ) : (
        <div
          className={cn(
            `m-3 rounded-full border-1 border-outline-variant
            bg-surface-container p-3 transition-[border-color]`,
            classroom.id === selected && `sm:group-focus:border-primary`,
          )}
        >
          {schooleSessionState === SchoolSessionState.schedule &&
          [4, 5].includes(periodNumber) ? (
            <MaterialIcon icon="fastfood" className="text-tertiary" />
          ) : period ? (
            <MaterialIcon icon="hourglass" className="text-outline" />
          ) : (
            <MaterialIcon icon="home" className="text-secondary" />
          )}
        </div>
      )}
    </Card>
  );
};

export default LookupClassCard;
