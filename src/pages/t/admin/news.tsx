// Modules
import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { useState } from "react";

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

// Backend
import { getNewsFeed } from "@utils/backend/news";

// Helpers
import { replaceNumberInNewsWithDate } from "@utils/helpers/news";

// Supabase
import { createTitleStr } from "@utils/helpers/title";

// Types
import { LangCode } from "@utils/types/common";
import { NewsList } from "@utils/types/news";

// Page
const AdminNews: NextPage = (): JSX.Element => {
  const { t } = useTranslation(["admin", "news", "common"]);
  const { data } = useQuery("feed", () => getNewsFeed("admin"));

  return (
    <>
      <Head>
        <title>{createTitleStr(t("news.title.full"), t)}</title>
      </Head>
      <RegularLayout
        Title={
          <Title
            name={{
              title: t("news.title.title"),
              subtitle: t("news.title.subtitle"),
            }}
            pageIcon={<MaterialIcon icon="newspaper" />}
            backGoesTo="/t/admin"
            LinkElement={Link}
          />
        }
      >
        <p>{t("news.instructions")}</p>
        <Section>
          <NewsFeed
            news={
              data
                ? (data
                    .map((newsItem) => replaceNumberInNewsWithDate(newsItem))
                    .filter((newsItem) => newsItem) as NewsList)
                : []
            }
            isForAdmin
          />
        </Section>
      </RegularLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as LangCode, [
      "common",
      "admin",
      "news",
    ])),
  },
});

export default AdminNews;
