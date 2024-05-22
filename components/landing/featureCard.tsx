import { StylableFC } from "@/utils/types/common";
import { MaterialIcon, Text } from "@suankularb-components/react";
import { JsxRuntimeComponents } from "react-markdown/lib";

const FeatureCard: StylableFC<{
    icon: JSX.Element;
    title: string;
    desc: string;
}> = ({icon, title, desc}) => {
  return (
    <div className="flex pt-3 pb-3 pl-3 pr-4 gap-3 self-stretch items-start rounded-md bg-surface">
      {icon}
      <div className="flex flex-col">
      <Text type="title-medium">
        {title}  
      </Text>
      <Text type="body-medium">
        {desc}  
      </Text>
      </div>
    </div>
  );
};

export default FeatureCard;