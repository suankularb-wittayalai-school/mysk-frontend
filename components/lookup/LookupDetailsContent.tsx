import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { transition, DURATION, EASING } from "@suankularb-components/react";
import { motion } from "framer-motion";
import { ReactNode } from "react";

/**
 * The second child of Lookup Details Card, which contains the rest of the
 * content not in the header area.
 *
 * ```txt
 * +------------------------+
 * | O Header               |
 * |   [ Chip ] [ Chip ]    |
 * |------------------------|
 * | Content                | <-- Lookup Details Content
 * |                        |
 * |                        |
 * |                        |
 * |                        |
 * +------------------------+
 * ```
 *
 * @param children The content of the Card.
 */
const LookupDetailsContent: StylableFC<{
  children: ReactNode;
}> = ({ children, style, className }) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={transition(DURATION.medium2, EASING.standardDecelerate)}
      style={style}
      className={cn(
        `flex grow flex-col gap-5 overflow-auto rounded-t-lg
        bg-surface-container p-4 sm:overflow-visible md:overflow-auto`,
        className,
      )}
    >
      {children}
    </motion.section>
  );
};

export default LookupDetailsContent;
