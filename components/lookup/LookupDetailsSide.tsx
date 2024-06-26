import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { DURATION, EASING, transition } from "@suankularb-components/react";
import { motion } from "framer-motion";
import { ReactNode } from "react";

const LookupDetailsSide: StylableFC<{
  children: ReactNode;
  selectedID: string | null;
  length: number;
}> = ({ children, selectedID, length, style, className }) => {
  return (
    <main style={style} className={cn(`md:!col-span-2`, className)}>
      {(selectedID || length === 0) && (
        <motion.div
          key={selectedID}
          initial={{ opacity: 0, scale: 0.95, x: -10 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{
            ...transition(DURATION.medium2, EASING.standardDecelerate),
            delay: length === 0 ? DURATION.medium4 : 0,
          }}
          className="h-full"
        >
          {children}
        </motion.div>
      )}
    </main>
  );
};

export default LookupDetailsSide;
