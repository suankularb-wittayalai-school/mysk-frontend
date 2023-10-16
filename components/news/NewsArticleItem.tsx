// Imports
import NewsImage from "@/components/news/NewsImage";
import cn from "@/utils/helpers/cn";
import getLocaleString from "@/utils/helpers/getLocaleString";
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/common";
import { NewsArticle } from "@/utils/types/news";
import { Interactive, Text } from "@suankularb-components/react";
import Link from "next/link";
import shortUUID from "short-uuid";

/**
 * A normal News Article item in the feed.
 * 
 * @param article The News Article to display.
 */
const NewsArticleItem: StylableFC<{
  article: NewsArticle;
}> = ({ article, style, className }) => {
  const locale = useLocale();

  const { fromUUID } = shortUUID();

  return (
    <Interactive
      href={`/news/${fromUUID(article.id)}`}
      element={Link}
      className={cn(`-m-2 px-6 py-2 sm:rounded-lg sm:px-2`, className)}
      style={style}
    >
      <article className="grid grid-cols-4 gap-6 sm:grid-cols-3">
        <NewsImage image={article.image} className="max-w-[12rem]" />
        <main className="col-span-3 space-y-1 sm:col-span-2">
          <Text type="title-large" element="h1" className="line-clamp-2">
            {getLocaleString(article.title, locale)}
          </Text>
          <Text type="title-small" element="time" className="block truncate">
            {new Date(article.created_at).toLocaleDateString(locale, {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </Text>
        </main>
      </article>
    </Interactive>
  );
};

export default NewsArticleItem;
