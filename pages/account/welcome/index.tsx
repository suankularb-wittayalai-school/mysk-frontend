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
          <h2 id="header-thank-you">Thank you for testing out the new MySK.</h2>
          <p>Before we get started, however, we need to set a few things up.</p>
        </div>
        <p>
          Every academic year, not only do we welcome new students into the
          school, some information about people inside the school also change.
          This is an opportunity to add or check the accuracy of the information
          in your MySK account.
        </p>
        <p>
          Your MySK account is used not for MySK but for other services inside
          the school as well, so ensure your information is correct.
        </p>
      </Section>
    </Columns>
  );
};

const ComingUpSection: FC = () => {
  // Translation
  const { t } = useTranslation("welcome");

  return (
    <Section>
      <Header>Coming up</Header>
      <p>
        As you set up your MySK account for 2023, you’ll progress through these
        steps:
      </p>
      <ol className="list-decimal pl-6">
        <li>Your information</li>
        <li>COVID-19 safety</li>
        <li>Your subjects</li>
        <li>Logging in</li>
      </ol>
    </Section>
  );
};

const NoticesSection: FC = () => {
  // Translation
  const { t } = useTranslation("welcome");

  return (
    <Section>
      <Header className="sr-only">Final instructions</Header>
      <p>
        When you press “Next” on each step, your information will be saved for
        that step.
      </p>
      <Card appearance="outlined" className="!flex-row gap-3 py-3 px-4">
        <MaterialIcon icon="warning" className="text-error" />
        <p>
          Don’t close this tab. You’ll have to restart the set up process all
          over again if you do.
        </p>
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
        <Actions>
          <Button
            appearance="outlined"
            dangerous
            href="/account/logout"
            element={Link}
          >
            Log out
          </Button>
          <Button
            appearance="filled"
            href="/account/welcome/your-information"
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

WelcomePage.pageHeader = {
  title: { key: "instructions.title", ns: "welcome" },
  icon: <MaterialIcon icon="waving_hand" />,
};

WelcomePage.childURLs = ["/account/welcome/your-information"];

export default WelcomePage;
