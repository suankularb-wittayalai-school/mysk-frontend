import HoverList from "@/components/person/HoverList";
import cn from "@/utils/helpers/cn";
import getLocaleString from "@/utils/helpers/getLocaleString";
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/common";
import { ElectiveSubject } from "@/utils/types/elective";
import {
  Interactive,
  ListItem,
  ListItemContent,
  Radio,
} from "@suankularb-components/react";

/**
 * A List Item representing an Elective Subject.
 *
 * @param electiveSubject The Elective Subject to display.
 * @param selected Whether the Elective Subject is selected.
 */
const ElectiveListItem: StylableFC<{
  electiveSubject: ElectiveSubject;
  selected?: boolean;
  onRadioToggle?: (value: boolean) => void;
  onClick?: () => void;
}> = ({
  electiveSubject,
  selected,
  onRadioToggle,
  onClick,
  style,
  className,
}) => {
  const locale = useLocale();

  return (
    <ListItem
      align="center"
      lines={2}
      className={cn(`!h-[4.5rem] !pl-6 !pr-7`, className)}
      style={style}
    >
      {/* Radio */}
      <Radio value={selected} onChange={onRadioToggle} />

      {/* Text content */}
      <ListItemContent
        title={getLocaleString(electiveSubject.name, locale)}
        desc={
          <>
            <HoverList
              people={electiveSubject.teachers}
              options={{ nameJoinerOptions: {} }}
            />
            <span>{" • " + getLocaleString(electiveSubject.code, locale)}</span>
          </>
        }
        element={(props) => <Interactive {...props} onClick={onClick} />}
        className="-m-2 rounded-md p-2"
      />

      {/* Enrollment */}
      {/* TODO */}
    </ListItem>
  );
};

export default ElectiveListItem;
