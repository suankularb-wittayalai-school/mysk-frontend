// Modules
import { motion } from "framer-motion";

import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import { useTranslation, Trans } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { useEffect } from "react";

// SK Components
import {
  Button,
  CardHeader,
  LinkButton,
  MaterialIcon,
  RegularLayout,
} from "@suankularb-components/react";

// Components
import Layout from "@components/Layout";

// Animations
import { animationTransition } from "@utils/animations/config";

// Backend
import { getLandingFeed } from "@utils/backend/news/info";

// Types
import { LangCode } from "@utils/types/common";
import { NewsItem, NewsList } from "@utils/types/news";

// Helpers
import { getLocaleString } from "@utils/helpers/i18n";

// Hooks
import { useSession } from "@utils/hooks/auth";

// Page-specific types
type Feed = { lastUpdated: Date; content: NewsList };

// News
const LandingFeed = ({ feed }: { feed: Feed }): JSX.Element => {
  const { t } = useTranslation("landing");

  return (
    <section
      aria-label={t("news.title")}
      className="mt-16 bg-[#C5E7FF5E] !p-0 backdrop-blur-md dark:bg-[#004C6D5E]
        sm:mt-0 sm:rounded-xl"
    >
      <CardHeader
        icon={<MaterialIcon icon="newspaper" className="text-on-surface" />}
        title={
          <h2 className="font-display text-lg font-medium">
            {t("news.title")}
          </h2>
        }
        label={
          <p className="font-display">
            <Trans i18nKey="news.lastUpdated" ns="landing">
              {{
                lastUpdated: new Date(feed.lastUpdated).toLocaleDateString(
                  useRouter().locale,
                  { year: "numeric", month: "long", day: "numeric" }
                ),
              }}
            </Trans>
          </p>
        }
      />
      <ul className="flex flex-col pb-1">
        {feed.content.map((feedItem) => (
          <LandingFeedItem key={feedItem.id} feedItem={feedItem} />
        ))}
        <li
          className="container-secondary mt-6 py-4 px-6
            text-center font-display text-lg font-medium sm:hidden"
        >
          {t("news.reachedEnd")}
        </li>
      </ul>
    </section>
  );
};

const LandingFeedItem = ({ feedItem }: { feedItem: NewsItem }): JSX.Element => {
  const locale = useRouter().locale as LangCode;

  return (
    <motion.li
      key={feedItem.id}
      layoutId={`news-info-${feedItem.id}`}
      transition={animationTransition}
    >
      <Link href={`/news/info/${feedItem.id}`}>
        <a className="has-action relative grid grid-cols-2 gap-x-6 px-2 py-1">
          <div
            className="relative h-full min-h-[8rem] w-full overflow-hidden rounded-xl
              bg-surface-2 bg-cover text-right font-medium"
          >
            {feedItem.image ? (
              <Image
                src={feedItem.image}
                layout="fill"
                objectFit="cover"
                alt={getLocaleString(feedItem.content.title, locale)}
              />
            ) : (
              <p
                className="max-lines-2 m-2 overflow-hidden font-display text-5xl font-light
                  leading-none text-on-surface-variant opacity-30"
              >
                {getLocaleString(feedItem.content.title, locale)}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="max-lines-2 font-display text-2xl font-bold leading-none">
              {getLocaleString(feedItem.content.title, locale)}
            </h3>
            <p className="max-lines-2 leading-tight">
              {getLocaleString(feedItem.content.description, locale)}
            </p>
          </div>
        </a>
      </Link>
    </motion.li>
  );
};

// Banner
const LandingBanner = (): JSX.Element => {
  const { t } = useTranslation(["landing", "common"]);
  const locale = useRouter().locale as LangCode;

  return (
    <header className="flex flex-col gap-2 font-display sm:gap-6">
      <h2 className="text-[7rem] font-bold leading-none sm:text-[10rem]">
        <Trans i18nKey="brand.nameWithAccent" ns="common">
          My
          <span className="text-[#8B005A] dark:text-[#FF80C3]">
            {/* (@SiravitPhokeed)
                These colors are `secondary70` and `secondary30` in the Figma palette, but not
                the Tailwind palette. Should we add them (and others like them)?
              */}
            SK
          </span>
        </Trans>
      </h2>
      <div className="flex flex-col gap-2">
        <div className="flex flex-row items-center gap-2 leading-tight sm:gap-6">
          <div className="relative aspect-square h-24 drop-shadow sm:h-28">
            <Image
              src="/images/branding/logo-white.svg"
              layout="fill"
              priority
              alt={t("brand.logoAlt", { ns: "common" })}
            />
          </div>
          <p className="text-xl sm:text-3xl">
            <Trans i18nKey="brand.slogan" ns="common">
              Education management
              <br />
              Suankularb Wittayalai School
            </Trans>
          </p>
        </div>
        <div className="flex flex-row flex-wrap items-center gap-2">
          <LinkButton
            label={t("login")}
            type="filled"
            icon={<MaterialIcon icon="login" />}
            url="/account/login"
            LinkElement={Link}
            className="has-action--tertiary !bg-tertiary !text-on-tertiary"
          />
          <LinkButton
            label={t("help")}
            type="tonal"
            url="/help"
            LinkElement={Link}
          />
          <Link href="/" locale={locale == "en-US" ? "th" : "en-US"}>
            <a title={t("changeLang")}>
              <Button
                type="outlined"
                icon={<MaterialIcon icon="translate" />}
                iconOnly
                attr={{ "aria-hidden": true, tabIndex: -1 }}
              />
            </a>
          </Link>
        </div>
      </div>
    </header>
  );
};

// Page
export default function Landing({ feed }: { feed: Feed }) {
  const router = useRouter();
  const session = useSession();
  const { t } = useTranslation(["landing", "common"]);

  useEffect(() => {
    if (session?.user) {
      if (session.user.user_metadata.role === "student") router.push("/s/home");
      else if (session.user.user_metadata.role === "teacher")
        router.push("/t/home");
    }
  }, [session, router]);

  return (
    <>
      <Head>
        <title>{t("brand.name", { ns: "common" })}</title>
      </Head>
      <div
        className="min-h-screen bg-[url('/images/landing-light.webp')] bg-cover bg-fixed bg-center
          text-on-surface dark:bg-[url('/images/landing-dark.webp')] sm:pt-[4.5rem]"
      >
        <RegularLayout>
          <div className="flex flex-col gap-y-6 md:grid md:grid-cols-2 md:gap-x-6">
            <LandingBanner />
            <LandingFeed feed={feed} />
          </div>
        </RegularLayout>
      </div>
    </>
  );
}

Landing.getLayout = (page: NextPage): JSX.Element => (
  <Layout navIsTransparent>{page}</Layout>
);

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as string, ["common", "landing"])),
    feed: await getLandingFeed(),
  },
});
