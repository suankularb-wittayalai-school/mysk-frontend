// Imports
import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { ReactNode } from "react";

const ClassDetailsListSection: StylableFC<{
  children: ReactNode;
  title: JSX.Element;
}> = ({ children, title, style, className }) => (
  <section style={style} className={cn(`flex flex-col gap-2`, className)}>
    <div className="flex flex-row items-center rounded-md bg-surface px-3 py-2">
      {title}
    </div>
    {/* I don’t know why but the scrollbar only shows if I put in `h-0`
        CSS is weird! */}
    <div className="-m-[1px] mb-0 grow md:overflow-y-auto md:overflow-x-hidden rounded-md p-[1px] md:h-0">
      <ul className="grid gap-2 md:pb-4">{children}</ul>
    </div>
  </section>
);

export default ClassDetailsListSection;
