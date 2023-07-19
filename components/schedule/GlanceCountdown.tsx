// Imports
import ScheduleAtAGlance from "@/components/schedule/ScheduleAtAGlance";
import { useLocale } from "@/utils/hooks/i18n";
import { transition, useAnimationConfig } from "@suankularb-components/react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import { FC } from "react";

/**
 * A countdown overline for {@link ScheduleAtAGlance Schedule at a Glance}.
 *
 * @param minutesLeft The number of minutes to show.
 *
 * @returns An overline.
 */
const GlanceCountdown: FC<{ minutesLeft: number }> = ({ minutesLeft }) => {
  const locale = useLocale();
  const { t } = useTranslation("schedule", { keyPrefix: "atAGlance.timeLeft" });

  const { duration, easing } = useAnimationConfig();

  return (
    <motion.p
      key="glace-time-left"
      layout="position"
      transition={transition(duration.short4, easing.standard)}
      className="skc-label-large -mb-2 w-fit !font-display
        text-on-surface-variant md:-mb-4 [&_*]:mr-1"
    >
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
    </motion.p>
  );
};

export default GlanceCountdown;
