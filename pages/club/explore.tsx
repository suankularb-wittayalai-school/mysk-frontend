// Imports
import { ContentLayout } from "@suankularb-components/react";
import PageHeader from "@/components/common/PageHeader";
import { GetServerSideProps, NextPage } from "next";
import { useTranslation } from "next-i18next";
import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { LangCode } from "@/utils/types/common";

/**
 * A jumping off point for exploring everything Activity Day has to offer.
 * Interact with the Map and browse the list of Clubs in each of the 4 Houses.
 *
 * @param clubs The full list of Clubs with location to be indexed into by the Map.
 *
 * @returns A Page.
 */
const ExplorePage: NextPage<{}> = ({}) => {
  const { t } = useTranslation("explore");

  return (
    <>
      <Head>
        <title>tabName</title>
      </Head>
      <ContentLayout className="!pb-8">
        <PageHeader parentURL="/club" className="mx-4 sm:mx-0">
          {t("title")}
        </PageHeader>
        {/* Add map and/or club details here */}
      </ContentLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  req,
  res,
}) => {
  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "explore",
        "common",
      ])),
    },
  };
};

export default ExplorePage;
