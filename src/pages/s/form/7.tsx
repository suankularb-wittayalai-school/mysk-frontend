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
      <p>TODO</p>
    </NewsWrapper>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as string, ["common", "news"])),
  },
});

export default StudentFeedback;
