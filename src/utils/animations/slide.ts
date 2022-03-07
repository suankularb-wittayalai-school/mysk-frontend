// Types
import { Variants } from "framer-motion";

/**
 * Entrance from 10px up with fade in, exit to 10px down with fade out
 */
export const fromUpToDown: Variants = {
  hidden: { opacity: 0, x: 0, y: -10 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: 0, y: 10 },
};
