// // Modules
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { useEffect, useState } from "react";

import Masonry from "react-masonry-css";

// SK Components
import {
  ChipFilterList,
  MaterialIcon,
  RegularLayout,
  Section,
  Title,
} from "@suankularb-components/react";

// Components
import NewsCard from "@components/news/NewsCard";

// Types
import { NewsItemType, NewsList, NewsListNoDate } from "@utils/types/news";

// // Helpers
import { createTitleStr } from "@utils/helpers/title";
import NewsFeed from "@components/news/NewsFeed";
import { replaceNumberInNewsWithDate } from "@utils/helpers/news";
import { getLandingFeed } from "@utils/backend/news/info";

const NewsFilter = ({
  setNewsFilter,
}: {
  setNewsFilter: (newFilter: Array<NewsItemType>) => void;
}): JSX.Element => {
  const { t } = useTranslation("news");
  return (
    <ChipFilterList
      choices={[
        { id: "info", name: t("filter.info") },
        { id: "form", name: t("filter.forms") },
        { id: "payment", name: t("filter.payments") },
        [
          { id: "not-done", name: t("filter.amountDone.notDone") },
          { id: "done", name: t("filter.amountDone.done") },
        ],
      ]}
      onChange={(newFilter: Array<NewsItemType>) => setNewsFilter(newFilter)}
      scrollable={true}
    />
  );
};

// Page
const NewsPage: NextPage<{ news: NewsListNoDate }> = ({
  news,
}): JSX.Element => {
  const { t } = useTranslation(["news", "common"]);
  const [newsFilter, setNewsFilter] = useState<Array<NewsItemType>>([]);
  const [filteredNews, setFilteredNews] = useState<NewsList>(
    news
      .map((newsItem) => replaceNumberInNewsWithDate(newsItem))
      .filter((newsItem) => newsItem) as NewsList
  );

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
            key="title"
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
      ...(await serverSideTranslations(locale as string, ["common", "news"])),
      news: (await getLandingFeed()).content,  // Temporary
    },
  };
};

export default NewsPage;
