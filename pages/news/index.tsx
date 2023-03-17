// // External libraries
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import Head from "next/head";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { useState } from "react";

import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

// SK Components
import { MaterialIcon, ContentLayout } from "@suankularb-components/react";

// Components
import NewsFeed from "@/components/news/NewsFeed";

// Backend
import { getNewsFeed } from "@/utils/backend/news";

// Helpers
import { createTitleStr } from "@/utils/helpers/title";

// Types
import { CustomPage, LangCode } from "@/utils/types/common";
import { NewsItemType, NewsListNoDate } from "@/utils/types/news";

// Page
const NewsPage: CustomPage<{
  newsFeed: NewsListNoDate;
}> = ({ newsFeed }) => {
  const { t } = useTranslation(["news", "common"]);

  const [newsFilter, setNewsFilter] = useState<NewsItemType[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsListNoDate>(newsFeed);

  return (
    <>
      <Head>
        <title>{createTitleStr(t("title.title"), t)}</title>
      </Head>
      <ContentLayout>
        {/* TODO: Make filtering News a reality! */}
        {/* <NewsFilter setNewsFilter={setNewsFilter} /> */}
        <NewsFeed news={filteredNews} />
      </ContentLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  req,
  res,
}) => {
  const supabase = createServerSupabaseClient({
    req: req as NextApiRequest,
    res: res as NextApiResponse,
  });

  const { data: user } = await supabase.auth.getUser();
  const role = user.user?.user_metadata.role;

  const { data: newsFeed } = await getNewsFeed(role);

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, ["common", "news"])),
      newsFeed,
    },
  };
};

NewsPage.pageHeader = {
  title: { key: "title", ns: "news" },
  icon: <MaterialIcon icon="newspaper" />,
  parentURL: "/account/logout",
};

NewsPage.pageRole = "student";

export default NewsPage;
