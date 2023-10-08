import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { transition, useAnimationConfig } from "@suankularb-components/react";
import { motion } from "framer-motion";
import { ReactNode } from "react";

const LookupDetailSide: StylableFC<{
  children: ReactNode;
  selectedID?: string;
  length: number;
}> = ({ children, selectedID, length, style, className }) => {
  const { duration, easing } = useAnimationConfig();

  return (
    <main style={style} className={cn(`md:!col-span-2`, className)}>
      {(selectedID || length === 0) && (
        <motion.div
          key={selectedID}
          initial={{ opacity: 0, scale: 0.95, x: -10 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{
            ...transition(duration.medium2, easing.standardDecelerate),
            delay: length === 0 ? duration.medium4 : 0,
          }}
          className="h-full"
        >
          {children}
        </motion.div>
      )}
    </main>
  );
};

export default LookupDetailSide;
