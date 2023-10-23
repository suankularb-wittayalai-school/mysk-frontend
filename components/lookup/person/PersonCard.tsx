// Imports
import DynamicAvatar from "@/components/common/DynamicAvatar";
import cn from "@/utils/helpers/cn";
import getLocaleName from "@/utils/helpers/getLocaleName";
import getLocaleString from "@/utils/helpers/getLocaleString";
import useLocale from "@/utils/helpers/useLocale";
import { PersonLookupItem, UserRole } from "@/utils/types/person";
import { Card, CardHeader, useBreakpoint } from "@suankularb-components/react";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC } from "react";

const PersonCard: FC<{
  person: PersonLookupItem;
  selected?: { id: string; role: UserRole };
  setSelected?: (selected: { id: string; role: UserRole }) => void;
}> = ({ person, selected, setSelected }) => {
  // Translation
  const locale = useLocale();
  const { t } = useTranslation("common");

  // Router
  const router = useRouter();

  // Responsive
  const { atBreakpoint } = useBreakpoint();

  /**
   * If this Card is the selected Card in Lookup People. A selected Card has a
   * different styling.
   */
  const thisSelected = selected?.id === person.id;

  return (
    <Card
      appearance="outlined"
      direction="row"
      stateLayerEffect
      {...(atBreakpoint === "base"
        ? // If the user is on mobile, open a new page
          {
            href: `/lookup/person/${person.role}/${person.id}`,
            element: Link,
          }
        : // If the user is on tablet/desktop, show the selected Person in the
          // detail section
          {
            onClick: () => {
              if (setSelected) setSelected({ ...person });
              router.push(
                `/lookup/person?id=${person.id}&role=${person.role}`,
                undefined,
                { shallow: true },
              );
            },
          })}
      className={cn(
        "!border-transparent !bg-transparent text-left",
        thisSelected && `sm:!border-outline-variant`,
        person.role === "teacher"
          ? thisSelected
            ? `sm:!bg-secondary-container sm:!text-on-secondary-container
               sm:focus:!border-secondary
               sm:state-layer:!bg-on-secondary-container`
            : `state-layer:!bg-secondary`
          : thisSelected &&
              `sm:!bg-primary-container sm:!text-on-primary-container
             sm:focus:!border-primary`,
      )}
    >
      <CardHeader
        avatar={
          <DynamicAvatar
            // name={person.name}
            first_name={person.first_name}
            last_name={person.last_name}
            className={
              person.role === "teacher"
                ? cn(
                    thisSelected && `sm:!bg-secondary sm:!text-on-secondary`,
                    `!bg-secondary-container !text-on-secondary-container`,
                  )
                : thisSelected
                ? `sm:!bg-primary sm:!text-on-primary`
                : undefined
            }
          />
        }
        title={getLocaleName(locale, person, {
          prefix: person.role === "teacher" ? "teacher" : false,
        })}
        subtitle={
          // person.metadata
          //   ? person.role === "teacher"
          //     ? getLocaleString(person.metadata.name, locale)
          //     : t("class", { number: person.metadata.number })
          //   : undefined
          person.role === "teacher"
            ? getLocaleString(person.subject_group.name, locale)
            : person.classroom
            ? t("class", { number: person.classroom.number })
            : undefined
        }
      />
    </Card>
  );
};

export default PersonCard;
