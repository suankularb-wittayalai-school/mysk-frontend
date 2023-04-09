// External libraries
import { useTranslation } from "next-i18next";
import { FC } from "react";

// SK Components
import { Card, CardHeader } from "@suankularb-components/react";

// Internal components
import DynamicAvatar from "@/components/common/DynamicAvatar";

// Types
import { PersonLookupItem } from "@/utils/types/person";

// Helpers
import { cn } from "@/utils/helpers/className";
import { getLocaleString } from "@/utils/helpers/i18n";
import { nameJoiner } from "@/utils/helpers/name";

// Hooks
import { useLocale } from "@/utils/hooks/i18n";

const PersonCard: FC<{
  person: PersonLookupItem;
  selected?: number;
  setSelected?: (id: number) => void;
}> = ({ person, selected, setSelected }) => {
  // Translation
  const locale = useLocale();
  const { t } = useTranslation("common");

  const thisSelected = selected === person.id;

  return (
    <Card
      appearance="filled"
      direction="row"
      stateLayerEffect
      onClick={() => setSelected && setSelected(person.id)}
      className={cn([
        "text-left",
        !thisSelected && "!border-transparent !bg-transparent",
        person.role === "teacher"
          ? thisSelected
            ? `!bg-secondary-container !text-on-secondary-container state-layer:!bg-on-secondary-container`
            : `state-layer:!bg-secondary`
          : thisSelected && `!bg-primary-container !text-on-primary-container`,
      ])}
    >
      <CardHeader
        avatar={
          <DynamicAvatar
            name={person.name}
            className={
              person.role === "teacher"
                ? thisSelected
                  ? `!bg-secondary !text-on-secondary`
                  : `!bg-secondary-container !text-on-secondary-container`
                : thisSelected
                ? `!bg-primary !text-on-primary`
                : `!bg-primary-container !text-on-primary-container`
            }
          />
        }
        title={nameJoiner(locale, person.name, person.prefix)}
        subtitle={
          person.role === "teacher"
            ? getLocaleString(person.metadata.name, locale)
            : t("class", { number: person.metadata.number })
        }
      />
    </Card>
  );
};

export default PersonCard;
