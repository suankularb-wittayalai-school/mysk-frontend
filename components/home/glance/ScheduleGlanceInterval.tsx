import { StylableFC } from "@/utils/types/common";
import { transition, useAnimationConfig } from "@suankularb-components/react";
import { motion } from "framer-motion";
import { useTranslation } from "next-i18next";

/**
 * A display of the start and end times passed in by Schedule Glance.
 * 
 * @param interval The interval to display.
 */
const ScheduleGlanceInterval: StylableFC<{
  interval: Interval;
}> = ({ interval, style, className }) => {
  const { t } = useTranslation("schedule", { keyPrefix: "atAGlance" });
  const { duration, easing } = useAnimationConfig();

  return (
    <motion.div
      key={interval.start.toString()}
      layout="position"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={transition(duration.medium4, easing.standard)}
      style={style}
      className={className}
    >
      {t("interval", interval)}
    </motion.div>
  );
};

export default ScheduleGlanceInterval;
