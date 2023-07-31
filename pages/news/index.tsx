// External libraries
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

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
// import { getNewsFeed } from "@/utils/backend/news";

// Helpers
import { toggleItem } from "@/utils/helpers/array";
import { createTitleStr } from "@/utils/helpers/title";

// Types
import { CustomPage, LangCode } from "@/utils/types/common";
import { Info } from "@/utils/types/news";
import { UserRole } from "@/utils/types/person";
import getLoggedInPerson from "@/utils/backend/account/getLoggedInPerson";
import { authOptions } from "../api/auth/[...nextauth]";
import { DatabaseClient } from "@/utils/types/backend";
import { mergeDBLocales } from "@/utils/helpers/string";

// Context
// type NewsFilterValue = {
//   types: NewsItemType[];
//   done: boolean | null;
// };

// Components
// const NewsFilterChipSet: FC<{
//   newsFilter: NewsFilterValue;
//   setNewsFilter: (value: NewsFilterValue) => void;
// }> = ({ newsFilter, setNewsFilter }) => {
//   // Translation
//   const { t } = useTranslation("news");

//   return (
//     <ChipSet>
//       {/* Types */}

//       {/* Info */}
//       <FilterChip
//         icon={<NewsIcon type="info" />}
//         selected={newsFilter.types.includes("info")}
//         onClick={() =>
//           setNewsFilter({
//             ...newsFilter,
//             types: toggleItem("info", newsFilter.types),
//           })
//         }
//       >
//         {t("filter.info")}
//       </FilterChip>

//       {/* Forms */}
//       <FilterChip
//         icon={<NewsIcon type="form" />}
//         selected={newsFilter.types.includes("form")}
//         onClick={() =>
//           setNewsFilter({
//             ...newsFilter,
//             types: toggleItem("form", newsFilter.types),
//           })
//         }
//       >
//         {t("filter.form")}
//       </FilterChip>

//       {/* Payment */}
//       <FilterChip
//         icon={<NewsIcon type="payment" />}
//         selected={newsFilter.types.includes("payment")}
//         onClick={() =>
//           setNewsFilter({
//             ...newsFilter,
//             types: toggleItem("payment", newsFilter.types),
//           })
//         }
//       >
//         {t("filter.payment")}
//       </FilterChip>

//       {/* Amount done */}
//       <FilterChip
//         selected={newsFilter.done === false}
//         onClick={() =>
//           setNewsFilter({
//             ...newsFilter,
//             done: newsFilter.done === false ? null : false,
//           })
//         }
//       >
//         {t("filter.amountDone.done")}
//       </FilterChip>
//       <FilterChip
//         selected={newsFilter.done === true}
//         onClick={() =>
//           setNewsFilter({
//             ...newsFilter,
//             done: newsFilter.done === true ? null : true,
//           })
//         }
//       >
//         {t("filter.amountDone.notDone")}
//       </FilterChip>
//     </ChipSet>
//   );
// };

// Page
const NewsPage: CustomPage<{ newsFeed: Info[]; userRole: UserRole }> = ({
  newsFeed,
  userRole,
}) => {
  const { t } = useTranslation(["news", "common"]);

  // const [newsFilter, setNewsFilter] = useState<{
  //   types: NewsItemType[];
  //   done: boolean | null;
  // }>({ types: [], done: null });

  return (
    <>
      <Head>
        <title>{createTitleStr(t("title"), t)}</title>
      </Head>
      <MySKPageHeader
        title={t("title")}
        icon={<MaterialIcon icon="newspaper" />}
      >
        {/* {userRole !== "teacher" && (
          <NewsFilterChipSet
            newsFilter={newsFilter}
            setNewsFilter={setNewsFilter}
          />
        )} */}
      </MySKPageHeader>
      <ContentLayout>
        <NewsFeed
          news={
            newsFeed
            // .filter((newsItem) =>
            //   newsFilter.types.length
            //     ? newsFilter.types.includes(newsItem.type)
            //     : newsFeed,
            // )
            // .filter((newsItem) =>
            //   newsFilter.done !== null
            //     ? newsFilter.done === newsItem.done
            //     : newsFeed,
            // )
          }
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
  const supabase = createPagesServerClient({
    req: req as NextApiRequest,
    res: res as NextApiResponse,
  }) as DatabaseClient;

  const { data: user } = await getLoggedInPerson(
    supabase,
    authOptions,
    req,
    res,
  );

  const userRole = user?.role;

  let newsFeed: Info[] = [];

  const { data: fetchedNewsFeed } = await supabase
    .from("infos")
    .select("*, news(*)");

  if (fetchedNewsFeed) {
    newsFeed = fetchedNewsFeed
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
  }

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, ["common", "news"])),
      newsFeed,
      userRole,
    },
  };
};

export default NewsPage;
