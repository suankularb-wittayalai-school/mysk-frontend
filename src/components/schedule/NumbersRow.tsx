// External libraries
import { FC } from "react";

// Helpers
import { range } from "@utils/helpers/array";
import { periodTimes } from "@utils/helpers/schedule";

const NumbersRow: FC = () => {
  return (
    <ul className="mx-1 mb-1 flex w-fit flex-row gap-2">
      {range(10, 1).map((i) => (
        <li
          key={`numbers-${i}`}
          className="flex w-[104px] flex-row items-center gap-2 rounded-lg
            bg-surface-1 py-2 px-4 leading-none"
        >
          <span className="font-display font-medium">{i}</span>
          <span className="text-xs text-outline">
            {range(2, -1)
              .map((j) =>
                // Get the start/end time of this Period
                Object.values(periodTimes[i + j])
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
