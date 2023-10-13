// Imports
import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { Text } from "@suankularb-components/react";
import { ReactNode } from "react";

const InformationCard: StylableFC<{
  children: ReactNode;
  title: string;
}> = ({ children, title, style, className }) => {
  return (
    <section
      style={style}
      className={cn(`space-y-0.5 rounded-md bg-surface px-3 py-2`, className)}
    >
      <Text type="title-medium" element="h4">
        {title}
      </Text>
      <Text type="body-medium" element="div">
        {children}
      </Text>
    </section>
  );
};

export default InformationCard;
