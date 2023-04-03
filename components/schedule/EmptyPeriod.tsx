// External libraries
import { FC } from "react";

// Helpers
import { cn } from "@/utils/helpers/className";

const EmptyPeriod: FC<{ isInSession?: boolean }> = ({ isInSession }) => {
  return (
    <li
      className={cn([
        "w-24 rounded-sm transition-[border]",
        isInSession
          ? "border-4 border-tertiary-container"
          : "border-1 border-outline-variant",
      ])}
    />
  );
};

export default EmptyPeriod;
