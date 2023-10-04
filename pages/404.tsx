// Imports
import MultiSchemeImage from "@/components/common/MultiSchemeImage";
import ErrorHero from "@/components/error/ErrorHero";
import ErrorLayout from "@/components/error/ErrorLayout";
import NotFoundDark from "@/public/images/graphics/error/404-dark.png";
import NotFoundLight from "@/public/images/graphics/error/404-light.png";
import { CustomPage, LangCode } from "@/utils/types/common";
import { Text } from "@suankularb-components/react";
import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const NotFoundPage: CustomPage = () => {
  const { t } = useTranslation("common");

  return (
    <ErrorLayout>
      <ErrorHero
        image={
          <MultiSchemeImage
            srcLight={NotFoundLight}
            srcDark={NotFoundDark}
            width={360}
            height={306}
            alt=""
          />
        }
        title={t("error.404.title")}
        code={404}
        verbose={t("error.404.verbose")}
        tabName={t("error.404.tabName")}
      >
        <Text type="body-large" element="p">
          {t("error.404.desc")}
        </Text>
      </ErrorHero>
    </ErrorLayout>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: await serverSideTranslations(locale as LangCode, ["common"]),
});

export default NotFoundPage;
