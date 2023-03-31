// External libraries
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import type { FC, ReactNode } from "react";

// SK Components
import {
  transition,
  Card,
  useAnimationConfig,
} from "@suankularb-components/react";

const RightCardList: FC<{
  children: ReactNode;
  emptyText: string;
  isEmpty?: boolean;
}> = ({ children, emptyText, isEmpty }) => {
  const { duration, easing } = useAnimationConfig();

  return (
    <AnimatePresence initial={false} mode="wait">
      {isEmpty ? (
        <motion.div
          className="min-h-[5rem]"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={transition(duration.medium2, easing.standard)}
        >
          <Card
            appearance="outlined"
            className="!grid h-full place-content-center p-4"
          >
            <p className="skc-body-medium text-center text-on-surface-variant">
              {emptyText}
            </p>
          </Card>
        </motion.div>
      ) : (
        <motion.ul
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 1 }}
          transition={transition(duration.medium2, easing.standard)}
          className="flex flex-col gap-3"
        >
          <LayoutGroup>
            <AnimatePresence initial={false}>{children}</AnimatePresence>
          </LayoutGroup>
        </motion.ul>
      )}
    </AnimatePresence>
  );
};

export default RightCardList;
