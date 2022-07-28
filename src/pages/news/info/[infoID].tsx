// External libraries
import { motion } from "framer-motion";

import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// SK Components
import {
  Actions,
  LinkButton,
  MaterialIcon,
  NoticebarManager,
  Section,
  Title,
} from "@suankularb-components/react";

// Components
import Markdown from "@components/Markdown";
import NewsPageWrapper from "@components/news/NewsPageWrapper";

// Animations
import { enterPageTransition } from "@utils/animations/config";

// Backend
import { getAllInfoIDs, getInfo } from "@utils/backend/news/info";

// Helpers
import { getLocaleString } from "@utils/helpers/i18n";
import { createTitleStr } from "@utils/helpers/title";

// Hooks
import { useSession } from "@utils/hooks/auth";

// Types
import { LangCode } from "@utils/types/common";
import { InfoPage } from "@utils/types/news";

const InfoPage: NextPage<{ info: InfoPage }> = ({ info }) => {
  const locale = useRouter().locale as LangCode;
  const { t } = useTranslation("common");
  const session = useSession();

  return (
    <>
      <Head>
        <title>
          {createTitleStr(getLocaleString(info.content.title, locale), t)}
        </title>
      </Head>

      <NewsPageWrapper news={info}>
        <section>
          {info.content.body && (
            <Markdown>{getLocaleString(info.content.body, locale)}</Markdown>
          )}
        </section>
      </NewsPageWrapper>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
  const { data: info } = await getInfo(Number(params?.infoID));
  if (!info) return { notFound: true };

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, ["common"])),
      info,
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
