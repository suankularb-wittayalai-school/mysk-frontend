// External libraries
import { differenceInSeconds } from "date-fns";
import { motion } from "framer-motion";
import { FC, useEffect, useState } from "react";

// SK Components
import { transition, useAnimationConfig } from "@suankularb-components/react";

const NowLine: FC = () => {
  // Animation
  const { duration, easing } = useAnimationConfig();

  // Time calculation set up
  const [now, setNow] = useState<Date>(new Date());

  // Update the current time every second
  useEffect(() => {
    const nowInterval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(nowInterval);
  }, []);

  return (
    <motion.div
      className="absolute top-12 left-[10.5rem] z-30 -mx-1 text-error sm:left-[9.5rem]"
      animate={{
        // Each period is 50 minutes = 3000 seconds,
        // represented by 96 + 8 = 104 pixels in width
        // ∴ each second is 104 / 3000 ≈ 0.0347

        // School starts at 08:30, so we use the number of minutes from then to now

        // The Schedule’s content starts at 152 pixels from the left edge, so
        // we add that as the initial value
        x:
          differenceInSeconds(now, new Date().setHours(8, 30), {
            roundingMethod: "round",
          }) *
          (104 / 3000),
      }}
      transition={transition(duration.short4, easing.standard)}
    >
      <svg
        width="8"
        height="327"
        viewBox="0 0 8 327"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2.50001 325C2.50001 325.828 3.17159 326.5 4.00001 326.5C4.82844 326.5 5.50001 325.828 5.50001 325L2.50001 325ZM2.5 5L2.50001 325L5.50001 325L5.5 5L2.5 5Z"
          fill="currentColor"
        />
        <circle
          cx="4"
          cy="4"
          r="3.5"
          fill="currentColor"
          stroke="currentColor"
        />
      </svg>
    </motion.div>
  );
};

export default NowLine;
