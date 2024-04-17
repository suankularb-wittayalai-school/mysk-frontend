import EnrollmentIndicator from "@/components/elective/EnrollmentIndicator";
import HoverList from "@/components/person/HoverList";
import cn from "@/utils/helpers/cn";
import getLocaleString from "@/utils/helpers/getLocaleString";
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/common";
import { ElectiveSubject } from "@/utils/types/elective";
import {
  ListItem,
  ListItemContent,
  MaterialIcon,
  Radio,
} from "@suankularb-components/react";
import { useTranslation } from "next-i18next";

/**
 * A List Item representing an Elective Subject.
 *
 * @param electiveSubject The Elective Subject to display.
 * @param selected Whether this Elective Subject is selected.
 * @param enrolled Whether the Student is enrolled in the Elective Subject.
 * @param onRadioToggle Triggers when the radio button is toggled.
 */
const ElectiveListItem: StylableFC<{
  electiveSubject: ElectiveSubject;
  selected?: boolean;
  enrolled?: boolean;
  onClick?: () => void;
}> = ({ electiveSubject, selected, enrolled, onClick, style, className }) => {
  const locale = useLocale();
  const { t } = useTranslation("elective", { keyPrefix: "list" });

  return (
    <ListItem
      align="center"
      lines={2}
      stateLayerEffect
      onClick={onClick}
      className={cn(
        `!pl-6 !pr-7 transition-colors`,
        enrolled ? `!py-3.5` : `!py-3`,
        enrolled ? `!bg-surface-variant` : selected && `!bg-primary-container`,
        className,
      )}
      style={style}
    >
      {/* Radio */}
      {enrolled ? (
        <MaterialIcon
          icon="check"
          fill
          className="-mx-[0.1875rem] text-secondary"
        />
      ) : (
        <Radio
          value={selected}
          disabled={electiveSubject.class_size >= electiveSubject.cap_size}
          inputAttr={{ name: "elective" }}
        />
      )}

      {/* Text content */}
      <ListItemContent
        overline={enrolled ? t("enrolled") : undefined}
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
        className="!grid *:truncate"
      />

      {/* Enrollment */}
      <EnrollmentIndicator
        classSize={electiveSubject.class_size}
        capSize={electiveSubject.cap_size}
        className={cn(
          selected && `[&_.skc-progress>*]:!bg-surface-bright`,
          `[&_.skc-progress>*]:transition-colors`,
        )}
      />
    </ListItem>
  );
};

export default ElectiveListItem;
