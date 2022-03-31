// Modules
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { useEffect, useState } from "react";

import Masonry from "react-masonry-css";

// SK Components
import {
  ChipFilterList,
  RegularLayout,
  Section,
  Title,
} from "@suankularb-components/react";

// Components
import NewsCard from "@components/NewsCard";

// Types
import { NewsItemType, NewsList } from "@utils/types/news";

// Helpers
import { filterNews } from "@utils/helpers/filter-news";

const NewsFilter = ({
  setNewsFilter,
}: {
  setNewsFilter: (newFilter: Array<NewsItemType>) => void;
}): JSX.Element => {
  const { t } = useTranslation("news");
  return (
    <ChipFilterList
      choices={[
        { id: "news", name: t("filter.news") },
        { id: "form", name: t("filter.forms") },
        { id: "payment", name: t("filter.payments") },
        [
          { id: "not-done", name: t("filter.amountDone.notDone") },
          { id: "done", name: t("filter.amountDone.done") },
        ],
      ]}
      onChange={(newFilter: Array<NewsItemType>) => setNewsFilter(newFilter)}
      scrollable={true}
    />
  );
};

const NewsMasonry = ({ news }: { news: NewsList }): JSX.Element => (
  <Masonry
    role="feed"
    breakpointCols={{
      default: 3,
      905: 2,
      600: 1,
    }}
    className="flex flex-row gap-4 sm:gap-6"
    columnClassName="flex flex-col gap-4 sm:gap-6"
  >
    {news
      .map((newsItem) => ({
        ...newsItem,
        postDate: new Date(newsItem.postDate),
      }))
      .map((newsItem, index) => (
        <article key={newsItem.id} aria-posinset={index} aria-setsize={-1}>
          <NewsCard newsItem={newsItem} showChips />
        </article>
      ))}
  </Masonry>
);

// Page
const NewsPage: NextPage<{ news: NewsList }> = ({ news }): JSX.Element => {
  const { t } = useTranslation(["news", "common"]);
  const [newsFilter, setNewsFilter] = useState<Array<NewsItemType>>([]);
  const [filteredNews, setFilteredNews] = useState<NewsList>(news);

  useEffect(
    () => filterNews(news, newsFilter, (newNews) => setFilteredNews(newNews)),
    [news, newsFilter]
  );

  return (
    <>
      <Head>
        <title>
          {t("title.title")} - {t("brand.name", { ns: "common" })}
        </title>
      </Head>
      <RegularLayout
        Title={
          <Title
            name={{
              title: t("title.title"),
              // TODO: When Title line height is fixed, add this back
              // subtitle: t("title.subtitle"),
            }}
            pageIcon="person"
            backGoesTo="/"
            LinkElement={Link}
            key="title"
          />
        }
      >
        <Section>
          <NewsFilter setNewsFilter={setNewsFilter} />
          <NewsMasonry news={filteredNews} />
        </Section>
      </RegularLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const news: NewsList = [
    {
      id: 7,
      type: "form",
      frequency: "once",
      postDate: new Date(2022, 2, 20),
      done: false,
      content: {
        "en-US": {
          title: "Student Information",
          supportingText:
            "Edit and confirm your student information on the Data Management Center (DMC)",
        },
        th: {
          title: "ข้อมูลนักเรียนรายบุคคล",
          supportingText: "ตรวจสอบและยืนยันข้อมูลนักเรียนรายบุคคล (DMC)",
        },
      },
    },
    {
      id: 6,
      type: "form",
      frequency: "once",
      postDate: new Date(2022, 2, 20),
      done: true,
      content: {
        "en-US": {
          title: "Classes Feedback",
          supportingText:
            "All personal information will be kept as a secret. For EPlus+ students, give feedback through co-teachers.",
        },
        th: {
          title: "การจัดการเรียนการสอนออนไลน์",
          supportingText:
            "ข้อมูลส่วนบุคคลของนักเรียนจะถูกเก็บไว้เป็นความลับ สำหรับโครงการ EPlus+ ให้ประเมินผ่าน co-teacher",
        },
      },
    },
    {
      id: 5,
      type: "payment",
      postDate: new Date(2022, 0, 7),
      done: true,
      content: {
        "en-US": {
          title: "School Maintainance Payment",
          supportingText:
            "Enter the School ICT system to help contribute to the maintenance of our school.",
        },
        th: {
          title: "การชำระเงินบำรุงการศึกษา",
          supportingText: "เข้าระบบ School ICT เพื่อชําระเงินบํารุงการศึกษา",
        },
      },
    },
    {
      id: 4,
      type: "news",
      postDate: new Date(2021, 8, 16),
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
  ];

  return {
    props: {
      ...(await serverSideTranslations(locale as string, ["common", "news"])),

      // (@SiravitPhokeed)
      // Apparently NextJS doesn’t serialize Date when in development
      // It does in production, though.
      // So I guess I’ll keep this woukaround, well, around…
      news: news.map((newsItem) => ({
        ...newsItem,
        postDate: newsItem.postDate.getTime(),
      })),
    },
  };
};

export default NewsPage;
