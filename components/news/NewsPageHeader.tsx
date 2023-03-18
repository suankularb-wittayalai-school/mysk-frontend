// External libraries
import Link from "next/link";
import Image from "next/image";

import { useTranslation } from "next-i18next";

import { FC, useContext } from "react";

// SK Components
import {
  Actions,
  Button,
  Columns,
  MaterialIcon,
  PageHeader,
  Progress,
  Snackbar,
} from "@suankularb-components/react";

// Internal components
import Favicon from "@/components/brand/Favicon";
import NewsChipSet from "@/components/news/NewsChipSet";

// Contexts
import NavDrawerContext from "@/contexts/NavDrawerContext";
import SnackbarContext from "@/contexts/SnackbarContext";

// Types
import { FormPage, InfoPage } from "@/utils/types/news";

// Helpers
import { createTitleStr } from "@/utils/helpers/title";
import { getLocaleString } from "@/utils/helpers/i18n";

// Hooks
import { useLocale } from "@/utils/hooks/i18n";
import { usePageIsLoading } from "@/utils/hooks/routing";

const PageActions: FC<{ title: string; className?: string }> = ({
  title,
  className,
}) => {
  // Translation
  const { t } = useTranslation(["news", "common"]);

  // Snackbar
  const { setSnackbar } = useContext(SnackbarContext);

  return (
    <Actions align="left" className={className}>
      {/* <Button appearance="filled">{t("action.form.do")}</Button> */}
      <Button
        appearance="outlined"
        icon={<MaterialIcon icon="link" />}
        onClick={async () => {
          const shareData = { title, url: window.location.href };
          if (navigator.canShare && navigator.canShare(shareData)) {
            await navigator.share(shareData);
            return;
          }
          await navigator.clipboard.writeText(window.location.href);
          setSnackbar(
            <Snackbar>
              {t("snackbar.copiedToClipboard", { ns: "common" })}
            </Snackbar>
          );
        }}
      >
        {t("action.common.copyLink")}
      </Button>
    </Actions>
  );
};

const NewsPageHeader: FC<{ newsItem: InfoPage | FormPage }> = ({
  newsItem,
}) => {
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
        title={getLocaleString(newsItem.content.title, locale)}
        brand={<Favicon />}
        parentURL="/news"
        homeURL="/"
        locale={locale}
        element={Link}
        onNavToggle={() => setNavOpen(true)}
      >
        <Columns
          columns={2}
          className="!flex !flex-col-reverse !gap-y-6 md:!grid"
        >
          {/* Banner image */}
          <div
            className="shadow relative -left-4 aspect-video w-[calc(100%+2rem)]
              overflow-hidden bg-surface-variant sm:left-0 sm:w-full
              sm:rounded-lg"
          >
            <Image
              src={newsItem.image || "/images/graphics/news-placeholder.png"}
              fill
              alt=""
              className="object-cover"
            />
          </div>

          {/* Title and short description */}
          <div className="flex flex-col gap-3">
            <p className="skc-headline-small">
              {getLocaleString(newsItem.content.description, locale)}
            </p>
            <NewsChipSet newsItem={newsItem as InfoPage} />
            <PageActions
              title={createTitleStr(
                getLocaleString(newsItem.content.title, locale),
                t
              )}
              className="!hidden md:!flex"
            />
          </div>
        </Columns>

        {/* Actions */}
        <PageActions
          title={createTitleStr(
            getLocaleString(newsItem.content.title, locale),
            t
          )}
          className="mt-3 md:!hidden"
        />
      </PageHeader>

      {/* Page loading indicator */}
      <Progress
        appearance="linear"
        alt={t("pageLoading")}
        visible={pageIsLoading}
      />
    </>
  );
};

export default NewsPageHeader;
