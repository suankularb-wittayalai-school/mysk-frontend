// Imports
import DynamicAvatar from "@/components/common/DynamicAvatar";
import PersonActions from "@/components/lookup/person/PersonActions";
import cn from "@/utils/helpers/cn";
import { getLocaleName } from "@/utils/helpers/string";
import { useLocale } from "@/utils/hooks/i18n";
import { Header } from "@suankularb-components/react";
import { useTranslation } from "next-i18next";
import { ComponentProps, FC } from "react";

const PersonHeader: FC<ComponentProps<typeof PersonActions>> = ({
  person,
  suggestionsType,
}) => {
  // Translation
  const locale = useLocale();
  const { t } = useTranslation("lookup", { keyPrefix: "people.header" });

  return (
    <div className="flex flex-col gap-6 bg-surface-2 px-5 py-4 md:flex-row">
      <DynamicAvatar
        className={cn(
          "!h-14 !w-14",
          person?.role === "teacher" &&
            "!bg-secondary-container !text-on-secondary-container",
        )}
      />
      <div className="flex flex-col gap-4 md:gap-2">
        <Header hAttr={{ id: "header-person-details" }}>
          {person
            ? getLocaleName(locale, person, {
                prefix: person.role === "teacher" ? "teacher" : false,
              })
            : t("loading")}
        </Header>
        <PersonActions {...{ person, suggestionsType }} />
      </div>
    </div>
  );
};

export default PersonHeader;
