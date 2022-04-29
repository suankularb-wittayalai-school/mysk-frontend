import NewsBanner from "@components/news/NewsBanner";
import NewsWrapper from "@components/news/NewsPage";
import { GetStaticProps, NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// Page
const StudentFeedback: NextPage = () => {
  const { t } = useTranslation("news");

  return (
    <NewsWrapper
      title={{
        "en-US": "Classes Feedback",
        th: "การจัดการเรียนการสอนออนไลน์",
      }}
      type="form"
    >
      <NewsBanner
        content={{
          title: {
            "en-US": "Online classes feedback",
            th: "การจัดการเรียนการสอนออนไลน์",
          },
          subtitle: {
            "en-US": "For the first half of Semester 2/2021",
            th: "ช่วงก่อนสอบกลางภาคเรียนที่ 2 ปีการศึกษา 2564",
          },
          frequency: "once",
          dueDate: new Date(2022, 1, 28),
          done: false,
        }}
        banner="/images/dummybase/classes-feedback.webp"
      />
    </NewsWrapper>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as string, ["common", "news"])),
  },
});

export default StudentFeedback;
