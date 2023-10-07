// Imports
import getCurrentPeriodByTeacherID from "@/utils/backend/schedule/getCurrentPeriodByTeacherID";
import cn from "@/utils/helpers/cn";
import getLocaleString from "@/utils/helpers/getLocaleString";
import getTodaySetToPeriodTime from "@/utils/helpers/schedule/getTodaySetToPeriodTime";
import useLocale from "@/utils/helpers/useLocale";
import useNow from "@/utils/helpers/useNow";
import { StylableFC } from "@/utils/types/common";
import { SchedulePeriod } from "@/utils/types/schedule";
import {
  transition,
  useAnimationConfig
} from "@suankularb-components/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { differenceInSeconds } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const CurrentTeachingPeriodCard: StylableFC<{
  teacherID: string;
}> = ({ teacherID, style, className }) => {
  const locale = useLocale();
  const now = useNow();

  const { duration, easing } = useAnimationConfig();

  const supabase = useSupabaseClient();

  const [loading, setLoading] = useState(true);
  const [currentPeriod, setCurrentPeriod] = useState<SchedulePeriod | null>(
    null,
  );

  const percentage = currentPeriod?.content.length
    ? (differenceInSeconds(
        now,
        getTodaySetToPeriodTime(currentPeriod.start_time),
      ) /
        (currentPeriod.duration * 3000)) *
      100
    : 0;

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await getCurrentPeriodByTeacherID(
        supabase,
        teacherID,
      );
      if (error) {
        setLoading(false);
        return;
      }
      setCurrentPeriod(data);
      setLoading(false);
    })();
  }, [percentage === 100]);

  return (
    <div
      style={style}
      className={cn(
        `relative isolate h-10 overflow-hidden rounded-md bg-surface px-3 py-2`,
        loading && `animate-pulse`,
        className,
      )}
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: !loading ? `${percentage}%` : "0%" }}
        transition={transition(duration.medium2, easing.standard)}
        className="absolute inset-0 right-auto -z-10 bg-surface-variant"
      />
      <AnimatePresence>
        {!loading && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transition(duration.short2, easing.standard)}
            className="skc-text skc-text--title-medium"
          >
            {currentPeriod
              ? `Teaching ${getLocaleString(
                  currentPeriod?.content[0].subject.name,
                  locale,
                )}`
              : "Not teaching"}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CurrentTeachingPeriodCard;
