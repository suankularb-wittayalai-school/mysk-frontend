import { Tween } from "framer-motion";

export const animationSpeed: number = 0.15;
export const animationEase: Tween["ease"] = [0.4, 0, 0.2, 1];

export const animationTransition: Tween = {
  type: "tween",
  duration: animationSpeed,
  ease: [0.4, 0, 0.2, 1],
};
