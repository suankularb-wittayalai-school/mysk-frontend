import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { Text } from "@suankularb-components/react";
import { ReactNode } from "react";

/**
 * A Section of a Trades Card, containing a list of Incoming/Outgoing Trade
 * Cards.
 *
 * @param children The Incoming/Outgoing Trade Cards to display.
 * @param icon The Icon to display next to the section title.
 * @param title The title of the section.
 */
const TradesCardSection: StylableFC<{
  children: ReactNode;
  icon: JSX.Element;
  title: string;
}> = ({ children, icon, title, style, className }) => (
  <section style={style} className={cn(`space-y-2`, className)}>
    <header
      className={cn(`flex flex-row items-center gap-1.5
        [&_i]:text-on-surface-variant`)}
    >
      {icon}
      <Text type="title-medium" element="h3">
        {title}
      </Text>
    </header>
    <ul className="-ml-3 -mr-1 space-y-1">{children}</ul>
  </section>
);

export default TradesCardSection;
