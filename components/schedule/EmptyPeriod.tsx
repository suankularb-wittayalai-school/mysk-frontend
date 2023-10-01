// Imports
import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";

const EmptyPeriod: StylableFC<{
  isInSession?: boolean;
}> = ({ isInSession, style, className }) => (
  <li
    style={style}
    className={cn(
      `w-24 rounded-sm transition-[border]`,
      isInSession
        ? `border-4 border-tertiary-container`
        : `border-1 border-outline-variant`,
      className,
    )}
  />
);

export default EmptyPeriod;
