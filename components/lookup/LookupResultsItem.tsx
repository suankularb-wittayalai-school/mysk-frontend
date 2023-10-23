// Imports
import { StylableFC } from "@/utils/types/common";
import { transition, useAnimationConfig } from "@suankularb-components/react";
import { motion } from "framer-motion";
import { ReactNode } from "react";

const LookupResultsItem: StylableFC<{
  children: ReactNode;
  idx: number;
  length: number;
}> = ({ children, idx, length }) => {
  const { duration, easing } = useAnimationConfig();

  return (
    <motion.li
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        ...transition(duration.medium2, easing.standardDecelerate),
        delay:
          Math.max(
            (idx / Math.min(length, 10)) * duration.long2,
            duration.short4,
          ) + duration.short4,
      }}
    >
      {children}
    </motion.li>
  );
};

export default LookupResultsItem;
