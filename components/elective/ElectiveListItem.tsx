import EnrollmentIndicator from "@/components/elective/EnrollmentIndicator";
import HoverList from "@/components/person/HoverList";
import cn from "@/utils/helpers/cn";
import getLocaleString from "@/utils/helpers/getLocaleString";
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/common";
import { ElectiveSubject } from "@/utils/types/elective";
import { UserRole } from "@/utils/types/person";
import {
  ChipSet,
  InputChip,
  ListItem,
  ListItemContent,
  MaterialIcon,
  Radio,
} from "@suankularb-components/react";
import { useTranslation } from "next-i18next";
import { sort } from "radash";

/**
 * A List Item representing an Elective Subject.
 *
 * @param role The role of the User viewing the Elective Subject.
 * @param electiveSubject The Elective Subject to display.
 * @param selected Whether this Elective Subject is selected.
 * @param enrolled Whether the Student is enrolled in the Elective Subject.
 * @param onRadioToggle Triggers when the radio button is toggled.
 */
const ElectiveListItem: StylableFC<{
  role: UserRole;
  electiveSubject: ElectiveSubject;
  selected?: boolean;
  enrolled?: boolean;
  onClick?: () => void;
}> = ({
  role,
  electiveSubject,
  selected,
  enrolled,
  onClick,
  style,
  className,
}) => {
  const locale = useLocale();
  const { t } = useTranslation("elective", { keyPrefix: "list" });
  const { t: tx } = useTranslation("common");

  return (
    <ListItem
      align="top"
      lines={2}
      stateLayerEffect
      onClick={onClick}
      className={cn(
        `transition-colors`,
        ...(role === UserRole.student
          ? [
              `!pl-6 !pr-7`,
              enrolled ? `!py-3.5` : `!py-3`,
              enrolled
                ? `!bg-surface-variant`
                : selected && `!bg-primary-container state-layer:!bg-primary`,
            ]
          : [
              `!rounded-xl !bg-surface-bright !px-5 !py-4`,
              selected && `md:!bg-primary-container state-layer:md:!bg-primary`,
            ]),
        className,
      )}
      style={style}
    >
      {/* Radio */}
      {role === UserRole.student &&
        (enrolled ? (
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
            className="py-3"
          />
        ))}

      {/* Text content */}
      <div
        className={role === UserRole.teacher ? "grid grow gap-3" : "contents"}
      >
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
              <span>
                {electiveSubject.teachers.length > 0 && " • "}
                {getLocaleString(electiveSubject.code, locale)}
              </span>
            </>
          }
          className="!grid *:truncate"
        />
        {role === UserRole.teacher && (
          <ChipSet
            scrollable
            className="fade-out-to-r -ml-6 -mr-16 *:pl-6 *:pr-8"
          >
            {sort(
              electiveSubject.applicable_classrooms,
              (classroom) => classroom.number,
            ).map((classroom) => (
              <InputChip key={classroom.id} className="!cursor-pointer">
                {tx("class", { number: classroom.number })}
              </InputChip>
            ))}
          </ChipSet>
        )}
      </div>

      {/* Enrollment */}
      <EnrollmentIndicator
        classSize={electiveSubject.class_size}
        capSize={electiveSubject.cap_size}
        className={cn(
          (enrolled || selected) &&
            (role === UserRole.student
              ? `[&_.skc-progress>*]:!bg-surface-bright`
              : `[&_.skc-progress>*]:md:!bg-surface-bright`),
          `pt-2 [&_.skc-progress>*]:transition-colors`,
        )}
      />
    </ListItem>
  );
};

export default ElectiveListItem;
