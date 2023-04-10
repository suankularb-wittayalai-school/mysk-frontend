// External libraries
import { FC } from "react";

// SK Components
import { Columns, ContentLayout, Section } from "@suankularb-components/react";

// Internal components
import DetailSection from "@/components/lookup/person/DetailSection";
import MultilangText from "@/components/common/MultilingualText";
import { Student, Teacher } from "@/utils/types/person";
import { nameJoiner } from "@/utils/helpers/name";
import { useLocale } from "@/utils/hooks/i18n";
import { useTranslation } from "next-i18next";

const PersonDetailsContent: FC<{
  person: Student | Teacher;
}> = ({ person }) => {
  const locale = useLocale();
  const { t } = useTranslation(["lookup", "common"]);

  return (
    <ContentLayout>
      <Section>
        <Columns columns={4}>
          <DetailSection
            id="full-name"
            title="Full name"
            className="md:col-span-2"
          >
            <MultilangText
              text={{
                th: nameJoiner("th", person.name),
                "en-US": person.name["en-US"]?.firstName
                  ? nameJoiner("en-US", person.name)
                  : undefined,
              }}
            />
          </DetailSection>
          {person.role === "student" && (
            <DetailSection id="class" title="Class">
              <span className="block">
                {t("class", { ns: "common", number: person.class.number })}
              </span>
              <span className="block">{person.classNo}</span>
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
          <DetailSection id="birthdate" title="Birthdate">
            <time>
              {new Date(person.birthdate).toLocaleDateString(locale, {
                day: "numeric",
                month: "long",
                year: undefined,
              })}
            </time>
          </DetailSection>
        </Columns>
      </Section>
    </ContentLayout>
  );
};

export default PersonDetailsContent;
