import PageHeader from "@/components/common/PageHeader";
import ArticleFormatter from "@/components/news/ArticleFormatter";
import NewsImage from "@/components/news/NewsImage";
import NewsMeta from "@/components/news/NewsMeta";
import getNewsArticleByID from "@/utils/backend/news/getNewsArticleByID";
import getLocaleString from "@/utils/helpers/getLocaleString";
import useLocale from "@/utils/helpers/useLocale";
import { supabase } from "@/utils/supabase-backend";
import { CustomPage, LangCode } from "@/utils/types/common";
import { NewsArticle } from "@/utils/types/news";
import {
  Actions,
  Button,
  ContentLayout,
  MaterialIcon,
  Text,
} from "@suankularb-components/react";
import { GetStaticPaths, GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import shortUUID from "short-uuid";

/**
 * A page for a News Article.
 *
 * @param article The News Article to display.
 */
const NewsArticlePage: CustomPage<{ article: NewsArticle }> = ({ article }) => {
  // Translation
  const locale = useLocale();
  const { t } = useTranslation("news");
  const { t: tx } = useTranslation("common");

  /**
   * Share the News Article with the browser’s native share sheet if available,
   * or copy the URL to the clipboard.
   */
  async function handleShare() {
    const shareData = {
      title: tx("tabName", {
        tabName: getLocaleString(article.title, locale),
      }),
      url: window.location.href,
    };
    if (navigator.canShare && navigator.canShare(shareData))
      await navigator.share(shareData);
    else await navigator.clipboard.writeText(window.location.href);
  }

  return (
    <>
      <Head>
        <title>
          {tx("tabName", { tabName: getLocaleString(article.title, locale) })}
        </title>
      </Head>

      <NewsMeta article={article} />
      <PageHeader parentURL="/news">{t("title")}</PageHeader>

      <ContentLayout element="article">
        <header className="mx-4 grid gap-6 sm:mx-0 md:grid-cols-12">
          <NewsImage
            image={article.image}
            priority
            className="md:col-span-4 md:col-start-2"
          />

          <section className="flex flex-col justify-between gap-4 md:col-span-6 md:col-start-6">
            <div>
              <Text
                type="headline-large"
                element="h1"
                className="md:line-clamp-2"
              >
                {getLocaleString(article.title, locale)}
              </Text>
              <Text
                type="headline-small"
                element="p"
                className="mt-2 text-on-surface-variant sm:mt-1 md:line-clamp-2"
              >
                {getLocaleString(article.description, locale)}
              </Text>
              <Text
                type="title-medium"
                element="time"
                className="mt-2 block text-on-surface-variant"
              >
                {t("date", { date: new Date(article.created_at) })}
              </Text>
            </div>
            <Actions align="left">
              <Button
                appearance="outlined"
                icon={<MaterialIcon icon="share" />}
                onClick={handleShare}
                className="!mt-auto"
              >
                {t("action.share")}
              </Button>
            </Actions>
          </section>
        </header>

        <main className="grid gap-6 md:grid-cols-12">
          <Text
            type="body-large"
            element="div"
            className="mx-4 sm:mx-0 md:col-span-7 md:col-start-3"
          >
            <ArticleFormatter>
              {getLocaleString(article.body, locale)}
            </ArticleFormatter>
          </Text>
        </main>
      </ContentLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
  const { fromUUID, toUUID } = shortUUID();

  const id = params!.id as string;

  // Redirect full UUID URLs to short UUID URLs
  if (id.length === 36)
    return {
      redirect: {
        destination: `/news/${fromUUID(id)}`,
        permanent: true,
      },
    };

  // Fetch the News Article
  const { data: article, error } = await getNewsArticleByID(
    supabase,
    toUUID(id),
  );
  if (error) return { notFound: true };

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, ["common", "news"])),
      article,
    },
    revalidate: 300,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { fromUUID } = shortUUID();
  const { data } = await supabase.from("infos").select(`id`);

  return {
    paths: (data as { id: string }[])
      .map(({ id }) => ({ id: fromUUID(id) }))
      .map((params) => [
        { params, locale: "th" },
        { params, locale: "en-US" },
      ])
      .flat(),
    fallback: "blocking",
  };
};

export default NewsArticlePage;
