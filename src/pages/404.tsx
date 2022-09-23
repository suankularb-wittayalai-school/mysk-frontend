// Modules
import type { GetStaticProps, NextPage } from "next";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// SK Components
import {
  MaterialIcon,
  RegularLayout,
  Title,
} from "@suankularb-components/react";

// Components
import ErrorHeader from "@components/error/ErrorHeader";

// Page
const NotFound: NextPage = () => {
  const { t } = useTranslation("error");

  return (
    <RegularLayout
      Title={
        <Title
          name={{ title: t("verboseCode.404") }}
          pageIcon={<MaterialIcon icon="sentiment_very_dissatisfied" />}
          backGoesTo={() => history.back()}
        />
      }
    >
      <ErrorHeader code={404} verbose={t("verboseCode.404")} />
    </RegularLayout>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as string, ["common", "error"])),
  },
});

export default NotFound;
