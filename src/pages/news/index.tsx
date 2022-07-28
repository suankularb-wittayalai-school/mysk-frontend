// // Modules
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { useState } from "react";

// SK Components
import {
  MaterialIcon,
  RegularLayout,
  Section,
  Title,
} from "@suankularb-components/react";

// Components
import NewsFeed from "@components/news/NewsFeed";
import NewsFilter from "@components/news/NewsFilter";

// Backend
import { getNewsFeed } from "@utils/backend/news";

// Helpers
import { createTitleStr } from "@utils/helpers/title";

// Supabase
import { supabase } from "@utils/supabaseClient";

// Types
import { LangCode } from "@utils/types/common";
import { NewsItemType, NewsListNoDate } from "@utils/types/news";

// Page
const NewsPage: NextPage<{ newsFeed: NewsListNoDate }> = ({
  newsFeed,
}): JSX.Element => {
  const { t } = useTranslation(["news", "common"]);

  const [newsFilter, setNewsFilter] = useState<NewsItemType[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsListNoDate>(newsFeed);

  return (
    <>
      <Head>
        <title>{createTitleStr(t("title.title"), t)}</title>
      </Head>
      <RegularLayout
        Title={
          <Title
            name={{
              title: t("title.title"),
              subtitle: t("title.subtitle"),
            }}
            pageIcon={<MaterialIcon icon="newspaper" />}
            backGoesTo="/s/home"
            LinkElement={Link}
          />
        }
      >
        <Section>
          <NewsFilter setNewsFilter={setNewsFilter} />
          <NewsFeed news={filteredNews} />
        </Section>
      </RegularLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  req,
}) => {
  const userRole =
    (await supabase.auth.api.getUserByCookie(req)).user?.user_metadata.role ||
    "public";
  const { data: newsFeed } = await getNewsFeed(userRole);

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, ["common", "news"])),
      newsFeed,
    },
  };
};

export default NewsPage;
