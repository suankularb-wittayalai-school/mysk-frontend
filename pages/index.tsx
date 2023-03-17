// External libraries
import Head from "next/head";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// SK Components
import { ContentLayout, Header, Section } from "@suankularb-components/react";

// Types
import { CustomPage, LangCode } from "@/utils/types/common";

// Page
const IndexPage: CustomPage = () => {
  const { t } = useTranslation(["landing", "common"]);

  return (
    <>
      <Head>
        <title>{t("brand.name", { ns: "common" })}</title>
      </Head>
      <ContentLayout>
        <Section>
          <Header>TODO</Header>
          <p className="skc-body-medium">TODO</p>
        </Section>
      </ContentLayout>
    </>
  );
};

export const getStaticProps = async ({ locale }: { locale: LangCode }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "landing"])),
  },
});

export default IndexPage;
