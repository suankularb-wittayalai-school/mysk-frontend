import MoreIndicatorEdge from "@/components/schedule/MoreIndicatorEdge";
import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";

/**
 * This indicator lets the user know that there are more Elective Periods that
 * are not shown.
 */
const MoreIndicator: StylableFC = ({ style, className }) => (
  <div
    style={style}
    className={cn(
      `bg-[--_background-color] text-[--_background-color] *:absolute
      before:absolute before:inset-0 before:bg-[--_foreground-color]
      before:opacity-[.12]`,
      className,
    )}
  >
    {/* Left side */}
    <MoreIndicatorEdge style={{ top: -1, left: -7 }} />
    <MoreIndicatorEdge
      style={{ top: -1, left: -7 }}
      className="text-[--_foreground-color] opacity-[.12]"
    />

    {/* Right side */}
    <MoreIndicatorEdge
      style={{ top: -1, right: -7 }}
      className="-scale-x-100" // Flip the right side.
    />
    <MoreIndicatorEdge
      style={{ top: -1, right: -7 }}
      className="-scale-x-100 text-[--_foreground-color] opacity-[.12]"
    />
  </div>
);

export default MoreIndicator;
