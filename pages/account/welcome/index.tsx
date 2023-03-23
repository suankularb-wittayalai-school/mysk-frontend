// External libraries
import { GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { FC } from "react";

// SK Components
import {
  Actions,
  Button,
  Card,
  Columns,
  ContentLayout,
  Header,
  MaterialIcon,
  Section,
} from "@suankularb-components/react";

// Images
import WelcomeImageLight from "@/public/images/graphics/welcome-light.webp";
import WelcomeImageDark from "@/public/images/graphics/welcome-dark.webp";

// Helpers
import { createTitleStr } from "@/utils/helpers/title";

// Types
import { CustomPage, LangCode } from "@/utils/types/common";

const ThankYouSection: FC = () => {
  // Translation
  const { t } = useTranslation("welcome");

  return (
    <Columns columns={3}>
      <picture
        className="mx-4 mb-4 overflow-hidden rounded-lg
          border-1 border-outline-variant sm:mx-0 sm:translate-y-0"
      >
        <source
          srcSet={WelcomeImageDark.src}
          media="(prefers-color-scheme: dark)"
        />
        <Image src={WelcomeImageLight} width={720} height={480} alt="" />
      </picture>
      <Section
        sectionAttr={{ "aria-labelledby": "header-thank-you" }}
        className="sm:col-span-2"
      >
        <div className="skc-headline-small">
          <h2 id="header-thank-you">{t("instructions.thankYou.title")}</h2>
          <p>{t("instructions.thankYou.subtitle")}</p>
        </div>
        <p>{t("instructions.thankYou.reason")}</p>
        <p>{t("instructions.thankYou.usage")}</p>
      </Section>
    </Columns>
  );
};

const ComingUpSection: FC = () => {
  // Translation
  const { t } = useTranslation("welcome");

  return (
    <Section>
      <Header>{t("instructions.comingUp.title")}</Header>
      <p>{t("instructions.comingUp.desc")}</p>
      <ol className="list-decimal pl-6">
        <li>{t("instructions.comingUp.step.1")}</li>
        <li>{t("instructions.comingUp.step.2")}</li>
        <li>{t("instructions.comingUp.step.3")}</li>
        <li>{t("instructions.comingUp.step.4")}</li>
      </ol>
    </Section>
  );
};

const NoticesSection: FC = () => {
  // Translation
  const { t } = useTranslation("welcome");

  return (
    <Section>
      <Header className="sr-only">{t("instructions.notices.title")}</Header>
      <p>{t("instructions.notices.desc")}</p>
      <Card
        appearance="outlined"
        direction="row"
        className="items-center gap-3 py-3 px-4"
      >
        <MaterialIcon icon="warning" className="text-error" />
        <p>{t("instructions.notices.warning")}</p>
      </Card>
    </Section>
  );
};

const WelcomePage: CustomPage = () => {
  // Translation
  const { t } = useTranslation(["welcome", "common"]);

  return (
    <>
      <Head>
        <title>{createTitleStr(t("instructions.title"), t)}</title>
      </Head>
      <ContentLayout>
        <ThankYouSection />
        <ComingUpSection />
        <NoticesSection />
        <Actions className="mx-4 sm:mx-0">
          <Button
            appearance="outlined"
            dangerous
            href="/account/logout"
            element={Link}
          >
            {t("instructions.action.logOut")}
          </Button>
          <Button
            appearance="filled"
            href="/account/welcome/your-information"
            element={Link}
          >
            {t("common.action.next")}
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

WelcomePage.pageHeader = {
  title: { key: "instructions.title", ns: "welcome" },
  icon: <MaterialIcon icon="waving_hand" />,
};

WelcomePage.childURLs = ["/account/welcome/your-information"];

export default WelcomePage;
