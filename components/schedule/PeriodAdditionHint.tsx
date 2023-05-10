// External libraries
import { AnimatePresence, motion } from "framer-motion";
import { FC, useContext } from "react";

// SK Components
import {
  transition,
  useAnimationConfig,
  useBreakpoint,
} from "@suankularb-components/react";

// Contexts
import ScheduleContext from "@/contexts/ScheduleContext";

const PeriodAdditionHint: FC = () => {
  // Animation
  const { atBreakpoint } = useBreakpoint();
  const { duration, easing } = useAnimationConfig();

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
          transition={transition(duration.medium2, easing.standard)}
          className="absolute left-[9.5rem] top-[3.625rem] z-20 h-14 w-24
            rounded-sm border-4 border-primary"
        />
      )}
    </AnimatePresence>
  );
};

export default PeriodAdditionHint;
