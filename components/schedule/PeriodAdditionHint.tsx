import ScheduleContext from "@/contexts/ScheduleContext";
import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import {
  DURATION,
  EASING,
  transition,
  useBreakpoint,
} from "@suankularb-components/react";
import { AnimatePresence, motion } from "framer-motion";
import { useContext } from "react";

const PeriodAdditionHint: StylableFC = ({ style, className }) => {
  // Animation
  const { atBreakpoint } = useBreakpoint();

  // Context
  const { periodWidth, periodHeight, additionSite } =
    useContext(ScheduleContext);

  return (
    <AnimatePresence>
      {additionSite?.startTime && additionSite?.day && (
        <motion.div
          initial={{ opacity: 0, scale: 1.6 }}
          animate={{
            x:
              (additionSite.startTime - 1) * periodWidth +
              (atBreakpoint === "base" ? 16 : 0),
            y: (additionSite.day - 1) * (periodHeight + 4),
            opacity: 1,
            scale: 1,
          }}
          exit={{ opacity: 0, scale: 1.2 }}
          transition={transition(DURATION.medium2, EASING.standard)}
          style={style}
          className={cn(
            `absolute left-[9.5rem] top-[3.625rem] z-20 h-14 w-24 rounded-sm
            border-4 border-primary`,
            className,
          )}
        />
      )}
    </AnimatePresence>
  );
};

export default PeriodAdditionHint;
