// Imports
import MultiSchemeImage from "@/components/common/MultiSchemeImage";
import CallStackSection from "@/components/error/CallStackSection";
import ErrorHero from "@/components/error/ErrorHero";
import ErrorLayout from "@/components/error/ErrorLayout";
import ClientErrorDark from "@/public/images/graphics/error/client-dark.png";
import ClientErrorLight from "@/public/images/graphics/error/client-light.png";
import { Text } from "@suankularb-components/react";
import { useTranslation } from "next-i18next";
import { FC } from "react";

const PageFallback: FC<{ error: Error }> = ({ error }) => {
  const { t } = useTranslation("common");

  return (
    <ErrorLayout>
      <ErrorHero
        image={
          <MultiSchemeImage
            srcLight={ClientErrorLight}
            srcDark={ClientErrorDark}
            width={360}
            height={244}
            alt=""
          />
        }
        title={t("error.client.title")}
        verbose={t("error.client.verbose")}
        tabName={t("error.client.tabName")}
      >
        <Text type="body-large" element="div" className="flex flex-col gap-2">
          <p>{t("error.client.desc")}</p>
          <p>{t("error.common.persistNotice")}</p>
        </Text>
      </ErrorHero>
      <CallStackSection error={error} />
    </ErrorLayout>
  );
};

export default PageFallback;
