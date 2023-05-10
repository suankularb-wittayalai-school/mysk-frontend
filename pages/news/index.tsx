// External libraries
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import Head from "next/head";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { FC, useState } from "react";

// SK Components
import {
  ContentLayout,
  ChipSet,
  FilterChip,
  MaterialIcon,
} from "@suankularb-components/react";

// Internal components
import MySKPageHeader from "@/components/common/MySKPageHeader";
import NewsFeed from "@/components/news/NewsFeed";
import NewsIcon from "@/components/news/NewsIcon";

// Backend
import { getUserMetadata } from "@/utils/backend/account";
import { getNewsFeed } from "@/utils/backend/news";

// Helpers
import { toggleItem } from "@/utils/helpers/array";
import { createTitleStr } from "@/utils/helpers/title";

// Types
import { CustomPage, LangCode } from "@/utils/types/common";
import { NewsItemType, NewsListNoDate } from "@/utils/types/news";
import { Role } from "@/utils/types/person";

// Context
type NewsFilterValue = {
  types: NewsItemType[];
  done: boolean | null;
};

// Components
const NewsFilterChipSet: FC<{
  newsFilter: NewsFilterValue;
  setNewsFilter: (value: NewsFilterValue) => void;
}> = ({ newsFilter, setNewsFilter }) => {
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
const NewsPage: CustomPage<{ newsFeed: NewsListNoDate; userRole: Role }> = ({
  newsFeed,
  userRole,
}) => {
  const { t } = useTranslation(["news", "common"]);

  const [newsFilter, setNewsFilter] = useState<{
    types: NewsItemType[];
    done: boolean | null;
  }>({ types: [], done: null });

  return (
    <>
      <Head>
        <title>{createTitleStr(t("title"), t)}</title>
      </Head>
      <MySKPageHeader
        title={t("title")}
        icon={<MaterialIcon icon="newspaper" />}
      >
        {userRole !== "teacher" && (
          <NewsFilterChipSet
            newsFilter={newsFilter}
            setNewsFilter={setNewsFilter}
          />
        )}
      </MySKPageHeader>
      <ContentLayout>
        <NewsFeed
          news={newsFeed
            .filter((newsItem) =>
              newsFilter.types.length
                ? newsFilter.types.includes(newsItem.type)
                : newsFeed
            )
            .filter((newsItem) =>
              newsFilter.done !== null
                ? newsFilter.done === newsItem.done
                : newsFeed
            )}
        />
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

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: metadata } = await getUserMetadata(supabase, user!.id);
  const { data: newsFeed } = await getNewsFeed(metadata!.role);

  const userRole = metadata!.role;

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, ["common", "news"])),
      newsFeed,
      userRole,
    },
  };
};

export default NewsPage;
