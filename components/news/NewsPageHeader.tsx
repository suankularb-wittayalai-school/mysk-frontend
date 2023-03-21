// External libraries
import Image from "next/image";

import { useTranslation } from "next-i18next";

import { FC, useContext } from "react";

// SK Components
import {
  Actions,
  Button,
  Columns,
  MaterialIcon,
  Snackbar,
} from "@suankularb-components/react";

// Internal components
import PageHeader from "@/components/common/PageHeader";
import NewsChipSet from "@/components/news/NewsChipSet";

// Contexts
import SnackbarContext from "@/contexts/SnackbarContext";

// Types
import { FormPage, InfoPage, NewsItemType } from "@/utils/types/news";

// Helpers
import { createTitleStr } from "@/utils/helpers/title";
import { getLocaleString } from "@/utils/helpers/i18n";

// Hooks
import { useLocale } from "@/utils/hooks/i18n";

const PageActions: FC<{
  type: NewsItemType;
  title: string;
  className?: string;
}> = ({ type, title, className }) => {
  // Translation
  const { t } = useTranslation(["news", "common"]);

  // Snackbar
  const { setSnackbar } = useContext(SnackbarContext);

  return (
    <Actions align="left" className={className}>
      {type === "form" && (
        <Button appearance="filled" href="#form">
          {t("action.form.do")}
        </Button>
      )}
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

  return (
    <PageHeader
      title={getLocaleString(newsItem.content.title, locale)}
      parentURL="/news"
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
            priority
            alt=""
            className="object-cover"
          />
        </div>

        {/* Title and short description */}
        <div className="flex flex-col gap-3">
          <p className="skc-headline-small">
            {getLocaleString(newsItem.content.description, locale)}
          </p>

          {newsItem.type !== "info" && (
            <NewsChipSet newsItem={{ ...newsItem, done: false }} />
          )}

          {/* Author and date */}
          <div className="skc-title-medium flex flex-row divide-x divide-outline">
            <time className="text-outline">
              {new Date(newsItem.postDate).toLocaleDateString(locale, {
                year: locale == "en-US" ? "numeric" : "2-digit",
                month: "short",
                day: "numeric",
              })}
            </time>
          </div>

          <PageActions
            type={newsItem.type}
            title={createTitleStr(
              getLocaleString(newsItem.content.title, locale),
              t
            )}
            className="mt-3 !hidden md:!flex"
          />
        </div>
      </Columns>

      {/* Actions */}
      <PageActions
        type={newsItem.type}
        title={createTitleStr(
          getLocaleString(newsItem.content.title, locale),
          t
        )}
        className="mt-3 md:!hidden"
      />
    </PageHeader>
  );
};

export default NewsPageHeader;
