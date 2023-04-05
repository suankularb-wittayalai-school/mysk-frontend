// External libraries
import { GetStaticProps } from "next";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// Images
import ServerErrorLight from "@/public/images/graphics/error/500-light.png";
import ServerErrorDark from "@/public/images/graphics/error/500-dark.png";

// Internal components
import MultiSchemeImage from "@/components/common/MultiSchemeImage";
import ErrorHero from "@/components/error/ErrorHero";
import ErrorLayout from "@/components/error/ErrorLayout";

// Types
import { CustomPage, LangCode } from "@/utils/types/common";

const ServerErrorPage: CustomPage = () => {
  const { t } = useTranslation("common");

  return (
    <ErrorLayout>
      <ErrorHero
        image={
          <MultiSchemeImage
            srcLight={ServerErrorLight}
            srcDark={ServerErrorDark}
            width={360}
            height={244}
            alt=""
          />
        }
        title={t("error.500.title")}
        code={500}
        verbose={t("error.500.verbose")}
      >
        <div className="skc-body-large flex flex-col gap-2">
          <p>{t("error.500.desc")}</p>
          <p>{t("error.common.persistNotice")}</p>
        </div>
      </ErrorHero>
    </ErrorLayout>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: await serverSideTranslations(locale as LangCode, ["common"]),
});

export default ServerErrorPage;
