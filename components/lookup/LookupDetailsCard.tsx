import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { ReactNode } from "react";

/**
 * A Card that contains the details of a Lookup Item. The only child of Lookup
 * Details Side.
 *
 * @param children The content of the Card.
 */
const LookupDetailsCard: StylableFC<{
  children: ReactNode;
}> = ({ children, style, className }) => (
  <div
    style={style}
    className={cn(
      `relative flex h-full flex-col overflow-hidden rounded-xl border-1
      border-outline-variant bg-surface-container-highest sm:overflow-auto
      md:overflow-hidden`,
      className,
    )}
  >
    {children}
  </div>
);

export default LookupDetailsCard;
