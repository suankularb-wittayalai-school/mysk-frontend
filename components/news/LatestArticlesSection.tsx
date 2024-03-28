// Imports
import NewsImage from "@/components/news/NewsImage";
import cn from "@/utils/helpers/cn";
import getLocaleString from "@/utils/helpers/getLocaleString";
import useLocale from "@/utils/helpers/useLocale";
import { NewsArticle } from "@/utils/types/news";
import { Interactive, Text } from "@suankularb-components/react";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { FC } from "react";
import shortUUID from "short-uuid";

/**
 * A section of the News page that displays the 2 most recent News Articles.
 *
 * @param mainArticle The latest News Article.
 * @param asideArticle The second latest News Article.
 */
const LatestArticlesSection: FC<{
  mainArticle?: NewsArticle;
  asideArticle?: NewsArticle;
}> = ({ mainArticle, asideArticle }) => {
  const locale = useLocale();
  const { t } = useTranslation("news");

  const { fromUUID } = shortUUID();

  return (
    <>
      {/* Main article */}
      {mainArticle && (
        <Interactive
          href={`/news/${fromUUID(mainArticle.id)}`}
          element={Link}
          className="-my-4 p-4 sm:col-span-2 sm:-m-2 sm:rounded-lg sm:p-2 md:col-span-3"
        >
          <article className="flex flex-col gap-3 md:flex-row">
            <NewsImage image={mainArticle.image} priority />
            <main className="flex flex-col justify-between gap-1">
              <header className="space-y-1">
                <Text
                  type="headline-medium"
                  element="h1"
                  className="line-clamp-2 text-on-surface"
                >
                  {getLocaleString(mainArticle.title, locale)}
                </Text>
                <Text
                  type="title-large"
                  element="p"
                  className="line-clamp-2 text-on-surface-variant"
                >
                  {getLocaleString(mainArticle.description, locale)}
                </Text>
              </header>
              <Text
                type="title-medium"
                element="time"
                className="text-on-surface-variant"
              >
                {t("date", { date: new Date(mainArticle.created_at) })}
              </Text>
            </main>
          </article>
        </Interactive>
      )}

      {/* Aside article */}
      {asideArticle && (
        <Interactive
          href={`/news/${fromUUID(asideArticle.id)}`}
          element={Link}
          className={cn(`p-2 px-4 sm:col-span-2 sm:-m-2 sm:rounded-lg sm:px-2
            md:col-span-1`)}
        >
          <article className="grid grid-cols-4 gap-x-4 gap-y-3 sm:gap-x-6 md:grid-cols-1">
            <NewsImage
              image={asideArticle.image}
              priority
              className="rounded-sm md:rounded-md"
            />
            <main className="col-span-3 space-y-1 md:col-span-1">
              <Text type="title-large" element="h1" className="mb-1">
                {getLocaleString(asideArticle.title, locale)}
              </Text>
              <Text type="title-small" element="time">
                {t("date", { date: new Date(asideArticle.created_at) })}
              </Text>
            </main>
          </article>
        </Interactive>
      )}
    </>
  );
};

export default LatestArticlesSection;
