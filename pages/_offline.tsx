// External libraries
import { GetStaticProps } from "next";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// Images
import OfflineLight from "@/public/images/graphics/error/offline-light.png";
import OfflineDark from "@/public/images/graphics/error/offline-dark.png";

// Internal components
import MultiSchemeImage from "@/components/common/MultiSchemeImage";
import ErrorHero from "@/components/error/ErrorHero";
import ErrorLayout from "@/components/error/ErrorLayout";

// Types
import { CustomPage, LangCode } from "@/utils/types/common";

// (@SiravitPhokeed)
// I don’t know if next-i18next works with _offline.tsx. I don’t even know how
// I would know if any of this works. When I tried turning off the internet
// connection and navigating to an un-cached page, I just get the default
// browser not connected page.
// I’m just gonna leave this here in case someone in the future knows what’s
// going on here.

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
            <h2 id="header-school-wi-fi" className="skc-title-medium">
              {t("error.offline.schoolWiFi.title")}
            </h2>
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
