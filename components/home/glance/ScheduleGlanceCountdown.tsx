import cn from "@/utils/helpers/cn";
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/common";
import { transition, useAnimationConfig } from "@suankularb-components/react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "next-i18next";

/**
 * An animated countdown for Schedule Glance.
 *
 * @param minutesLeft The number of minutes to show.
 */
const ScheduleGlanceCountdown: StylableFC<{
  minutesLeft: number;
}> = ({ minutesLeft, style, className }) => {
  const locale = useLocale();
  const { t } = useTranslation("schedule", {
    keyPrefix: "atAGlance.countdown",
  });

  const { duration, easing } = useAnimationConfig();

  return (
    <p style={style} className={cn(`space-x-1`, className)}>
      <motion.span layout="position" className="inline-block empty:hidden">
        {t("pre", { count: minutesLeft })}
      </motion.span>
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={minutesLeft}
          layout="position"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={transition(duration.medium4, easing.standard)}
          className="inline-block"
        >
          {minutesLeft.toLocaleString(locale)}
        </motion.span>
      </AnimatePresence>
      <motion.span
        layout="position"
        transition={transition(duration.medium4, easing.standard)}
        className="inline-block empty:hidden"
      >
        {t("post", { count: minutesLeft })}
      </motion.span>
    </p>
  );
};

export default ScheduleGlanceCountdown;
