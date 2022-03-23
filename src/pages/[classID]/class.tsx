// Modules
import { NextPage } from "next";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// SK Components
import {
  Header,
  MaterialIcon,
  RegularLayout,
  Section,
  Title,
} from "@suankularb-components/react";

// Page
const Class: NextPage = () => {
  const { t } = useTranslation("class");

  return (
    <RegularLayout
      Title={
        <Title
          name={{ title: t("title") }}
          pageIcon={<MaterialIcon icon="groups" />}
          backGoesTo="/"
          LinkElement={Link}
        />
      }
    >
      <Section labelledBy="class-counselors">
        <Header
          icon={<MaterialIcon icon="group" />}
          text={t("classCounselors.title")}
        />
      </Section>
      <Section labelledBy="class-contacts">
        <Header
          icon={<MaterialIcon icon="group" />}
          text={t("classContacts.title")}
        />
      </Section>
      <Section labelledBy="student-list">
        <div className="layout-grid-cols-3--header">
          <Header
            icon={<MaterialIcon icon="group" />}
            text={t("studentList.title")}
          />
        </div>
      </Section>
    </RegularLayout>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "class"])),
  },
});

export default Class;
