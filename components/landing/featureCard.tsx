import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { Card, Text } from "@suankularb-components/react";

/**
 * A Card that shows a feature inside Patch Notes Dialog.
 * 
 * @param icon The icon to show on the left side of the card.
 * @param title A catchy title of the feature.
 * @param desc A short description of the feature.
 */
const FeatureCard: StylableFC<{
  icon: JSX.Element;
  title: string;
  desc: string;
}> = ({ icon, title, desc, style, className }) => (
  <Card
    appearance="filled"
    direction="row"
    style={style}
    className={cn(`gap-3 !border-0 !bg-surface-bright p-3 pr-4`, className)}
  >
    {icon}
    <div className="space-y-1">
      <Text type="title-medium" element="h3">
        {title}
      </Text>
      <Text type="body-medium">{desc}</Text>
    </div>
  </Card>
);

export default FeatureCard;
