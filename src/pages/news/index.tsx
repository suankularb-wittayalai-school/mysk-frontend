// // Modules
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { useEffect, useState } from "react";

import { useQuery } from "react-query";

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

// Types
import { LangCode } from "@utils/types/common";
import { NewsItemType, NewsList } from "@utils/types/news";

// Helpers
import { createTitleStr } from "@utils/helpers/title";
import { replaceNumberInNewsWithDate } from "@utils/helpers/news";

// Page
const NewsPage: NextPage = (): JSX.Element => {
  const { t } = useTranslation(["news", "common"]);

  const { data } = useQuery("feed", () => getNewsFeed("student"));

  const [newsFilter, setNewsFilter] = useState<NewsItemType[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsList>([]);

  useEffect(() => {
    if (data)
      setFilteredNews(
        data
          .map((newsItem) => replaceNumberInNewsWithDate(newsItem))
          .filter((newsItem) => newsItem) as NewsList
      );
  }, [data]);

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

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, ["common", "news"])),
    },
  };
};

export default NewsPage;
