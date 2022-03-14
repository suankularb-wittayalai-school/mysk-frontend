// Modules
import { useState } from "react";

import { useTranslation, Trans } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

// SK Components
import {
  Card,
  CardHeader,
  LinkButton,
  MaterialIcon,
} from "@suankularb-components/react";

// Types
import { NewsItem, NewsList } from "@utils/types/news";

// News
const LandingFeed = ({
  feed,
}: {
  feed: { lastUpdated: Date; content: NewsList };
}): JSX.Element => {
  const [fullscreen, setFullScreen] = useState<boolean>(false);
  const { t } = useTranslation("landing");

  return (
    <section
      className={`absolute bottom-0 h-[calc(100vh-4.75rem)] rounded-t-xl bg-[#fbfcff88] text-on-surface
        backdrop-blur-xl transition-transform dark:bg-[#191c1e88] sm:right-4
        sm:top-4 sm:h-[calc(100vh-6.5rem)] sm:w-[22.5rem] sm:translate-y-0 sm:rounded-xl sm:transition-[width] ${
          fullscreen
            ? "translate-y-0 sm:w-[calc(100vw-2rem)]"
            : "translate-y-[calc(100vh-14.25rem)]"
        }`}
    >
      <Card
        type="stacked"
        appearance="tonal"
        className="h-full !bg-transparent"
      >
        <button
          onClick={() => setFullScreen(!fullscreen)}
          className="relative text-left
            before:absolute before:top-0 before:left-0 before:h-full
            before:w-full before:content-['']
            before:hover:bg-primary-translucent-08 before:hover:transition-none
            before:focus:bg-primary-translucent-12 before:focus:transition-none"
        >
          <CardHeader
            icon="newspaper"
            title={
              <h2 className="font-display text-lg font-medium">
                {t("news.title")}
              </h2>
            }
            label={
              <p className="font-display">
                <Trans i18nKey="news.lastUpdated" ns="landing">
                  {{
                    lastUpdated: feed.lastUpdated.toLocaleDateString(
                      useRouter().locale,
                      { year: "numeric", month: "long", day: "numeric" }
                    ),
                  }}
                </Trans>
              </p>
            }
            end={
              <div className="btn--text !p-2">
                {fullscreen ? (
                  <MaterialIcon icon="fullscreen_exit" />
                ) : (
                  <MaterialIcon icon="fullscreen" />
                )}
              </div>
            }
          />
        </button>
        <div className="grow overflow-y-auto">
          <ul className="flex flex-col">
            {feed.content.map((feedItem) => (
              <LandingFeedItem feedItem={feedItem} key={feedItem.id} />
            ))}
          </ul>
        </div>
      </Card>
    </section>
  );
};

const LandingFeedItem = ({ feedItem }: { feedItem: NewsItem }): JSX.Element => {
  const locale = useRouter().locale == "en-US" ? "en-US" : "th";

  return (
    <li key={feedItem.id}>
      <Link href={`/news/${feedItem.id}`}>
        <a
          className="relative flex flex-col has-action"
        >
          <div
            className="surface grid h-48 w-full place-items-center text-center bg-cover"
            style={{
              backgroundImage: feedItem.image
                ? `url('${feedItem.image}')`
                : "none",
            }}
          >
            {!feedItem.image && feedItem.content[locale].title}
          </div>
          <div className="flex flex-col p-4">
            <h3
              className="font-display text-lg font-bold"
            >
              {feedItem.content[locale].title}
            </h3>
            <p className="max-lines-2">
              {feedItem.content[locale].supportingText}
            </p>
          </div>
        </a>
      </Link>
    </li>
  );
};

const ChangeLanguageButton = () => {
  const { t } = useTranslation("landing");

  // FIXME: This is broken right now because of bad component library code
  // return (
  //   <Link href="/" locale={useRouter().locale == "en-US" ? "th" : "en-US"}>
  //     <Button
  //       name={t("changeLang")}
  //       type="text"
  //       icon={<MaterialIcon icon="translate" />}
  //       className="!text-tertiary-container dark:!text-tertiary"
  //     />
  //   </Link>
  // );

  // A temporary component is created with CSS rather than React SK Components to avoid this issue
  return (
    <Link href="/" locale={useRouter().locale == "en-US" ? "th" : "en-US"}>
      <a className="btn--text btn--has-icon !text-tertiary-container dark:!text-tertiary">
        <MaterialIcon icon="translate" />
        <span>{t("changeLang")}</span>
      </a>
    </Link>
  );
};

// Banner
const LandingBanner = (): JSX.Element => {
  const { t } = useTranslation(["landing", "common"]);

  return (
    <header className="h-screen bg-[url('/images/landing.png')] bg-cover bg-left font-display sm:min-h-[calc(100vh-4.5rem)]">
      {/* Vignette layer */}
      <div
        className="flex h-screen flex-col items-center gap-16 bg-gradient-to-b
          from-[#00000033] via-transparent to-[#00000033] px-8 py-16
          dark:from-[#00000099] dark:via-[#00000066] dark:to-[#00000099]
          sm:min-h-[calc(100vh-4.5rem)] sm:items-start sm:bg-gradient-to-r sm:px-16"
      >
        <div className="flex flex-col items-center text-center sm:flex-row sm:gap-8 sm:text-left">
          {/* Logo */}
          <div className="relative h-40 w-40">
            <Image
              alt="โลโก้ดอกไม้สีชมพู มีตัวอักษร MySK อยู่ตรงกลาง"
              layout="fill"
              priority={true}
              src={"/images/branding/logo-white.png"}
            />
          </div>

          {/* Text */}
          <div className="w-96 font-display leading-tight text-white">
            <h1 className="text-9xl font-bold">
              <Trans i18nKey="brand.nameWithAccent" ns="common">
                My
                <span className="text-secondary-container dark:text-secondary">
                  SK
                </span>
              </Trans>
            </h1>
            <p className="text-4xl font-light">
              {t("brand.school", { ns: "common" })}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col items-center gap-2 sm:items-start">
          <div className="flex flex-row flex-wrap justify-center gap-4">
            <LinkButton
              name={t("login")}
              type="filled"
              icon={<MaterialIcon icon="login" />}
              url="/account/login"
              LinkElement={Link}
              className="!bg-tertiary-container !text-tertiary
                hover:before:bg-tertiary-translucent-08 focus:shadow-lg
                focus:before:bg-tertiary-translucent-12"
            />
            <LinkButton
              name={t("help")}
              type="outlined"
              url="/help"
              LinkElement={Link}
              className="!bg-transparent !text-tertiary-container !outline-tertiary-container
                hover:!bg-tertiary-translucent-08 focus:!bg-tertiary-translucent-12
                focus-visible:!bg-tertiary dark:!text-tertiary dark:!outline-tertiary"
            />
          </div>
          <ChangeLanguageButton />
        </div>
      </div>
    </header>
  );
};

// Page
const Landing: NextPage = () => (
  <div className="relative h-full overflow-hidden">
    <LandingBanner />
    <LandingFeed
      feed={{
        lastUpdated: new Date(),
        content: [
          {
            id: 4,
            type: "news",
            postDate: new Date(2021, 8, 16),
            image: "/images/dummybase/certificates-announcement.jpg",
            content: {
              "en-US": {
                title: "Certificates Announcement",
                supportingText:
                  "Announcement of the 2020 Suankularb Wittayalai winners of certificates.",
              },
              th: {
                title: "ประกาศเกียรติคุณ",
                supportingText:
                  "ประกาศเกียรติคุณโรงเรียนสวนกุหลาบวิทยาลัย ประจปีการศึกษา 2563",
              },
            },
          },
          {
            id: 1,
            type: "news",
            postDate: new Date(2020, 4, 12),
            image: "/images/dummybase/sk-teaching-practice.jpg",
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
                  แถมมีเสียงหัวเราะเกิดขึ้นในชั้นเรียน นักเรียนได้ค้นคว้าได้ทดลอง ได้ฝึกปฏิบัติ กิจกรรมเหล่านี้ส่งเสริมให้นักเรียนเกิดทักษะการคิดและแลกเปลี่ยนเรียนรู้ร่วมกัน \
                  ทำให้นักเรียนมีความสุขสนุกสนานในการเรียนและเกิดทักษะการรวบรวมข้อมูล คิดอย่างเป็นระบบสร้างเป็นองค์ความรู้ที่ยั่งยืนได้อย่างแท้จริง",
              },
            },
          },
        ],
      }}
    />
  </div>
);

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "landing"])),
  },
});

export default Landing;
