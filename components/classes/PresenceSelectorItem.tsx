import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { Interactive } from "@suankularb-components/react";

/**
 * A single item in the Presence Selector.
 *
 * @param icon The icon to display.
 * @param tooltip The tooltip to display.
 * @param readOnly Whether the item is part of a read-only Attendance Dialog or not.
 * @param onClick Triggers when the user presses on the item.
 */
const PresenceSelectorItem: StylableFC<{
  icon: JSX.Element;
  tooltip: string;
  readOnly?: boolean;
  onClick: () => void;
}> = ({ icon, tooltip: title, readOnly, onClick, style, className }) => (
  <Interactive
    onClick={!readOnly ? onClick : undefined}
    stateLayerEffect={!readOnly}
    element={(props) => <button {...props} title={title} />}
    style={style}
    className={cn(
      `skc-button skc-button--outlined`,
      className,
    )}
  >
    <div className="skc-button__icon">{icon}</div>
  </Interactive>
);

export default PresenceSelectorItem;
