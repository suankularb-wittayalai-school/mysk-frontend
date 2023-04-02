// External libraries
import { FC } from "react";

// Helpers
import { range } from "@/utils/helpers/array";
import { periodTimes } from "@/utils/helpers/schedule";

const NumbersRow: FC = () => {
  return (
    <li>
      <ul className="mb-1 flex w-fit flex-row gap-2">
        <li
          aria-hidden
          className="z-20 -mt-1 -mb-2 w-36 bg-background pt-1 pb-2 sm:sticky sm:left-0"
        />
        {range(10, 1).map((i) => (
          <li
            key={i}
            className="flex w-24 flex-row items-center gap-2 rounded-sm
              bg-surface-2 py-2 px-4"
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
    </li>
  );
};

export default NumbersRow;
