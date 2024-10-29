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
import { differenceInSeconds } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { usePlausible } from "next-plausible";
import useTranslation from "next-translate/useTranslation";
import { sift } from "radash";
import { useEffect, useState } from "react";

/** The possible views of a Lookup Class Card. */
enum LookupClassCardView {
  inProgress = "inProgress",
  lunch = "lunch",
  upcoming = "upcoming",
  finished = "finished",
}

/**
 * Lookup Class Card is a card that displays a Classroom in the Lookup Classes
 * list.
 *
 * @param classroom The Classroom to display.
 * @param selected If this Classroom is currently selected.
 * @param onClick The function to call when the card is clicked. Should select this Classroom.
 */
const LookupClassCard: StylableFC<{
  classroom: Pick<Classroom, "id" | "number" | "main_room">;
  selected?: boolean;
  onClick: (value: string) => void;
}> = ({ classroom, selected, onClick, style, className }) => {
  const locale = useLocale();
  const { t } = useTranslation("classes/list");
  const { t: tx } = useTranslation("common");

  const plausible = usePlausible();
  const supabase = useSupabaseClient();

  const [loading, setLoading] = useState(true);
  const { now, periodNumber, schoolSessionState } = useNow();
  const [period, setPeriod] = useState<
    (SchedulePeriod & { is_current: boolean }) | null
  >(null);

  const view: LookupClassCardView | null = (() => {
    // Hide the state indicators if it’s after school.
    if (loading || schoolSessionState === SchoolSessionState.after) return null;
    if (period?.is_current) return LookupClassCardView.inProgress;
    if (
      schoolSessionState === SchoolSessionState.schedule &&
      [4, 5].includes(periodNumber)
    )
      return LookupClassCardView.lunch;
    if (period) return LookupClassCardView.upcoming;
    return LookupClassCardView.finished;
  })();

  useEffect(() => {
    if (schoolSessionState !== SchoolSessionState.schedule) return;
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
        plausible("View Classroom", {
          props: { number: `M.${classroom.number}` },
        });
        onClick(classroom.id);
      }}
      style={style}
      className={cn(
        `group !grid w-full !grid-cols-[minmax(0,1fr),calc(4.5rem+2px)]
        items-center !rounded-none !border-transparent !bg-transparent text-left
        !transition-[padding,border,background-color] sm:!rounded-full`,
        selected &&
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
                (() => {
                  if (!view) return;
                  if (!period) return t("item.period.finished");
                  if (period.is_current)
                    return getLocaleString(
                      period.content[0].subject.name,
                      locale,
                    );
                  return t("item.period.upcoming", {
                    time: getTodaySetToPeriodTime(period.start_time, "start"),
                  });
                })(),
              ]).join(" • ")}
            </motion.span>
          </AnimatePresence>
        }
        className="grow [&>*>*]:block [&>*>*]:!truncate [&>*]:w-full"
      />
      {!view ? null : loading || period?.is_current ? (
        // +1px on all sides to compensate for the lack of border
        <div className="m-[calc(0.75rem+1px)] h-12">
          <Progress
            appearance="circular"
            alt={t("item.stateAlt.inProgress")}
            value={percentage}
            visible={!loading && period?.is_current}
            className={cn(
              `[&_*]:transition-colors`,
              selected && `![--_remainder-color:var(--surface)]`,
            )}
          />
        </div>
      ) : (
        <div
          title={t(`item.stateAlt.${view}`)}
          className={cn(
            `m-3 rounded-full border-1 border-outline-variant
            bg-surface-container p-3 transition-[border-color]`,
            selected && `sm:group-focus:border-primary`,
          )}
        >
          {
            {
              lunch: <MaterialIcon icon="fastfood" className="text-tertiary" />,
              upcoming: (
                <MaterialIcon icon="hourglass" className="text-outline" />
              ),
              finished: <MaterialIcon icon="home" className="text-secondary" />,
            }[
              view as Exclude<
                LookupClassCardView,
                LookupClassCardView.inProgress
              >
            ]
          }
        </div>
      )}
    </Card>
  );
};

export default LookupClassCard;
