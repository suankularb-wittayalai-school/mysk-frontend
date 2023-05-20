// External libraries
import { AnimatePresence, motion } from "framer-motion";
import { FC } from "react";

// SK Components
import {
  MaterialIcon,
  transition,
  useAnimationConfig,
} from "@suankularb-components/react";

// Types
import { ColorScheme } from "@/utils/types/common";

/**
 * An icon representing a color scheme.
 *
 * @param colorScheme Either `light` or `dark`.
 *
 * @returns A Material Icon.
 */
const SchemeIcon: FC<{ colorScheme: ColorScheme }> = ({ colorScheme }) => {
  const { duration, easing } = useAnimationConfig();

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.div
        key={colorScheme}
        initial={{ rotate: "-90deg", x: -15, y: 10, opacity: 0 }}
        animate={{ rotate: "0deg", x: 0, y: 0, opacity: 1 }}
        exit={{ rotate: "90deg", x: 15, y: 10, opacity: 0 }}
        transition={transition(duration.medium2, easing.standardDecelerate)}
      >
        {colorScheme === "dark" ? (
          <MaterialIcon icon="dark_mode" />
        ) : (
          <MaterialIcon icon="light_mode" />
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default SchemeIcon;
