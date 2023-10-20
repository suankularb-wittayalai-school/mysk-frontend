// Imports
import PageHeader from "@/components/common/PageHeader";
import LookupChoice from "@/components/lookup/landing/LookupChoice";
import LookupLandingSubtitle from "@/components/lookup/landing/LookupLandingSubtitle";
import { CustomPage, LangCode } from "@/utils/types/common";
import {
  Columns,
  ContentLayout,
  MaterialIcon,
  Text,
} from "@suankularb-components/react";
import { GetStaticProps } from "next";
import { Trans, useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";

const LookupPage: CustomPage = () => {
  const { t } = useTranslation("lookup");
  const { t: tx } = useTranslation("common");

  return (
    <>
      <Head>
        <title>{tx("tabName", { tabName: t("title") })}</title>
      </Head>
      <PageHeader>
        <span className="md:hidden">{t("title")}</span>
        <Text type="display-medium" className="hidden md:block">
          {t("title")}
        </Text>
        <LookupLandingSubtitle className="hidden md:block" />
      </PageHeader>
      <ContentLayout>
        <LookupLandingSubtitle className="mx-4 sm:mx-0 sm:-mt-8 md:hidden" />
        <Columns columns={2} className="mx-4 !gap-y-3 sm:mx-0">
          {/* <LookupChoice
            icon={<MaterialIcon icon="face_6" size={48} />}
            title={<Trans i18nKey="choice.students.title" ns="lookup" />}
            desc={t("choice.students.desc")}
            href="/lookup/students"
          /> */}
          <LookupChoice
            icon={<MaterialIcon icon="support_agent" size={48} />}
            title={<Trans i18nKey="choice.teachers.title" ns="lookup" />}
            desc={t("choice.teachers.desc")}
            href="/lookup/teachers"
          />
          <LookupChoice
            icon={<MaterialIcon icon="document_scanner" size={48} />}
            title={<Trans i18nKey="choice.documents.title" ns="lookup" />}
            desc={t("choice.documents.desc")}
            href="/lookup/documents"
          />
        </Columns>
      </ContentLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: await serverSideTranslations(locale as LangCode, ["common", "lookup"]),
});

export default LookupPage;
