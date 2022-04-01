// Modules
import type { GetStaticProps, NextPage } from "next";
import Link from "next/link";
import { Trans, useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// SK Components
import { RegularLayout, Title } from "@suankularb-components/react";

// Page
const NotFound: NextPage = () => {
  const { t } = useTranslation("error");

  return (
    <RegularLayout
      Title={
        <Title
          name={{ title: t("verboseCode.404") }}
          pageIcon="sentiment_very_dissatisfied"
          backGoesTo="/home"
          LinkElement={Link}
        />
      }
      className="font-display"
    >
      <div className="flex flex-col items-center gap-4 md:gap-8">
        <div className="text-center leading-tight">
          <h2 className="text-9xl">404</h2>
          <h3 className="text-3xl">{t("verboseCode.404")}</h3>
        </div>
        <div className="text-lg">
          <p>
            <Trans i18nKey="common.ohNo" ns="error">
              Oh no. <em>That’s an error.</em>
            </Trans>
          </p>
        </div>
      </div>
    </RegularLayout>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as string, ["common", "error"])),
  },
});

export default NotFound;
