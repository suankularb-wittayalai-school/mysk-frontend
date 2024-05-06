import ScheduleContext from "@/contexts/ScheduleContext";
import cn from "@/utils/helpers/cn";
import { SCHEDULE_START } from "@/utils/helpers/schedule/schoolSessionStateAt";
import useNow from "@/utils/helpers/useNow";
import { StylableFC } from "@/utils/types/common";
import { differenceInSeconds } from "date-fns";
import { useContext } from "react";

/**
 * A vertical red line indicating the current time in the Schedule.
 */
const NowLine: StylableFC = ({ style, className }) => {
  const { periodWidth, periodHeight } = useContext(ScheduleContext);
  const { now } = useNow();

  return (
    <div
      aria-hidden
      // The Schedule’s content starts at 152 pixels from the left edge
      // (9.5rem), so we add that as the initial value
      // Note: 168 pixels (10.5rem) for mobile to account for 1rem left padding
      className={cn(
        `pointer-events-none absolute left-[10.5rem] top-1.5 z-20 -mx-1
        text-error drop-shadow-3 transition-transform sm:left-[9.5rem]`,
        className,
      )}
      style={{
        ...style,

        // Each period is 50 minutes = 3000 seconds,
        // represented by 96 + 8 = 104 pixels in width
        // ∴ each second is 104 / 3000 ≈ 0.0347 pixels

        // School starts at 08:30, so we use the number of minutes from then to
        // now
        transform: `translateX(${
          differenceInSeconds(now, new Date(now).setHours(...SCHEDULE_START), {
            roundingMethod: "round",
          }) *
          (periodWidth / 3000)
        }px)`,
      }}
    >
      <svg
        width={10}
        height={366}
        viewBox="0 0 10 366"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5 2L5 364"
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="round"
        />
        <circle
          cx={5}
          cy={48 + (periodHeight + 4) * (now.getDay() - 1)}
          r={5}
          fill="currentColor"
        />
      </svg>
    </div>
  );
};

export default NowLine;
