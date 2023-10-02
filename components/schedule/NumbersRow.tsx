// Imports
import { range } from "@/utils/helpers/array";
import cn from "@/utils/helpers/cn";
import { periodTimes } from "@/utils/helpers/schedule";
import { StylableFC } from "@/utils/types/common";
import { Text } from "@suankularb-components/react";

const NumbersRow: StylableFC = ({ style, className }) => (
  <li style={style} className={className}>
    <ul className="mb-1 flex w-fit flex-row gap-2">
      <li
        aria-hidden
        className={cn(`z-20 -mb-2 -mt-1 w-36 pb-2 pt-1 sm:sticky sm:left-0
          sm:bg-background`)}
      />
      {range(10, 1).map((i) => (
        <li
          key={i}
          className={cn(`flex w-24 flex-row items-center gap-2 rounded-full
            bg-surface-2 px-4 py-2`)}
        >
          <Text type="title-small" className="!leading-none">
            {i}
          </Text>
          <Text
            type="label-small"
            className="!leading-none text-on-surface-variant opacity-80"
          >
            {range(2, i - 1)
              .map((j) =>
                // Get the start/end time of this Period
                Object.values(periodTimes[j])
                  // Format the hours and minutes parts of the time
                  .map((part) => part.toString().padStart(2, "0"))
                  // Join those parts
                  .join(":"),
              )
              // Join the start and end
              .join("\n-")}
          </Text>
        </li>
      ))}
    </ul>
  </li>
);

export default NumbersRow;
