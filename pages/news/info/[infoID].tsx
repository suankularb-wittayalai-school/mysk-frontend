// External libraries
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// SK Components
import { Columns, ContentLayout } from "@suankularb-components/react";

// Internal components
import Markdown from "@/components/formatting/Markdown";
import NewsMeta from "@/components/news/NewsMeta";
import NewsPageHeader from "@/components/news/NewsPageHeader";

// Backend
import { getInfo, getAllInfoIDs } from "@/utils/backend/news/info";

// Types
import { CustomPage, LangCode } from "@/utils/types/common";
import { InfoPage as InfoPageType } from "@/utils/types/news";

// Helpers
import { createTitleStr } from "@/utils/helpers/title";
import { getLocaleString } from "@/utils/helpers/i18n";

// Hooks
import { useLocale } from "@/utils/hooks/i18n";

const InfoPage: CustomPage<{ infoPage: InfoPageType }> = ({ infoPage }) => {
  // Translation
  const locale = useLocale();
  const { t } = useTranslation("common");

  return (
    <>
      <Head>
        <title>
          {createTitleStr(getLocaleString(infoPage.content.title, locale), t)}
        </title>
      </Head>
      <NewsMeta newsItem={infoPage} />
      <NewsPageHeader newsItem={infoPage} />
      <ContentLayout>
        <Columns columns={6}>
          <div
            className="skc-body-large col-span-2 mx-4 -my-5 sm:col-span-4
              sm:mx-0 md:col-start-2"
          >
            <Markdown>
              {getLocaleString(infoPage.content.body, locale)}
            </Markdown>
          </div>
        </Columns>
      </ContentLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
  const { data: infoPage, error } = await getInfo(Number(params?.infoID));
  if (error) return { notFound: true };

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, ["common", "news"])),
      infoPage,
    },
    revalidate: 300,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: (await getAllInfoIDs()).map((number) => ({
      params: { infoID: number.toString() },
    })),
    fallback: "blocking",
  };
};

InfoPage.navType = "student";

export default InfoPage;
