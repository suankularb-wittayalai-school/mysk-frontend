// Imports
import getLocaleString from "@/utils/helpers/getLocaleString";
import useLocale from "@/utils/helpers/useLocale";
import { NewsArticle } from "@/utils/types/news";
import Head from "next/head";
import { FC } from "react";
import shortUUID from "short-uuid";

/**
 * A set of `<meta>` for a News Article.
 *
 * @param article The News Article.
 *
 * @author @ImSadudee The only piece of code by this guy still in the codebase. That’s pretty epic.
 */
const NewsMeta: FC<{ article: NewsArticle }> = ({ article }) => {
  const locale = useLocale();

  const { fromUUID } = shortUUID();

  return (
    <Head>
      <meta
        property="description"
        content={getLocaleString(article.description, locale)}
      />
      <meta
        property="og:title"
        content={getLocaleString(article.title, locale)}
      />
      <meta property="og:type" content="news" />
      <meta
        property="og:url"
        content={`https://www.mysk.school/news/${fromUUID(article.id)}`}
      />
      <meta
        property="og:image"
        content={
          article.image
            ? article.image
            : "https://beta.mysk.school/images/graphics/news-placeholder-light.webp"
        }
      />
      <meta
        property="og:description"
        content={getLocaleString(article.description, locale)}
      />
      <meta property="og:locale" content={locale} />
      <meta property="og:site_name" content="MySK" />
    </Head>
  );
};

export default NewsMeta;
