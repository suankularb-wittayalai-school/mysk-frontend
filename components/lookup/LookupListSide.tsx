// Imports
import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { ReactNode } from "react";

const LookupListSide: StylableFC<{
  children: ReactNode;
  length: number;
}> = ({ children, length, style, className }) => (
  <section
    style={style}
    className={cn(
      `flex flex-col sm:block sm:!pb-0 md:flex md:!overflow-visible`,
      length === 0 && `h-[calc(100dvh-9rem)] sm:flex`,
      className,
    )}
  >
    {children}
  </section>
);

export default LookupListSide;
