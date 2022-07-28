// External libraries
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// Components
import Markdown from "@components/Markdown";
import NewsPageWrapper from "@components/news/NewsPageWrapper";

// Backend
import { getAllInfoIDs, getInfo } from "@utils/backend/news/info";

// Helpers
import { getLocaleString } from "@utils/helpers/i18n";
import { createTitleStr } from "@utils/helpers/title";

// Types
import { LangCode } from "@utils/types/common";
import { InfoPage } from "@utils/types/news";

const InfoPage: NextPage<{ infoPage: InfoPage }> = ({ infoPage }) => {
  const locale = useRouter().locale as LangCode;
  const { t } = useTranslation("common");

  return (
    <>
      <Head>
        <title>
          {createTitleStr(getLocaleString(infoPage.content.title, locale), t)}
        </title>
      </Head>

      <NewsPageWrapper news={infoPage}>
        <section>
          {infoPage.content.body && (
            <Markdown>
              {getLocaleString(infoPage.content.body, locale)}
            </Markdown>
          )}
        </section>
      </NewsPageWrapper>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
  const { data: infoPage, error } = await getInfo(Number(params?.infoID));
  if (error) return { notFound: true };

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, ["common"])),
      infoPage,
    },
    revalidate: 300,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: (await getAllInfoIDs()).map((number) => ({
      params: { infoID: number.toString() },
    })),
    fallback: "blocking",
  };
};

export default InfoPage;
