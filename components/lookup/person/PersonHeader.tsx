// External libraries
import { FC } from "react";
import { useTranslation } from "next-i18next";

// SK Components
import { Header } from "@suankularb-components/react";

// Internal components
import DynamicAvatar from "@/components/common/DynamicAvatar";
import PersonActions from "@/components/lookup/person/PersonActions";

// Helpers
import { cn } from "@/utils/helpers/className";
import { nameJoiner } from "@/utils/helpers/name";

// Hooks
import { useLocale } from "@/utils/hooks/i18n";

// Types
import { Student, Teacher } from "@/utils/types/person";

const PersonHeader: FC<{ person?: Student | Teacher }> = ({ person }) => {
  // Translation
  const locale = useLocale();
  const { t } = useTranslation("people.header");

  return (
    <>
      <div
        className="sticky z-[70] flex flex-col gap-6 bg-surface-2
          px-5 py-4 md:flex-row"
      >
        <DynamicAvatar
          className={cn([
            "!h-14 !w-14",
            person?.role === "teacher" &&
              "!bg-secondary-container !text-on-secondary-container",
          ])}
        />
        <div className="flex flex-col gap-4 md:gap-2">
          <Header hAttr={{ id: "header-person-details" }} className="break-all">
            {person ? nameJoiner(locale, person.name) : t("loading")}
          </Header>
          <PersonActions {...{ person }} />
        </div>
      </div>
    </>
  );
};

export default PersonHeader;
