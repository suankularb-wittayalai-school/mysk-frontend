import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { ReactNode } from "react";

/**
 * A Card within Lookup Details Content that displays a List.
 *
 * @param children The List Items.
 * @param title The title of the Card.
 */
const LookupDetailsListCard: StylableFC<{
  children: ReactNode;
  title: string | JSX.Element;
}> = ({ children, title, style, className }) => {
  return (
    <section style={style} className={cn(`flex flex-col gap-2`, className)}>
      <div className="flex flex-row items-center rounded-md bg-surface px-3 py-2">
        {title}
      </div>
      {/* I don’t know why but the scrollbar only shows if I put in `h-0`
          CSS is weird! */}
      <div
        className={cn(`mb-0 grow rounded-t-md md:h-0 md:overflow-y-auto
          md:overflow-x-hidden`)}
      >
        <ul className="grid gap-1 p-[1px] md:pb-4">{children}</ul>
      </div>
    </section>
  );
};

export default LookupDetailsListCard;
