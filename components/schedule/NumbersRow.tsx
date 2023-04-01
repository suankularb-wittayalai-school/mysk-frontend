// External libraries
import { FC } from "react";

// Helpers
import { range } from "@/utils/helpers/array";
import { periodTimes } from "@/utils/helpers/schedule";

const NumbersRow: FC<{ periodWidth: number }> = ({ periodWidth }) => {
  return (
    <ul className="mx-1 mb-1 flex w-fit flex-row gap-2">
      {range(10, 1).map((i) => (
        <li
          key={`numbers-${i}`}
          className="flex flex-row items-center gap-2 rounded-sm bg-surface-2
            py-2 px-4"
          style={{ width: periodWidth - 8 }}
        >
          <span className="skc-title-small !leading-none">{i}</span>
          <span className="skc-label-small !leading-none text-on-surface-variant opacity-80">
            {range(2, i - 1)
              .map((j) =>
                // Get the start/end time of this Period
                Object.values(periodTimes[j])
                  // Format the hours and minutes parts of the time
                  .map((part) => part.toString().padStart(2, "0"))
                  // Join those parts
                  .join(":")
              )
              // Join the start and end
              .join("\n-")}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default NumbersRow;
