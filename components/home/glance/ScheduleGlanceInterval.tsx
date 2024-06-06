import { StylableFC } from "@/utils/types/common";
import { DURATION, EASING, transition } from "@suankularb-components/react";
import { Interval } from "date-fns";
import { motion } from "framer-motion";
import useTranslation from "next-translate/useTranslation";

/**
 * A display of the start and end times passed in by Schedule Glance.
 *
 * @param interval The interval to display.
 */
const ScheduleGlanceInterval: StylableFC<{
  interval: Interval;
}> = ({ interval, style, className }) => {
  const { t } = useTranslation("home/glance/schedule");

  return (
    <motion.div
      key={interval.start.toString()}
      layout="position"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={transition(DURATION.medium4, EASING.standard)}
      style={style}
      className={className}
    >
      {t("interval", interval)}
    </motion.div>
  );
};

export default ScheduleGlanceInterval;
