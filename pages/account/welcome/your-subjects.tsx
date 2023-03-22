// External libraries
import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { FC } from "react";

// SK Components
import {
  Actions,
  Button,
  Card,
  ContentLayout,
  Header,
  MaterialIcon,
  Section,
} from "@suankularb-components/react";

// Helpers
import { createTitleStr } from "@/utils/helpers/title";

// Types
import { CustomPage, LangCode } from "@/utils/types/common";

const YourSubjectsPage: CustomPage = () => {
  // Translation
  const { t } = useTranslation(["welcome", "common"]);

  return (
    <>
      <Head>
        <title>{createTitleStr("Welcome", t)}</title>
      </Head>
      <ContentLayout>
        <p>Bet.</p>
        <Actions>
          <Button
            appearance="filled"
            href="/account/welcome/logging-in"
            element={Link}
          >
            Next
          </Button>
        </Actions>
      </ContentLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as LangCode, [
      "common",
      "welcome",
    ])),
  },
});

YourSubjectsPage.pageHeader = {
  title: { key: "yourSubjects.title", ns: "welcome" },
  icon: <MaterialIcon icon="waving_hand" />,
  parentURL: "/account/welcome/covid-19-safety",
};

YourSubjectsPage.childURLs = ["/account/welcome/logging-in"];

export default YourSubjectsPage;
