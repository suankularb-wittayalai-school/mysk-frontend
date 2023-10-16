// Imports
import MultiSchemeImage from "@/components/common/MultiSchemeImage";
import PageHeader from "@/components/common/PageHeader";
import SnackbarContext from "@/contexts/SnackbarContext";
import NewsPlaceholderDark from "@/public/images/graphics/news-placeholder-dark.webp";
import NewsPlaceholderLight from "@/public/images/graphics/news-placeholder-light.webp";
import getLocaleString from "@/utils/helpers/getLocaleString";
import useLocale from "@/utils/helpers/useLocale";
import { MultiLangString } from "@/utils/types/common";
import { StylableFC } from "@/utils/types/component";
import { NewsArticle } from "@/utils/types/news";
import {
  Actions,
  Button,
  Columns,
  MaterialIcon,
  Snackbar,
} from "@suankularb-components/react";
import va from "@vercel/analytics";
import { useTranslation } from "next-i18next";
import { FC, useContext } from "react";

/**
 * Actions for a News Article.
 *
 * @param title A multilingual string representing the title of the News Article.
 *
 * @returns An Actions.
 */
const PageActions: StylableFC<{
  title: MultiLangString;
}> = ({ title, style, className }) => {
  // Translation
  const locale = useLocale();
  const { t } = useTranslation(["news", "common"]);

  // Snackbar
  const { setSnackbar } = useContext(SnackbarContext);

  return (
    <Actions align="left" style={style} className={className}>
      <Button
        appearance="outlined"
        icon={<MaterialIcon icon="link" />}
        onClick={async () => {
          va.track("Share News Article", {
            title: getLocaleString(title, "en-US"),
          });
          const shareData = {
            title: t("tabName", {
              ns: "common",
              tabName: getLocaleString(title, locale),
            }),
            url: window.location.href,
          };
          if (navigator.canShare && navigator.canShare(shareData)) {
            await navigator.share(shareData);
            return;
          }
          await navigator.clipboard.writeText(window.location.href);
          setSnackbar(
            <Snackbar>
              {t("snackbar.copiedToClipboard", { ns: "common" })}
            </Snackbar>,
          );
        }}
      >
        {t("action.common.copyLink")}
      </Button>
    </Actions>
  );
};

/**
 * The Page Header for a News Article of any type.
 *
 * @param newsItem An instance of Info Page or Form Page.
 *
 * @returns A Page Header.
 */
const NewsPageHeader: FC<{ newsItem: NewsArticle }> = ({ newsItem }) => {
  const locale = useLocale();

  return (
    <PageHeader
      title={getLocaleString(newsItem.title, locale)}
      parentURL="/news"
    >
      <Columns
        columns={2}
        className="!flex !flex-col-reverse !gap-y-6 md:!grid"
      >
        {/* Banner image */}
        <MultiSchemeImage
          {...(newsItem.image
            ? { srcLight: newsItem.image, srcDark: undefined }
            : { srcLight: NewsPlaceholderLight, srcDark: NewsPlaceholderDark })}
          width={648}
          height={364.5}
          priority
          alt=""
          className="shadow relative -left-4 aspect-video w-[calc(100%+2rem)]
            overflow-hidden bg-surface-variant object-cover sm:left-0
            sm:w-full sm:rounded-lg"
        />

        {/* Title and short description */}
        <div className="flex flex-col gap-3">
          <p className="skc-headline-small">
            {getLocaleString(newsItem.description, locale)}
          </p>

          {/* Author and date */}
          <div className="skc-title-medium flex flex-row divide-x divide-outline">
            <time className="text-outline">
              {new Date(newsItem.created_at).toLocaleDateString(locale, {
                year: locale == "en-US" ? "numeric" : "2-digit",
                month: "short",
                day: "numeric",
              })}
            </time>
          </div>

          <PageActions
            title={newsItem.title}
            className="mt-3 !hidden md:!flex"
          />
        </div>
      </Columns>

      {/* Actions */}
      <PageActions title={newsItem.title} className="mt-3 md:!hidden" />
    </PageHeader>
  );
};

export default NewsPageHeader;
