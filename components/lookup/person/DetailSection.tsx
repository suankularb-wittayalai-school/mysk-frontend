// External libraries
import { Text } from "@suankularb-components/react";
import { FC, ReactNode } from "react";

const DetailSection: FC<{
  children: ReactNode;
  title: string;
  className?: string;
}> = ({ children, title, className }) => {
  return (
    <div {...{ className }}>
      <Text type="title-medium" element="h4">
        {title}
      </Text>
      {children}
    </div>
  );
};

export default DetailSection;
