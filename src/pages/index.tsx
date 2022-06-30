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
    <section
      aria-label={t("news.title")}
      className="overflow-y-auto text-on-surface"
    >
      <ul className="flex flex-col">
        {feed.content.map((feedItem) => (
          <LandingFeedItem key={feedItem.id} feedItem={feedItem} />
        ))}
      </ul>
    </section>
  );
};

const LandingFeedItem = ({ feedItem }: { feedItem: NewsItem }): JSX.Element => {
  const locale = useRouter().locale as "en-US" | "th";

  return (
    <li key={feedItem.id}>
      <Link href={`/news/${feedItem.id}`}>
        <a className="has-action relative flex flex-row gap-x-6 overflow-hidden rounded-2xl p-2">
          <div
            className="surface grid aspect-square h-32 place-items-center rounded-2xl bg-cover text-center
              font-medium sm:aspect-[2/1]"
            style={{
              backgroundImage: feedItem.image
                ? `url('${feedItem.image}')`
                : "none",
            }}
          >
            {!feedItem.image &&
              (getLocaleString(feedItem.content, locale) as NewsContent).title}
          </div>
          <div className="flex flex-col">
            <h3 className="font-display text-2xl font-bold">
              {(getLocaleString(feedItem.content, locale) as NewsContent).title}
            </h3>
            <p className="max-lines-2">
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

  return <header className=""></header>;
};

// Page
export default function Landing({ feed }: { feed: Feed }) {
  const { t } = useTranslation(["landing", "common"]);

  return (
    <>
      <Head>
        <title>{t("brand.name", { ns: "common" })}</title>
      </Head>
      <div className="min-h-screen bg-[url('/images/landing.png')] bg-cover bg-fixed bg-bottom pt-[4.5rem]">
        <RegularLayout>
          <div className="layout-grid-cols-2">
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
