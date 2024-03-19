import Glance from "@/components/home/glance/Glance";
import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { Text } from "@suankularb-components/react";
import { ReactNode } from "react";

/**
 * A Text Glance is a minimal {@link Glance} with only text.
 *
 * @param children The text to display in the Glance.
 * @param icon The icon to display on the starting edge of the Glance.
 * @param visible Whether the Glance is visible.
 */
const TextGlance: StylableFC<{
  children: ReactNode;
  icon: JSX.Element;
  visible?: boolean;
}> = ({ children, icon, visible, style, className }) => (
  <Glance
    visible={visible}
    style={style}
    className={cn(
      `grid grid-cols-[1.25rem,1fr] items-center gap-2 px-2.5
      py-2 text-on-surface *:first:text-on-surface-variant`,
      className,
    )}
  >
    {icon}
    <Text type="body-medium">{children}</Text>
  </Glance>
);

export default TextGlance;
