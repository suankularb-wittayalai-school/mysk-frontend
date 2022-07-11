// // Modules
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
// import Link from "next/link";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// import { useEffect, useState } from "react";

// import Masonry from "react-masonry-css";

// // SK Components
// import {
//   ChipFilterList,
//   MaterialIcon,
//   RegularLayout,
//   Section,
//   Title,
// } from "@suankularb-components/react";

// // Components
// import NewsCard from "@components/NewsCard";

// Types
import { NewsItemType, NewsList, NewsListNoDate } from "@utils/types/news";

// // Helpers
// import { filterNews } from "@utils/helpers/filter-news";

// const NewsFilter = ({
//   setNewsFilter,
// }: {
//   setNewsFilter: (newFilter: Array<NewsItemType>) => void;
// }): JSX.Element => {
//   const { t } = useTranslation("news");
//   return (
//     <ChipFilterList
//       choices={[
//         { id: "news", name: t("filter.news") },
//         { id: "form", name: t("filter.forms") },
//         { id: "payment", name: t("filter.payments") },
//         [
//           { id: "not-done", name: t("filter.amountDone.notDone") },
//           { id: "done", name: t("filter.amountDone.done") },
//         ],
//       ]}
//       onChange={(newFilter: Array<NewsItemType>) => setNewsFilter(newFilter)}
//       scrollable={true}
//     />
//   );
// };

// const NewsMasonry = ({ news }: { news: NewsList }): JSX.Element => (
//   <Masonry
//     role="feed"
//     breakpointCols={{
//       default: 3,
//       905: 2,
//       600: 1,
//     }}
//     className="flex flex-row gap-4 sm:gap-6"
//     columnClassName="flex flex-col gap-4 sm:gap-6"
//   >
//     {news
//       .map((newsItem) => ({
//         ...newsItem,
//         postDate: new Date(newsItem.postDate),
//         dueDate:
//           newsItem.type == "form" || newsItem.type == "payment"
//             ? newsItem.dueDate
//             : undefined,
//       }))
//       .map((newsItem, index) => (
//         <article key={newsItem.id} aria-posinset={index} aria-setsize={-1}>
//           <NewsCard newsItem={newsItem} showChips />
//         </article>
//       ))}
//   </Masonry>
// );

// Page
const NewsPage: NextPage<{ news: NewsListNoDate }> = ({
  news,
}): JSX.Element => {
  const { t } = useTranslation(["news", "common"]);
//   const [newsFilter, setNewsFilter] = useState<Array<NewsItemType>>([]);
//   const [filteredNews, setFilteredNews] = useState<NewsList>(news);

//   useEffect(
//     () =>
//       filterNews(news, newsFilter, (newNews: NewsList) =>
//         setFilteredNews(newNews)
//       ),
//     [news, newsFilter]
//   );

  return (
    <>
      <Head>
        <title>
          {t("title.title")} - {t("brand.name", { ns: "common" })}
        </title>
      </Head>
{/*        <RegularLayout
         Title={
           <Title
             name={{
               title: t("title.title"),
               subtitle: t("title.subtitle"),
             }}
             pageIcon={<MaterialIcon title="newspaper" />}
             backGoesTo="/s/home"
             LinkElement={Link}
             key="title"
           />
         }
       >
         <Section>
           <NewsFilter setNewsFilter={setNewsFilter} />
           <NewsMasonry news={filteredNews} />
         </Section>
       </RegularLayout> */}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
//   const news: NewsList = [
//     {
//       id: 8,
//       type: "form",
//       frequency: "once",
//       postDate: new Date(2022, 2, 20),
//       dueDate: new Date(2022, 4, 9),
//       done: false,
//       content: {
//         "en-US": {
//           title: "Student Information",
//           supportingText:
//             "Edit and confirm your student information on the Data Management Center (DMC)",
//         },
//         th: {
//           title: "ข้อมูลนักเรียนรายบุคคล",
//           supportingText: "ตรวจสอบและยืนยันข้อมูลนักเรียนรายบุคคล (DMC)",
//         },
//       },
//     },
//     {
//       id: 7,
//       type: "form",
//       frequency: "once",
//       postDate: new Date(2022, 1, 1),
//       dueDate: new Date(2022, 1, 28),
//       done: true,
//       content: {
//         "en-US": {
//           title: "Classes Feedback",
//           supportingText:
//             "All personal information will be kept as a secret. For EPlus+ students, give feedback through co-teachers.",
//         },
//         th: {
//           title: "การจัดการเรียนการสอนออนไลน์",
//           supportingText:
//             "ข้อมูลส่วนบุคคลของนักเรียนจะถูกเก็บไว้เป็นความลับ สำหรับโครงการ EPlus+ ให้ประเมินผ่าน co-teacher",
//         },
//       },
//     },
//     {
//       id: 6,
//       type: "form",
//       frequency: "weekly",
//       postDate: new Date(2022, 0, 8),
//       dueDate: new Date(2022, 2, 31),
//       done: true,
//       content: {
//         "en-US": {
//           title: "Classes Feedback",
//           supportingText:
//             "Before every Monday, all students must test for COVID-19 via RT-PCR, ATK, or other trusted methods and submit \
//             their readings here.",
//         },
//         th: {
//           title: "บันทึกผลการตรวจโควิด-19",
//           supportingText:
//             "ก่อนทุกวันจันทร์ ให้นักเรียนถ่ายรูปผลการตรวจการหาเชื้อโควิด-19 ผ่าน RT-PCR ATK หรือวิธีอื่นๆ",
//         },
//       },
//     },
//     {
//       id: 5,
//       type: "payment",
//       postDate: new Date(2022, 0, 7),
//       dueDate: new Date(2022, 1, 7),
//       amount: 40000.0,
//       done: true,
//       content: {
//         "en-US": {
//           title: "School Maintainance Payment",
//           supportingText:
//             "Enter the School ICT system to help contribute to the maintenance of our school.",
//         },
//         th: {
//           title: "การชำระเงินบำรุงการศึกษา",
//           supportingText: "เข้าระบบ School ICT เพื่อชําระเงินบํารุงการศึกษา",
//         },
//       },
//     },
//     {
//       id: 4,
//       type: "news",
//       postDate: new Date(2021, 8, 16),
//       content: {
//         "en-US": {
//           title: "Certificates Announcement",
//           supportingText:
//             "Announcement of the 2020 Suankularb Wittayalai winners of certificates.",
//         },
//         th: {
//           title: "ประกาศเกียรติคุณ",
//           supportingText:
//             "ประกาศเกียรติคุณโรงเรียนสวนกุหลาบวิทยาลัย ประจำปีการศึกษา 2563",
//         },
//       },
//     },
//     {
//       id: 3,
//       type: "form",
//       frequency: "once",
//       postDate: new Date(2020, 3, 14),
//       dueDate: new Date(2020, 3, 21),
//       done: false,
//       content: {
//         "en-US": {
//           title: "Online Learning Readiness",
//           supportingText:
//             "To effectively provide means of study online to the most students possible, please do this form.",
//         },
//         th: {
//           title: "ความพร้อมการเรียนออนไลน์",
//           supportingText:
//             "เพื่อให้จัดการเรียนการสอนผ่านระบบออนไลน์ได้อย่างเหมาะสมและครอบคลุมนักเรียนทั้งหมด จึงขอให้นักเรียนตอบแบบสอบถามนี้อย่างซื่อสัตย์",
//         },
//       },
//     },
//     {
//       id: 2,
//       type: "news",
//       postDate: new Date(2020, 4, 12),
//       image: "/images/dummybase/sk-teaching-practice.webp",
//       content: {
//         "en-US": {
//           title: "SK Teaching Practice",
//           supportingText:
//             "The stories we’re about to tell might seem small, but can go a long way in creating an enjoyable \
//             environment for teachers and students alike.",
//         },
//         th: {
//           title: "การบริหารจัดการชั้นเรียน",
//           supportingText:
//             "เรื่องที่พวกเราจะเล่านั้น เป็นเพียงประเด็นเล็กๆ ที่ใช้บริหารจัดการชั้นเรียนได้อยู่หมัด มันดึงความสนใจของเด็กน้อยจากมือถือได้ \
//             แถมมีเสียงหัวเราะเกิดขึ้นในชั้นเรียน นักเรียนได้ค้นคว้าได้ทดลอง ได้ฝึกปฏิบัติ",
//         },
//       },
//     },
//     {
//       id: 1,
//       type: "news",
//       postDate: new Date(2020, 1, 21),
//       content: {
//         "en-US": {
//           title: "2020 Pre-Test Results",
//           supportingText:
//             "The results are here! This time, we are ordering the scores with percentile order (P^r), which to put simply",
//         },
//         th: {
//           title: "ประกาศผลการทดสอบ Pre-Test",
//           supportingText:
//             "ผลการตรวจกระดาษคำตอบครั้งนี้ มีการจัดลำดับที่เป็นลำดับเปอร์เซ็นไทล์ (P^r) กล่าวคือ ลำดับที่ได้จะสะท้อน",
//         },
//       },
//     },
//   ];

  return {
    props: {
      ...(await serverSideTranslations(locale as string, ["common", "news"])),

//       // (@SiravitPhokeed)
//       // Apparently NextJS doesn’t serialize Date when in development
//       // It does in production, though.
//       // So I guess I’ll keep this workaround, well, around…
//       news: news.map((newsItem) => ({
//         ...newsItem,
//         postDate: newsItem.postDate.getTime(),
//         dueDate:
//           newsItem.type == "form" || newsItem.type == "payment"
//             ? newsItem.dueDate
//               ? newsItem.dueDate.getTime()
//               : null
//             : null,
//       })),
    },
  };
};

export default NewsPage;
