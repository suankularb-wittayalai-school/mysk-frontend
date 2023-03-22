// External libraries
import { AnimatePresence, motion } from "framer-motion";
import { FC, ReactNode } from "react";

// SK Components
import { transition, useAnimationConfig } from "@suankularb-components/react";

const BlockingPane: FC<{
  icon?: JSX.Element;
  open?: boolean;
  children: ReactNode;
}> = ({ icon, open, children }) => {
  const { duration, easing } = useAnimationConfig();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="absolute z-30 flex h-full w-full flex-col items-center
            justify-center gap-6 !p-6 backdrop-blur-lg sm:-top-4 sm:-left-4 sm:h-[calc(100%+2rem)] sm:w-[calc(100%+2rem)] sm:rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={transition(duration.medium2, easing.standard)}
        >
          {icon && <div className="text-on-surface-variant">{icon}</div>}
          <p className="skc-body-medium text-center">{children}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BlockingPane;
