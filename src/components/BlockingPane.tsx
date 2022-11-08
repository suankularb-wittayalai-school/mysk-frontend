// External libraries
import { AnimatePresence, motion } from "framer-motion";

// Animations
import { animationTransition } from "@utils/animations/config";

const BlockingPane = ({
  icon,
  text,
  show,
}: {
  icon?: JSX.Element;
  text: string;
  show?: boolean;
}): JSX.Element => (
  <AnimatePresence>
    {show && (
      <motion.div
        className="absolute z-10 flex h-full w-full flex-col items-center
          justify-center gap-6 !p-6 text-center text-lg backdrop-blur-lg
          sm:-top-4 sm:-left-4 sm:h-[calc(100%+2rem)] sm:w-[calc(100%+2rem)]
          sm:rounded-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={animationTransition}
      >
        {icon && (
          <div className="!text-9xl text-on-surface-variant">{icon}</div>
        )}
        <p>{text}</p>
      </motion.div>
    )}
  </AnimatePresence>
);

export default BlockingPane;
