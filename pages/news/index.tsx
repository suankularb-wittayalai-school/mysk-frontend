// Imports
import PageHeader from "@/components/common/PageHeader";
import LatestArticlesSection from "@/components/news/LatestArticlesSection";
import NewsArticleItem from "@/components/news/NewsArticleItem";
import getNewsFeed from "@/utils/backend/news/getNewsFeed";
import { supabase } from "@/utils/supabase-backend";
import { CustomPage, LangCode } from "@/utils/types/common";
import { NewsArticle } from "@/utils/types/news";
import { Columns, ContentLayout } from "@suankularb-components/react";
import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";

/**
 * A feed of News Articles, with the 2 most recent Articles highlighted.
 * 
 * @param newsFeed The News Articles to display.
 */
const NewsPage: CustomPage<{ newsFeed: NewsArticle[] }> = ({ newsFeed }) => {
  const { t } = useTranslation("news");
  const { t: tx } = useTranslation("common");

  return (
    <>
      <Head>
        <title>{tx("tabName", { tabName: t("title") })}</title>
      </Head>
      <PageHeader>{t("title")}</PageHeader>
      <ContentLayout>
        <Columns columns={4} className="!gap-y-5">
          <LatestArticlesSection
            mainArticle={newsFeed[0]}
            asideArticle={newsFeed[1]}
          />
          {newsFeed.slice(2).map((article) => (
            <NewsArticleItem
              key={article.id}
              article={article}
              className="sm:col-span-2"
            />
          ))}
        </Columns>
      </ContentLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const { data: newsFeed } = await getNewsFeed(supabase);
  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, ["common", "news"])),
      newsFeed,
    },
    revalidate: 300,
  };
};

export default NewsPage;
