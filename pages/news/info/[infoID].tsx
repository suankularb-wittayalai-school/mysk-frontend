// External libraries
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { FC, useContext } from "react";

// SK Components
import {
  Actions,
  Button,
  Columns,
  ContentLayout,
  MaterialIcon,
  PageHeader,
  Progress,
  Snackbar,
} from "@suankularb-components/react";

// Internal components
import Favicon from "@/components/brand/Favicon";
import Markdown from "@/components/formatting/Markdown";
import NewsChipSet from "@/components/news/NewsChipSet";

// Backend
import { getInfo, getAllInfoIDs } from "@/utils/backend/news/info";

// Contexts
import NavDrawerContext from "@/contexts/NavDrawerContext";
import SnackbarContext from "@/contexts/SnackbarContext";

// Types
import { CustomPage, LangCode } from "@/utils/types/common";
import { InfoPage as InfoPageType } from "@/utils/types/news";

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

const InfoPageHeader: FC<{ infoPage: InfoPageType }> = ({ infoPage }) => {
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
        title={getLocaleString(infoPage.content.title, locale)}
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
            className="shadow relative -left-4 aspect-video
            w-[calc(100%+2rem)] overflow-hidden bg-surface-variant sm:left-0
            sm:w-full sm:rounded-lg"
          >
            <Image
              src={infoPage.image || "/images/graphics/news-placeholder.png"}
              fill
              alt=""
              className="object-cover"
            />
          </div>

          {/* Title and short description */}
          <div className="flex flex-col gap-3">
            <p className="skc-headline-small">
              {getLocaleString(infoPage.content.description, locale)}
            </p>
            {/* <NewsChipSet newsItem={infoPage} /> */}
            <PageActions
              title={createTitleStr(
                getLocaleString(infoPage.content.title, locale),
                t
              )}
              className="!hidden md:!flex"
            />
          </div>
        </Columns>
        <PageActions
          title={createTitleStr(
            getLocaleString(infoPage.content.title, locale),
            t
          )}
          className="mt-3 md:!hidden"
        />
      </PageHeader>
      <Progress
        appearance="linear"
        alt={t("pageLoading")}
        visible={pageIsLoading}
      />
    </>
  );
};

const InfoPage: CustomPage<{ infoPage: InfoPageType }> = ({ infoPage }) => {
  // Translation
  const locale = useLocale();
  const { t } = useTranslation("common");

  return (
    <>
      <Head>
        <title>
          {createTitleStr(getLocaleString(infoPage.content.title, locale), t)}
        </title>
      </Head>
      <InfoPageHeader infoPage={infoPage} />
      <ContentLayout>
        <Columns columns={6}>
          <div
            className="skc-body-large col-span-2 mx-4 -my-5 sm:col-span-4
              sm:mx-0 md:col-start-2"
          >
            <Markdown>
              {getLocaleString(infoPage.content.body, locale)}
            </Markdown>
          </div>
        </Columns>
      </ContentLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
  const { data: infoPage, error } = await getInfo(Number(params?.infoID));
  if (error) return { notFound: true };

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, ["common", "news"])),
      infoPage,
    },
    revalidate: 300,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: (await getAllInfoIDs()).map((number) => ({
      params: { infoID: number.toString() },
    })),
    fallback: "blocking",
  };
};

InfoPage.pageRole = "student";

export default InfoPage;
