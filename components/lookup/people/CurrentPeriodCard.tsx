import cn from "@/utils/helpers/cn";
import getLocaleString from "@/utils/helpers/getLocaleString";
import getTodaySetToPeriodTime from "@/utils/helpers/schedule/getTodaySetToPeriodTime";
import { SchoolSessionState } from "@/utils/helpers/schedule/schoolSessionStateAt";
import useLocale from "@/utils/helpers/useLocale";
import useNow from "@/utils/helpers/useNow";
import { StylableFC } from "@/utils/types/common";
import { UserRole } from "@/utils/types/person";
import { SchedulePeriod } from "@/utils/types/schedule";
import {
  Card,
  DURATION,
  EASING,
  transition,
} from "@suankularb-components/react";
import { differenceInSeconds } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";

/**
 * A Card that contains the current period of a Student or Teacher and its
 * progress in Search.
 *
 * @param getCurrentPeriod A function that returns the current period of the Student or Teacher.
 * @param onClick Triggers when the Card is clicked. Should open the Schedule.
 *
 * @note
 * Having a fetch function as a param like `getCurrentPeriod` is a bit
 * experimental and has not been done in other components before. Let me know
 * if you have any feedback.
 */
const CurrentPeriodCard: StylableFC<{
  role: UserRole;
  getCurrentPeriod: () => Promise<SchedulePeriod | null>;
  onClick: () => void;
}> = ({ role, getCurrentPeriod, onClick, style, className }) => {
  const locale = useLocale();
  const { t } = useTranslation("lookup", {
    keyPrefix: `${role}s.detail.glance`,
  });

  const { now, schoolSessionState } = useNow();

  const [loading, setLoading] = useState(true);
  const [currentPeriod, setCurrentPeriod] = useState<SchedulePeriod | null>(
    null,
  );

  /**
   * The percentage of the current period that has passed.
   */
  const percentage = currentPeriod?.content.length
    ? (differenceInSeconds(
        now,
        getTodaySetToPeriodTime(currentPeriod.start_time),
      ) /
        (currentPeriod.duration * 3000)) *
      100
    : 0;

  // Fetch the current period once the percentage reaches 100%
  useEffect(() => {
    // If school is not in session, don’t fetch
    if (schoolSessionState !== SchoolSessionState.schedule) {
      setLoading(false);
      return;
    }

    // Fetch the current period
    (async () => {
      setLoading(true);
      setCurrentPeriod(await getCurrentPeriod());
      setLoading(false);
    })();
  }, [percentage >= 100]);

  return (
    <Card
      appearance="outlined"
      stateLayerEffect
      onClick={onClick}
      style={style}
      className={cn(
        `relative isolate !m-[1px] min-h-[2.5rem] overflow-hidden rounded-md
        !border-0 bg-surface px-3 py-2 hover:!m-0 hover:!border-1 focus:!m-0
        focus:!border-1 focus:!border-outline-variant `,
        loading && `animate-pulse`,
        className,
      )}
    >
      {/* Progress */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: !loading ? `${percentage}%` : "0%" }}
        transition={transition(DURATION.medium2, EASING.standard)}
        className="absolute inset-0 right-auto -z-10 bg-surface-variant"
      />

      {/* Subject name / status */}
      <AnimatePresence>
        {!loading && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transition(DURATION.short2, EASING.standard)}
            className="skc-text skc-text--title-medium"
          >
            {currentPeriod?.content.length
              ? t("ongoing", {
                  subject: getLocaleString(
                    currentPeriod?.content[0].subject.name,
                    locale,
                  ),
                })
              : t("free")}
          </motion.p>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default CurrentPeriodCard;
