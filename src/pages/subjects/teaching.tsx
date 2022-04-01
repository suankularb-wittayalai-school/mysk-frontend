// Modules
import { GetStaticProps, NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// SK Components
import {
  MaterialIcon,
  RegularLayout,
  Section,
  Title,
} from "@suankularb-components/react";

const SubjectsTeaching: NextPage = () => {
  const { t } = useTranslation("subjects");

  return (
    <RegularLayout
      Title={
        <Title
          name={{ title: t("teaching.title") }}
          pageIcon={<MaterialIcon icon="school" />}
          backGoesTo="/home"
        />
      }
    >
      <Section>TODO</Section>
    </RegularLayout>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as string, ["common", "subjects"])),
  },
});

export default SubjectsTeaching;
