// Imports
import PageHeader from "@/components/common/PageHeader";
import cn from "@/utils/helpers/cn";
import useLocale from "@/utils/helpers/useLocale";
import { CustomPage, LangCode } from "@/utils/types/common";
import { ContentLayout, Text } from "@suankularb-components/react";
import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";

const LookupPage: CustomPage = () => {
  const locale = useLocale();
  const { t } = useTranslation("lookup");
  const { t: tx } = useTranslation("common");

  return (
    <>
      <Head>
        <title>{tx("tabName", { tabName: t("title") })}</title>
      </Head>
      <PageHeader>
        <Text type="display-medium" className="block">
          Lookup
        </Text>
        <Text type="headline-large" className="block">
          <strong
            className={cn(`bg-gradient-to-r from-primary to-secondary
              bg-clip-text !font-bold [-webkit-text-fill-color:transparent]`)}
          >
            Find everything
          </strong>{" "}
          in MySK Lookup
        </Text>
      </PageHeader>
      <ContentLayout>
        <Text type="body-medium">TODO</Text>
      </ContentLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: await serverSideTranslations(locale as LangCode, ["common", "lookup"]),
});

export default LookupPage;
