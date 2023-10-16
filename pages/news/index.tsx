// Imports
import PageHeader from "@/components/common/PageHeader";
import NewsArticleItem from "@/components/news/NewsArticleItem";
import LatestArticlesSection from "@/components/news/LatestArticlesSection";
import mergeDBLocales from "@/utils/helpers/mergeDBLocales";
import { DatabaseClient } from "@/utils/types/backend";
import { CustomPage, LangCode } from "@/utils/types/common";
import { NewsArticle } from "@/utils/types/news";
import { Columns, ContentLayout } from "@suankularb-components/react";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";

/**
 * A feed of News Articles, with the 2 most recent Articles highlighted.
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

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  req,
  res,
}) => {
  const supabase = createPagesServerClient({
    req: req as NextApiRequest,
    res: res as NextApiResponse,
  }) as DatabaseClient;

  const { data } = await supabase.from("infos").select("*, news(*)");

  const newsFeed = data
    ?.map((newsItem) => ({
      id: newsItem.id,
      title: mergeDBLocales(newsItem.news, "title"),
      description: mergeDBLocales(newsItem.news, "description"),
      image: newsItem.news!.image,
      created_at: newsItem.news!.created_at,
      old_url: newsItem.news!.old_url,
      body: mergeDBLocales(newsItem, "body"),
    }))
    .sort((a, b) => {
      if (a.created_at > b.created_at) return -1;
      if (a.created_at < b.created_at) return 1;
      return 0;
    });

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, ["common", "news"])),
      newsFeed,
    },
  };
};

export default NewsPage;
