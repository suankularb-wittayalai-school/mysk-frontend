import periodDurationToWidth from "@/utils/helpers/schedule/periodDurationToWidth";
import { StylableFC } from "@/utils/types/common";
import {
  DURATION,
  EASING,
  MaterialIcon,
  transition,
} from "@suankularb-components/react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * A visual hint for the extension of a Subject Period.
 * 
 * @param open Whether the hint is visible.
 * @param duration The current visual duration of the extension.
 */
const ExtensionHints: StylableFC<{
  open?: boolean;
  duration: number;
}> = ({ open, duration }) => (
  <AnimatePresence>
    {open && (
      <>
        {/* Arrow */}
        <motion.div
          initial={{ opacity: 0, scaleY: 0, x: -30 }}
          animate={{ opacity: 1, scaleY: 1, x: 0 }}
          exit={{
            opacity: 0,
            scaleY: 0,
            x: -10,
            transition: transition(DURATION.short2, EASING.standardAccelerate),
          }}
          aria-hidden
          className="absolute -right-12 bottom-0.5 z-20 text-secondary"
          transition={transition(DURATION.short4, EASING.standardDecelerate)}
        >
          <MaterialIcon icon="double_arrow" size={40} />
        </motion.div>

        {/* Result guide */}
        <motion.div
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, width: periodDurationToWidth(duration) }}
          exit={{ opacity: 0 }}
          transition={transition(DURATION.short4, EASING.standard)}
          className="absolute inset-0 rounded-sm border-4 border-secondary"
        />
      </>
    )}
  </AnimatePresence>
);

export default ExtensionHints;
