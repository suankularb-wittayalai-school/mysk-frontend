// External libraries
import AppDrawer from "@/components/common/AppDrawer";
import MultiSchemeImage from "@/components/common/MultiSchemeImage";
import AppStateContext from "@/contexts/AppStateContext";
import BlobsTopLargeDark from "@/public/images/graphics/blobs/top-large-dark.svg";
import BlobsTopLargeLight from "@/public/images/graphics/blobs/top-large-light.svg";
import BlobsTopSmallDark from "@/public/images/graphics/blobs/top-small-dark.svg";
import BlobsTopSmallLight from "@/public/images/graphics/blobs/top-small-light.svg";
import { cn } from "@/utils/helpers/className";
import { usePageIsLoading } from "@/utils/hooks/routing";
import {
  Button,
  ContentLayout,
  MaterialIcon,
  PageHeaderProps,
  Progress,
} from "@suankularb-components/react";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { FC, useContext } from "react";

const PageHeader: FC<
  Pick<PageHeaderProps, "children" | "title" | "parentURL" | "onBack">
> = ({ children, title, parentURL, onBack }) => {
  const { t } = useTranslation("common", { keyPrefix: "pageHeader" });
  const { t: tx } = useTranslation("common");

  const { setNavOpen } = useContext(AppStateContext);
  const { pageIsLoading } = usePageIsLoading();

  return (
    <>
      <MultiSchemeImage
        srcLight={BlobsTopLargeLight}
        srcDark={BlobsTopLargeDark}
        priority
        alt=""
        className="absolute inset-0 bottom-0 -z-10 hidden sm:block"
      />
      <MultiSchemeImage
        srcLight={BlobsTopSmallLight}
        srcDark={BlobsTopSmallDark}
        priority
        alt=""
        className="absolute inset-0 bottom-0 -z-10 sm:hidden"
      />
      <Progress
        appearance="linear"
        alt={tx("pageLoading")}
        visible={pageIsLoading}
        className="!ml-0"
      />
      <ContentLayout className="!pb-2 !pt-6 [&>.skc-content-layout\_\_content]:!gap-y-0">
        <div className="ml-2 mr-4 flex flex-row gap-2 sm:-ml-2 sm:mr-0">
          {parentURL || onBack ? (
            <Button
              appearance="text"
              icon={<MaterialIcon icon="arrow_backward" />}
              alt={t("action.navigation")}
              {...(onBack
                ? { onClick: onBack }
                : { href: parentURL, element: Link })}
            />
          ) : (
            <Button
              appearance="text"
              icon={<MaterialIcon icon="menu" />}
              alt={t("action.back")}
              onClick={() => setNavOpen(true)}
              className="sm:!hidden"
            />
          )}

          {/* Spacer */}
          <div className="grow" />

          {/* App Drawer */}
          <AppDrawer />
        </div>

        {/* Header text */}
        <h1
          className={cn([
            `skc-display-large mx-4 sm:mx-0`,
            children ? `mb-4` : undefined,
          ])}
        >
          {title}
        </h1>

        {children}
      </ContentLayout>
    </>
  );
};

export default PageHeader;
