// Imports
import useNow from "@/utils/helpers/useNow";
import { differenceInSeconds } from "date-fns";
import { FC } from "react";

/**
 * A vertical red line indicating the current time in the Schedule.
 */
const NowLine: FC = () => {
  const now = useNow();

  return (
    <div
      // The Schedule’s content starts at 152 pixels from the left edge
      // (9.5rem), so we add that as the initial value
      // Note: 168 pixels (10.5rem) for mobile to account for 1rem left padding
      className="pointer-events-none absolute left-[10.5rem] top-12 z-20 -mx-1
        text-error drop-shadow-3 transition-transform sm:left-[9.5rem]"
      style={{
        // Each period is 50 minutes = 3000 seconds,
        // represented by 96 + 8 = 104 pixels in width
        // ∴ each second is 104 / 3000 ≈ 0.0347 pixels

        // School starts at 08:30, so we use the number of minutes from then to
        // now
        transform: `translateX(${
          differenceInSeconds(now, new Date().setHours(8, 30), {
            roundingMethod: "round",
          }) *
          (104 / 3000)
        }px)`,
      }}
    >
      <svg
        width="8"
        height="327"
        viewBox="0 0 8 327"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2.50001 325C2.50001 325.828 3.17159 326.5 4.00001 326.5C4.82844
            326.5 5.50001 325.828 5.50001 325L2.50001 325ZM2.5 5L2.50001
            325L5.50001 325L5.5 5L2.5 5Z"
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
    </div>
  );
};

export default NowLine;
