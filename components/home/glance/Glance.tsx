import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import {
  Card,
  DURATION,
  EASING,
  transition,
} from "@suankularb-components/react";
import { AnimatePresence, motion } from "framer-motion";
import { ReactNode } from "react";

/**
 * A Glance is a glanceable banner with contextually relevant information
 * displayed on the Home page.
 *
 * @param children The content to display in the Glance.
 * @param visible Whether the Glance is visible.
 */
const Glance: StylableFC<{
  children: ReactNode;
  visible?: boolean;
}> = ({ children, visible, style, className }) => {
  return (
    <AnimatePresence initial={false}>
      {visible && (
        <motion.div
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={transition(DURATION.medium4, EASING.standard)}
          style={{ borderRadius: 28, ...style }}
          className={cn(
            `mx-4 overflow-hidden rounded-xl border-1 border-outline-variant
            bg-surface-container sm:mx-0`,
            className,
          )}
        >
          <Card appearance="filled" className="!contents">
            {children}
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Glance;
