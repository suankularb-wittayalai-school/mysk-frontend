import EnrollmentIndicator from "@/components/elective/EnrollmentIndicator";
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
 * @param radioSelected Whether the Elective Subject’s Radio is selected.
 * @param detailSelected Whether the details of this Elective Subject are being shown.
 * @param enrolled Whether the Student is enrolled in the Elective Subject.
 * @param onRadioToggle Triggers when the radio button is toggled.
 * @param onClick Triggers when the item is clicked.
 */
const ElectiveListItem: StylableFC<{
  electiveSubject: ElectiveSubject;
  radioSelected?: boolean;
  detailSelected?: boolean;
  enrolled?: boolean;
  onRadioToggle?: (value: boolean) => void;
  onClick?: () => void;
}> = ({
  electiveSubject,
  radioSelected,
  detailSelected,
  enrolled,
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
      className={cn(
        `!h-[4.5rem] !pl-6 !pr-7 transition-colors`,
        detailSelected && `!bg-primary-container`,
        className,
      )}
      style={style}
    >
      {/* Radio */}
      <Radio
        value={radioSelected}
        onChange={onRadioToggle}
        disabled={electiveSubject.class_size >= electiveSubject.cap_size}
        inputAttr={{ name: "elective" }}
      />

      {/* Text content */}
      <ListItemContent
        title={getLocaleString(electiveSubject.name, locale)}
        desc={
          <>
            <HoverList
              people={electiveSubject.teachers}
              options={{
                nameJoinerOptions: {
                  // Shorten last name when not in Thai.
                  lastName: locale !== "th" ? "abbr" : true,
                },
              }}
            />
            <span>{" • " + getLocaleString(electiveSubject.code, locale)}</span>
          </>
        }
        element={(props) => <Interactive {...props} onClick={onClick} />}
        className="-m-2 !grid rounded-md p-2 *:truncate"
      />

      {/* Enrollment */}
      <EnrollmentIndicator
        classSize={electiveSubject.class_size}
        capSize={electiveSubject.cap_size}
        className={cn(
          detailSelected && `[&_.skc-progress>*]:!bg-surface-bright`,
          `[&_.skc-progress>*]:transition-colors`,
        )}
      />
    </ListItem>
  );
};

export default ElectiveListItem;
