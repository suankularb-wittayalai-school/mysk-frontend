import { StylableFC } from "@/utils/types/common";
import { DURATION, EASING, transition } from "@suankularb-components/react";
import { motion } from "framer-motion";
import { ReactNode } from "react";

const LookupResultsItem: StylableFC<{
  children: ReactNode;
  idx: number;
  length: number;
}> = ({ children, idx, length }) => {
  return (
    <motion.li
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        ...transition(DURATION.medium2, EASING.standardDecelerate),
        delay:
          Math.max(
            (idx / Math.min(length, 10)) * DURATION.long2,
            DURATION.short4,
          ) + DURATION.short4,
      }}
    >
      {children}
    </motion.li>
  );
};

export default LookupResultsItem;
