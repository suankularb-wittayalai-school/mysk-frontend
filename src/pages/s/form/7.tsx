// Modules
import { GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import ReactMarkdown from "react-markdown";

// SK Components
import { Section } from "@suankularb-components/react";

// Components
import NewsBanner from "@components/news/NewsBanner";
import NewsWrapper from "@components/news/NewsPage";

// Page
const StudentFeedback: NextPage = () => {
  const locale = useRouter().locale as "en-US" | "th";

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
      <Section>
        <div className="markdown">
          <ReactMarkdown>
            {
              {
                "en-US":
                  "- The personal information of students will be kept secret.\n\n- For EPLUS+ project to evaluate via co-teacher of foreign teachers.\n- If the subjects and teachers do not actually match the subjects that students live Students do not have to assess in that course.\n\nChoose the answer in accordance with the level of satisfaction in order for the school to use the information to develop online teaching and learning systems.\n\nThe system will automatically record data. Click Submit once done.",
                th: "- ข้อมูลส่วนบุคคลของนักเรียนจะถูกเก็บไว้เป็นความลับ\n- สำหรับโครงการ EPLUS+ ให้ประเมินผ่าน co-teacher ของครูชาวต่างประเทศ\n- หากวิชาเรียนและครูผู้สอนไม่ตรงกับวิชาที่นักเรียนอยู่จริง นักเรียนไม่ต้องประเมินในรายวิชานั้น\n\nเลือกคำตอบให้สอดคล้องกับระดับความพึงพอใจเพื่อให้โรงเรียนนำข้อมูลไปพัฒนาระบบการจัดการเรียนการสอนออนไลน์\n\nระบบจะบันทึกข้อมูลอัตโนมัติ ให้นักเรียนส่งแบบสอบถามด้วยตนเองเมื่อเสร็จแล้ว",
              }[locale]
            }
          </ReactMarkdown>
        </div>
      </Section>
    </NewsWrapper>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as string, ["common", "news"])),
  },
});

export default StudentFeedback;
