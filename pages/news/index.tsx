// // External libraries
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import Head from "next/head";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

// SK Components
import {
  ContentLayout,
  ChipSet,
  FilterChip,
} from "@suankularb-components/react";

// News components
import NewsFeed from "@/components/news/NewsFeed";
import NewsIcon from "@/components/news/NewsIcon";

// Backend
import { getNewsFeed } from "@/utils/backend/news";

// Helpers
import { toggleItem } from "@/utils/helpers/array";
import { createTitleStr } from "@/utils/helpers/title";

// Types
import { CustomPage, LangCode } from "@/utils/types/common";
import { NewsItemType, NewsListNoDate } from "@/utils/types/news";

// Context
type NewsFilterValue = {
  types: NewsItemType[];
  done: boolean | null;
};

const NewsFilterContext = createContext<{
  newsFilter: NewsFilterValue;
  setNewsFilter: (value: NewsFilterValue) => void;
}>({ newsFilter: { types: [], done: null }, setNewsFilter: () => {} });

const NewsFilterState: FC<{ children: ReactNode }> = ({ children }) => {
  const [newsFilter, setNewsFilter] = useState<{
    types: NewsItemType[];
    done: boolean | null;
  }>({ types: [], done: null });

  return (
    <NewsFilterContext.Provider value={{ newsFilter, setNewsFilter }}>
      {children}
    </NewsFilterContext.Provider>
  );
};

// Components
const NewsFilterChipSet: FC = () => {
  // State
  const { newsFilter, setNewsFilter } = useContext(NewsFilterContext);

  // Translation
  const { t } = useTranslation("news");

  return (
    <ChipSet>
      {/* Types */}

      {/* Info */}
      <FilterChip
        icon={<NewsIcon type="info" />}
        selected={newsFilter.types.includes("info")}
        onClick={() =>
          setNewsFilter({
            ...newsFilter,
            types: toggleItem("info", newsFilter.types),
          })
        }
      >
        {t("filter.info")}
      </FilterChip>

      {/* Forms */}
      <FilterChip
        icon={<NewsIcon type="form" />}
        selected={newsFilter.types.includes("form")}
        onClick={() =>
          setNewsFilter({
            ...newsFilter,
            types: toggleItem("form", newsFilter.types),
          })
        }
      >
        {t("filter.form")}
      </FilterChip>

      {/* Payment */}
      <FilterChip
        icon={<NewsIcon type="payment" />}
        selected={newsFilter.types.includes("payment")}
        onClick={() =>
          setNewsFilter({
            ...newsFilter,
            types: toggleItem("payment", newsFilter.types),
          })
        }
      >
        {t("filter.payment")}
      </FilterChip>

      {/* Amount done */}
      <FilterChip
        selected={newsFilter.done === false}
        onClick={() =>
          setNewsFilter({
            ...newsFilter,
            done: newsFilter.done === false ? null : false,
          })
        }
      >
        {t("filter.amountDone.done")}
      </FilterChip>
      <FilterChip
        selected={newsFilter.done === true}
        onClick={() =>
          setNewsFilter({
            ...newsFilter,
            done: newsFilter.done === true ? null : true,
          })
        }
      >
        {t("filter.amountDone.notDone")}
      </FilterChip>
    </ChipSet>
  );
};

// Page
const NewsPage: CustomPage<{
  newsFeed: NewsListNoDate;
}> = ({ newsFeed }) => {
  const { t } = useTranslation(["news", "common"]);

  const { newsFilter, setNewsFilter } = useContext(NewsFilterContext);
  const [filteredNews, setFilteredNews] = useState<NewsListNoDate>(newsFeed);

  useEffect(() => {
    setFilteredNews(
      newsFeed
        .filter((newsItem) =>
          newsFilter.types.length
            ? newsFilter.types.includes(newsItem.type)
            : newsFeed
        )
        .filter((newsItem) =>
          newsFilter.done !== null
            ? newsFilter.done === newsItem.done
            : newsFeed
        )
    );
  }, [newsFilter]);

  return (
    <>
      <Head>
        <title>{createTitleStr(t("title"), t)}</title>
      </Head>
      <ContentLayout>
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

NewsPage.context = NewsFilterState;

NewsPage.pageHeader = {
  title: { key: "title", ns: "news" },
  children: <NewsFilterChipSet />,
};

NewsPage.pageRole = "student";

export default NewsPage;
