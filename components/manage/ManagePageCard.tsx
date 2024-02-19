import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { Actions, Text } from "@suankularb-components/react";
import { ReactNode } from "react";
import Balancer from "react-wrap-balancer";

/**
 * A card to a Manage page.
 *
 * @param children Actions.
 * @param icon Icon to display on the card.
 * @param title Title of the page.
 * @param desc Description of the page.
 */
const ManagePageCard: StylableFC<{
  children: ReactNode;
  icon: JSX.Element;
  title: string;
  desc?: string;
}> = ({ children, icon, title, desc, style, className }) => (
  <div
    style={style}
    className={cn(
      `flex flex-col justify-end rounded-xl bg-surface-variant p-4
      [&>.skc-icon]:text-on-surface-variant`,
      className,
    )}
  >
    {icon}
    <Text type="headline-medium" element="h2" className="mt-2">
      {title}
    </Text>
    {desc && (
      <Text type="body-medium" element="p" className="mt-1">
        <Balancer>{desc}</Balancer>
      </Text>
    )}
    <Actions align="left" className="mt-4 grow !items-end">
      {children}
    </Actions>
  </div>
);

export default ManagePageCard;
