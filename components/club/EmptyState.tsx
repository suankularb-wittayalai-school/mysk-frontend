// Imports
import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { Card } from "@suankularb-components/react";
import { ReactNode } from "react";
import Balancer from "react-wrap-balancer";

/**
 * A Card with some verbiage explaining why there is no content at a particular
 * place. Replaces the content.
 *
 * @param children The verbiage to display.
 *
 * @returns A Card.
 */
const EmptyState: StylableFC<{
  children: ReactNode;
}> = ({ children, className, style }) => (
  <Card
    appearance="outlined"
    className={cn(`grid place-content-center p-4`, className)}
    style={style}
  >
    <p className="skc-body-medium text-center text-on-surface-variant">
      <Balancer>{children}</Balancer>
    </p>
  </Card>
);

export default EmptyState;
