import { Easing, Transition } from "framer-motion/types/types";

export const animationSpeed: number = 0.15;
export const animationEase: Easing = [0.4, 0, 0.2, 1];

export const animationTransition: Transition = {
  type: "tween",
  duration: animationSpeed,
  ease: [0.4, 0, 0.2, 1],
};
