// Imports
import MySKPageHeader from "@/components/common/MySKPageHeader";
import NewsFeed from "@/components/news/NewsFeed";
import { mergeDBLocales } from "@/utils/helpers/string";
import { createTitleStr } from "@/utils/helpers/title";
import { DatabaseClient } from "@/utils/types/backend";
import { CustomPage, LangCode } from "@/utils/types/common";
import { Info } from "@/utils/types/news";
import { ContentLayout, MaterialIcon } from "@suankularb-components/react";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";

const NewsPage: CustomPage<{ newsFeed: Info[] }> = ({ newsFeed }) => {
  const { t } = useTranslation(["news", "common"]);

  return (
    <>
      <Head>
        <title>{createTitleStr(t("title"), t)}</title>
      </Head>
      <MySKPageHeader
        title={t("title")}
        icon={<MaterialIcon icon="newspaper" />}
      ></MySKPageHeader>
      <ContentLayout>
        <NewsFeed news={newsFeed} />
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
