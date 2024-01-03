import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import OfflineLight from "@/public/images/graphics/error/offline-light.png";
import OfflineDark from "@/public/images/graphics/error/offline-dark.png";
import MultiSchemeImage from "@/components/common/MultiSchemeImage";
import ErrorHero from "@/components/error/ErrorHero";
import ErrorLayout from "@/components/error/ErrorLayout";
import { CustomPage, LangCode } from "@/utils/types/common";
import { Text } from "@suankularb-components/react";

/**
 * An error page that is displayed when the user is offline.
 */
const OfflinePage: CustomPage = () => {
  const { t } = useTranslation("common");

  return (
    <ErrorLayout>
      <ErrorHero
        image={
          <MultiSchemeImage
            srcLight={OfflineLight}
            srcDark={OfflineDark}
            width={360}
            height={244}
            alt=""
          />
        }
        title={t("error.offline.title")}
        tabName={t("error.offline.tabName")}
      >
        <p className="skc-body-large">{t("error.offline.desc")}</p>
        <div className="skc-body-medium flex flex-col gap-4">
          <p>{t("error.offline.offlineAvailability")}</p>
          <section
            aria-labelledby="header-school-wi-fi"
            className="flex flex-col gap-2"
          >
            <Text
              type="title-medium"
              element={(props) => <h2 id="header-school-wi-fi" {...props} />}
            >
              {t("error.offline.schoolWiFi.title")}
            </Text>
            <p>{t("error.offline.schoolWiFi.desc")}</p>
          </section>
        </div>
      </ErrorHero>
    </ErrorLayout>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: await serverSideTranslations(locale as LangCode, ["common"]),
});

export default OfflinePage;
