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
import { LandingFeedItem as LandingFeedItemType } from "src/utils/types/landing";

// Banner

// News
const LandingFeed = ({
  feed,
}: {
  feed: { lastUpdated: Date; content: Array<LandingFeedItemType> };
}): JSX.Element => {
  const [fullscreen, setFullScreen] = useState<boolean>(false);
  const { t } = useTranslation("landing");

  return (
    <section
      className={`absolute bottom-0 h-[calc(100vh-4.75rem)] rounded-t-xl bg-[#fbfcff88] text-light-on-surface backdrop-blur-xl
        transition-transform dark:bg-[#191c1e88] dark:text-dark-on-surface sm:right-4
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
          className="text-left"
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
                      useRouter().locale
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

const LandingFeedItem = ({
  feedItem,
}: {
  feedItem: LandingFeedItemType;
}): JSX.Element => (
  <li key={feedItem.id}>
    <Link href={feedItem.url}>
      <a
        className="group relative flex
          flex-col before:absolute before:top-0 before:left-0 before:h-full before:w-full before:content-['']
          before:hover:bg-light-primary-translucent-08 before:hover:transition-none
          before:focus:bg-light-primary-translucent-12 before:focus:transition-none
          before:hover:dark:bg-dark-primary-translucent-08 before:focus:dark:bg-dark-primary-translucent-12"
      >
        <div
          className="surface grid aspect-[2/1] w-full place-items-center text-center"
          style={{
            backgroundImage: feedItem.image
              ? `url('${feedItem.image}')`
              : "none",
          }}
        >
          {!feedItem.image && feedItem.name}
        </div>
        <div className="flex flex-col p-4">
          <h3
            className="font-display text-lg font-bold
              group-hover:text-light-on-primary-container group-focus:text-light-on-primary-container
              group-hover:dark:text-dark-on-primary-container group-focus:dark:text-dark-on-primary-container"
          >
            {feedItem.name}
          </h3>
          <p className="max-lines-2">{feedItem.desc}</p>
        </div>
      </a>
    </Link>
  </li>
);

const ChangeLanguageButton = () => {
  const { t } = useTranslation("landing");

  return (
    <Link href="/" locale={useRouter().locale == "en-US" ? "th" : "en-US"}>
      <button className="btn--text flex flex-row gap-2 !text-light-tertiary-container">
        <MaterialIcon icon="translate" />
        <span>{t("changeLang")}</span>
      </button>
    </Link>
  );
};

// Banner
const LandingBanner = (): JSX.Element => {
  const { t } = useTranslation(["landing", "common"]);

  return (
    <header
      className="min-h-screen snap-start bg-[url('/images/landing.png')]
      bg-cover bg-left font-display sm:min-h-[calc(100vh-4.5rem)]"
    >
      {/* Vignette layer */}
      <div
        className="flex h-full flex-col items-center gap-16 bg-gradient-to-b
        from-[#00000033] via-transparent to-[#00000033]
        px-8 py-16 sm:items-start sm:bg-gradient-to-r sm:px-16"
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
          <div className="font-display text-light-white">
            <h1 className="text-9xl font-bold">
              <Trans i18nKey="brand.name" ns="common">
                My<span className="text-light-secondary-container">SK</span>
              </Trans>
            </h1>
            <p className="text-4xl font-light">
              {t("brand.school", { ns: "common" })}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 sm:items-start">
          <div className="flex flex-row flex-wrap justify-center gap-4">
            <LinkButton
              name={t("login")}
              type="filled"
              icon={<MaterialIcon icon="login" />}
              url="/account/login"
              LinkElement={Link}
              className="!bg-light-tertiary-container !text-light-tertiary
              hover:before:bg-light-tertiary-translucent-08 focus:shadow-lg
              focus:before:bg-light-tertiary-translucent-12 hover:before:dark:bg-dark-tertiary-translucent-08
              focus:before:dark:bg-dark-tertiary-translucent-12"
            />
            <LinkButton
              name={t("help")}
              type="outlined"
              url="/help"
              LinkElement={Link}
              className="!border-light-tertiary-container !bg-transparent !text-light-tertiary-container
              hover:!bg-light-tertiary-translucent-08 focus:!bg-light-tertiary-translucent-12
              focus-visible:!bg-light-tertiary"
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
  <div className="relative h-screen overflow-hidden">
    <LandingBanner />
    <LandingFeed
      feed={{
        lastUpdated: new Date(),
        content: [
          {
            id: 0,
            name: "ประกาศเกียรติคุณ",
            desc: "ประกาศเกียรติคุณโรงเรียนสวนกุหลาบวิทยาลัย ประจำปีการศึกษา 2563",
            url: "/certificate?year=2563",
          },
          {
            id: 1,
            name: "การบริหารจัดการชั้นเรียน",
            desc: "เรื่องที่พวกเราจะเล่านั้น เป็นเพียงประเด็นเล็กๆ ที่ใช้บริหารจัดการชั้นเรียนได้อยู่หมัด มันดึงความสนใจของเด็กน้อยจากมือถือได้ \
              แถมมีเสียงหัวเราะเกิดขึ้นในชั้นเรียน นักเรียนได้ค้นคว้าได้ทดลอง ได้ฝึกปฏิบัติ กิจกรรมเหล่านี้ส่งเสริมให้นักเรียนเกิดทักษะการคิดและ แลกเปลี่ยนเรียนรู้ร่วมกัน \
              ทำให้นักเรียนมีความสุขสนุกสนานในการเรียนและเกิดทักษะการรวบรวมข้อมูล คิดอย่างเป็นระบบสร้างเป็นองค์ความรู้ที่ยั่งยืนได้อย่างแท้จริง",
            url: "/online/teacher-videos",
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
