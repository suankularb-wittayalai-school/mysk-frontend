import { Transition } from "framer-motion";

export const animationSpeed = 0.15;

export const animationTransition: Transition = {
  type: "tween",
  duration: animationSpeed,
  ease: [0.4, 0, 0.2, 1],
};
