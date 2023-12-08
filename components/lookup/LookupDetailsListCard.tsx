import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { Card, List, Text } from "@suankularb-components/react";
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
    <Card
      appearance="filled"
      style={style}
      className={cn(`overflow-hidden !bg-surface`, className)}
    >
      <Text
        type="title-medium"
        element="h4"
        className={cn(`sticky top-0 z-10 flex flex-row justify-between gap-2
          border-b-1 border-b-outline-variant bg-surface px-3 py-2`)}
      >
        {title}
      </Text>
      <List divided>{children}</List>
    </Card>
  );
};

export default LookupDetailsListCard;
