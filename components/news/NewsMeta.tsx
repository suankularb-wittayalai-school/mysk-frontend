// External libraries
import Head from "next/head";
import { FC } from "react";

// Helpers
import { getLocaleString } from "@/utils/helpers/i18n";

// Hooks
import { useLocale } from "@/utils/hooks/i18n";

// Types
import { FormPage, InfoPage } from "@/utils/types/news";

/**
 * A set of `<meta>` for a news article.
 */
const NewsMeta: FC<{ newsItem: InfoPage | FormPage }> = ({ newsItem }) => {
  // Thanks @ImSadudee!

  // Translation
  const locale = useLocale();

  return (
    <Head>
      <meta
        property="description"
        content={getLocaleString(newsItem.content.description, locale)}
      />
      <meta
        property="og:title"
        content={getLocaleString(newsItem.content.title, locale)}
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
            : "https://beta.mysk.school/images/graphics/news-placeholder.png"
        }
      />
      <meta
        property="og:description"
        content={getLocaleString(newsItem.content.description, locale)}
      />
      <meta property="og:locale" content={locale} />
      <meta property="og:site_name" content="MySK" />
    </Head>
  );
};

export default NewsMeta;
