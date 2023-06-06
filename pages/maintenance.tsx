// External libraries
import { GetStaticProps } from "next";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// Images
import MaintenanceLight from "@/public/images/graphics/error/maintenance-light.png";
import MaintenanceDark from "@/public/images/graphics/error/maintenance-dark.png";

// Internal components
import MultiSchemeImage from "@/components/common/MultiSchemeImage";
import ErrorHero from "@/components/error/ErrorHero";
import ErrorLayout from "@/components/error/ErrorLayout";

// Types
import { CustomPage, LangCode } from "@/utils/types/common";

const MaintenancePage: CustomPage = () => {
  const { t } = useTranslation("common");

  return (
    <ErrorLayout>
      <ErrorHero
        image={
          <MultiSchemeImage
            srcLight={MaintenanceLight}
            srcDark={MaintenanceDark}
            width={360}
            height={244}
            alt=""
          />
        }
        title={t("error.maintenance.title")}
        tabName={t("error.maintenance.tabName")}
      >
        <p className="skc-body-large">{t("error.maintenance.desc")}</p>
      </ErrorHero>
    </ErrorLayout>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: await serverSideTranslations(locale as LangCode, ["common"]),
});

MaintenancePage.navType = "hidden";

export default MaintenancePage;
