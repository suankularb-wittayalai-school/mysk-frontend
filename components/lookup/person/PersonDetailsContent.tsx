// External libraries
import { useTranslation } from "next-i18next";
import { FC } from "react";

// SK Components
import {
  Columns,
  ContentLayout,
  Header,
  Section,
} from "@suankularb-components/react";

// Internal components
import ContactCard from "@/components/account/ContactCard";
import MultilangText from "@/components/common/MultilingualText";
import DetailSection from "@/components/lookup/person/DetailSection";

// Types
import { Student, Teacher } from "@/utils/types/person";

// Helpers
import { nameJoiner } from "@/utils/helpers/name";

// Hooks
import { useLocale } from "@/utils/hooks/i18n";

const GeneralInfoSection: FC<{
  person: Student | Teacher;
}> = ({ person }) => {
  const locale = useLocale();
  const { t } = useTranslation(["lookup", "common"]);

  return (
    <Section className="!grid grid-cols-2 !gap-x-6 md:grid-cols-4">
      {/* Full name */}
      <DetailSection
        id="full-name"
        title={t("people.detail.general.fullName")}
        className="col-span-2 sm:col-span-1 md:col-span-2"
      >
        <MultilangText
          text={{
            th: nameJoiner("th", person.name, person.prefix, { prefix: true }),
            "en-US": person.name["en-US"]
              ? nameJoiner("en-US", person.name, person.prefix, {
                  prefix: true,
                })
              : undefined,
          }}
        />
      </DetailSection>

      {/* Class */}
      {person.role === "student" && (
        <DetailSection
          id="class"
          title={t("people.detail.general.class.title")}
        >
          <span className="block">
            {t("class", { ns: "common", number: person.class.number })}
          </span>
          <span className="block">
            {t("people.detail.general.class.classNo", {
              classNo: person.classNo,
            })}
          </span>
        </DetailSection>
      )}
      {person.role === "teacher" && person.classAdvisorAt && (
        <DetailSection id="class-advisor-at" title="Class advisor at">
          <span>
            {t("class", {
              ns: "common",
              number: person.classAdvisorAt.number,
            })}
          </span>
        </DetailSection>
      )}

      {/* Birthdate */}
      <DetailSection
        id="birthdate"
        title={t("people.detail.general.birthdate")}
      >
        <time>
          {new Date(person.birthdate).toLocaleDateString(locale, {
            day: "numeric",
            month: "long",
            year: undefined,
          })}
        </time>
      </DetailSection>
    </Section>
  );
};

const PersonDetailsContent: FC<{
  person: Student | Teacher;
}> = ({ person }) => {
  const { t } = useTranslation("lookup", { keyPrefix: "people.detail" });

  return (
    <ContentLayout>
      <GeneralInfoSection {...{ person }} />
      {person.contacts.length > 0 && (
        <Section>
          <Header level={3}>{t("contacts.title")}</Header>
          <Columns columns={2}>
            {person.contacts.map((contact) => (
              <ContactCard key={contact.id} contact={contact} />
            ))}
          </Columns>
        </Section>
      )}
    </ContentLayout>
  );
};

export default PersonDetailsContent;
