// External libraries
import Head from "next/head";
import { FC } from "react";

// Helpers
import getLocaleString from "@/utils/helpers/getLocaleString";

// Hooks
import useLocale from "@/utils/helpers/useLocale";

// Types
import { Info } from "@/utils/types/news";

/**
 * A set of `<meta>` for a news article.
 */
const NewsMeta: FC<{ newsItem: Info }> = ({ newsItem }) => {
  // Thanks @ImSadudee!

  // Translation
  const locale = useLocale();

  return (
    <Head>
      <meta
        property="description"
        content={getLocaleString(newsItem.description, locale)}
      />
      <meta
        property="og:title"
        content={getLocaleString(newsItem.title, locale)}
      />
      <meta property="og:type" content="news" />
      <meta
        property="og:url"
        content={`https://beta.mysk.school/news/info/${newsItem.id}`}
      />
      <meta
        property="og:image"
        content={
          newsItem.image
            ? newsItem.image
            : "https://beta.mysk.school/images/graphics/news-placeholder-light.webp"
        }
      />
      <meta
        property="og:description"
        content={getLocaleString(newsItem.description, locale)}
      />
      <meta property="og:locale" content={locale} />
      <meta property="og:site_name" content="MySK" />
    </Head>
  );
};

export default NewsMeta;
