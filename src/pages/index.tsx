// Modules
import { useEffect, useState } from "react";

import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import { useTranslation, Trans } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// SK Components
import {
  Button,
  Card,
  CardHeader,
  LinkButton,
  MaterialIcon,
  RegularLayout,
} from "@suankularb-components/react";

// Components
import Layout from "@components/Layout";

// Types
import { NewsContent, NewsItem, NewsList } from "@utils/types/news";

// Hooks
import { useSession } from "@utils/hooks/auth";
import { getLocaleString } from "@utils/helpers/i18n";
import { LangCode } from "@utils/types/common";

// Page-specific types
type Feed = { lastUpdated: Date; content: NewsList };

// News
const LandingFeed = ({ feed }: { feed: Feed }): JSX.Element => {
  const { t } = useTranslation("landing");
  const router = useRouter();
  const session = useSession();

  const [fullscreen, setFullScreen] = useState<boolean>(false);

  useEffect(() => {
    if (session?.user) {
      if (session.user.user_metadata.role === "student") router.push("/s/home");
      else if (session.user.user_metadata.role === "teacher")
        router.push("/t/home");
    }
  }, [session, router]);

  return (
    <section aria-label={t("news.title")} className="overflow-y-auto">
      <ul className="flex flex-col">
        {feed.content.map((feedItem) => (
          <LandingFeedItem key={feedItem.id} feedItem={feedItem} />
        ))}
      </ul>
    </section>
  );
};

const LandingFeedItem = ({ feedItem }: { feedItem: NewsItem }): JSX.Element => {
  const locale = useRouter().locale as LangCode;

  return (
    <li key={feedItem.id}>
      <Link href={`/news/${feedItem.id}`}>
        <a className="has-action relative grid grid-cols-2 gap-x-6 overflow-hidden rounded-xl p-2">
          <div
            className="surface relative grid h-full min-h-[8rem] w-full place-items-center
              overflow-hidden rounded-xl bg-cover p-4 text-center font-medium"
          >
            {feedItem.image ? (
              <Image
                src={feedItem.image}
                layout="fill"
                objectFit="cover"
                alt={
                  (getLocaleString(feedItem.content, locale) as NewsContent)
                    .title
                }
              />
            ) : (
              (getLocaleString(feedItem.content, locale) as NewsContent).title
            )}
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="font-display text-2xl font-bold leading-none">
              {(getLocaleString(feedItem.content, locale) as NewsContent).title}
            </h3>
            <p className="max-lines-5 leading-tight">
              {
                (getLocaleString(feedItem.content, locale) as NewsContent)
                  .supportingText
              }
            </p>
          </div>
        </a>
      </Link>
    </li>
  );
};

// Banner
const LandingBanner = (): JSX.Element => {
  const { t } = useTranslation(["landing", "common"]);
  const locale = useRouter().locale as "en-US" | "th";

  return (
    <header className="flex flex-col gap-6 font-display">
      <h2 className="text-[10rem] font-bold leading-none">
        <Trans i18nKey="brand.nameWithAccent" ns="common">
          My
          <span className="dark:text-[#FF80C3]">
            {/* (@SiravitPhokeed)
                This color is `secondary70` in the Figma palette, but not the Tailwind palette.
                Should we add it (and others like it)?
              */}
            SK
          </span>
        </Trans>
      </h2>
      <div className="flex flex-col gap-2">
        <div className="flex flex-row items-center gap-x-6 leading-tight">
          <div className="relative aspect-square h-28">
            <Image
              src="/images/branding/logo-white.svg"
              layout="fill"
              priority
              alt={t("brand.logoAlt", { ns: "common" })}
            />
          </div>
          <p className="text-3xl">
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
                attr={{ "aria-hidden": true }}
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
  const { t } = useTranslation(["landing", "common"]);

  return (
    <>
      <Head>
        <title>{t("brand.name", { ns: "common" })}</title>
      </Head>
      <div
        className="min-h-screen bg-[url('/images/landing.webp')]
          bg-cover bg-fixed bg-bottom pt-[4.5rem] text-on-surface"
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

export const getServerSideProps: GetStaticProps = async ({ locale }) => {
  const feed: Feed = {
    lastUpdated: new Date(2022, 4, 9).getTime(),
    content: [
      {
        id: 4,
        type: "news",
        postDate: new Date(2021, 8, 16).getTime(),
        content: {
          "en-US": {
            title: "Certificates Announcement",
            supportingText:
              "Announcement of the 2020 Suankularb Wittayalai winners of certificates.",
          },
          th: {
            title: "ประกาศเกียรติคุณ",
            supportingText:
              "ประกาศเกียรติคุณโรงเรียนสวนกุหลาบวิทยาลัย ประจำปีการศึกษา 2563",
          },
        },
      },
      {
        id: 2,
        type: "news",
        postDate: new Date(2020, 4, 12).getTime(),
        image: "/images/dummybase/sk-teaching-practice.webp",
        content: {
          "en-US": {
            title: "SK Teaching Practice",
            supportingText:
              "The stories we’re about to tell might seem small, but can go a long way in creating an enjoyable \
            environment for teachers and students alike.",
          },
          th: {
            title: "การบริหารจัดการชั้นเรียน",
            supportingText:
              "เรื่องที่พวกเราจะเล่านั้น เป็นเพียงประเด็นเล็กๆ ที่ใช้บริหารจัดการชั้นเรียนได้อยู่หมัด มันดึงความสนใจของเด็กน้อยจากมือถือได้ \
            แถมมีเสียงหัวเราะเกิดขึ้นในชั้นเรียน นักเรียนได้ค้นคว้าได้ทดลอง ได้ฝึกปฏิบัติ",
          },
        },
      },
    ],
  };

  return {
    props: {
      ...(await serverSideTranslations(locale as string, [
        "common",
        "landing",
      ])),
      feed,
    },
  };
};
