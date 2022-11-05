// // External libraries
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { useState } from "react";

import { withPageAuth } from "@supabase/auth-helpers-nextjs";

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

// Types
import { LangCode } from "@utils/types/common";
import { NewsItemType, NewsListNoDate } from "@utils/types/news";
import { Role } from "@utils/types/person";

// Page
const NewsPage: NextPage<{ role: Role; newsFeed: NewsListNoDate }> = ({
  role,
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
            backGoesTo={role == "teacher" ? "/teach" : "/learn"}
            LinkElement={Link}
          />
        }
      >
        <Section>
          {/* TODO: Make filtering News a reality! */}
          {/* <NewsFilter setNewsFilter={setNewsFilter} /> */}
          <NewsFeed news={filteredNews} />
        </Section>
      </RegularLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = withPageAuth({
  async getServerSideProps({ locale }, supabase) {
    const { data: user } = await supabase.auth.getUser();
    const role = user.user?.user_metadata.role;

    const { data: newsFeed } = await getNewsFeed(role);

    return {
      props: {
        ...(await serverSideTranslations(locale as LangCode, [
          "common",
          "news",
        ])),
        role,
        newsFeed,
      },
    };
  },
});

export default NewsPage;
