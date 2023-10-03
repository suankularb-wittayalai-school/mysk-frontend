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
// import { getInfo, getAllInfoIDs } from "@/utils/backend/news/info";

// Types
import { CustomPage, LangCode } from "@/utils/types/common";
import { Info } from "@/utils/types/news";

// Helpers
import { createTitleStr } from "@/utils/helpers/title";
import mergeDBLocales from "@/utils/helpers/mergeDBLocales";
import getLocaleString from "@/utils/helpers/getLocaleString";

// Hooks
import useLocale from "@/utils/helpers/useLocale";
import { supabase } from "@/utils/supabase-backend";

const InfoPage: CustomPage<{ infoPage: Info }> = ({ infoPage }) => {
  // Translation
  const locale = useLocale();
  const { t } = useTranslation("common");

  return (
    <>
      <Head>
        <title>
          {createTitleStr(getLocaleString(infoPage.title, locale), t)}
        </title>
      </Head>
      <NewsMeta newsItem={infoPage} />
      <NewsPageHeader newsItem={infoPage} />
      <ContentLayout>
        <Columns columns={6}>
          <div
            className="skc-body-large col-span-2 -my-5 mx-4 sm:col-span-4
              sm:mx-0 md:col-start-2"
          >
            <Markdown>{getLocaleString(infoPage.body, locale)}</Markdown>
          </div>
        </Columns>
      </ContentLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
  const { data: newsItem, error } = await supabase
    .from("infos")
    .select("*, news(*)")
    .eq("id", params!.infoID)
    .single();
  if (error) return { notFound: true };

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, ["common", "news"])),
      infoPage: {
        id: newsItem.id,
        title: mergeDBLocales(newsItem.news, "title"),
        description: mergeDBLocales(newsItem.news, "description"),
        image: newsItem.news!.image,
        created_at: newsItem.news!.created_at,
        old_url: newsItem.news!.old_url,
        body: mergeDBLocales(newsItem, "body"),
      },
    },
    revalidate: 300,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await supabase.from("infos").select("id");

  return {
    paths: data!.map((number) => ({
      params: { infoID: number.id.toString() },
    })),
    fallback: "blocking",
  };
};

InfoPage.navType = "student";

export default InfoPage;
