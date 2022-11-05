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
        className="absolute -top-4 -left-4 z-20 flex h-[calc(100%+2rem)] w-[calc(100%+2rem)]
          flex-col items-center justify-center gap-6 rounded-xl !p-6 text-center text-lg backdrop-blur-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={animationTransition}
      >
        <div className="!text-9xl text-on-surface-variant">{icon}</div>
        <p>{text}</p>
      </motion.div>
    )}
  </AnimatePresence>
);

export default BlockingPane;
