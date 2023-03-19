// External libraries
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { FC, useContext } from "react";

// SK Components
import { PageHeader, PageHeaderProps, Progress } from "@suankularb-components/react";

// Internal components
import Favicon from "@/components/brand/Favicon";
import NavDrawerContext from "@/contexts/NavDrawerContext";

// Hooks
import { useLocale } from "@/utils/hooks/i18n";
import { usePageIsLoading } from "@/utils/hooks/routing";

const MySKPageHeader: FC<
  Pick<PageHeaderProps, "title"> & Partial<PageHeaderProps>
> = (props) => {
  // Translation
  const locale = useLocale();
  const { t } = useTranslation("common");

  // Navigation Drawer toggle
  const { setNavOpen } = useContext(NavDrawerContext);

  // Page load
  const { pageIsLoading } = usePageIsLoading();

  return (
    <>
      <PageHeader
        brand={<Favicon />}
        homeURL="/"
        locale={locale}
        element={Link}
        onNavToggle={() => setNavOpen(true)}
        {...props}
      />
      <Progress
        appearance="linear"
        alt={t("pageLoading")}
        visible={pageIsLoading}
      />
    </>
  );
};

export default MySKPageHeader;
