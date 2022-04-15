// Modules
import { getDay } from "date-fns";

import { GetStaticProps, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useState } from "react";

// SK Components
import { RegularLayout } from "@suankularb-components/react";

// Components
import ChangePassword from "@components/dialogs/ChangePassword";
import EditProfileDialog from "@components/dialogs/EditProfile";
import LogOutDialog from "@components/dialogs/LogOut";
import NewsSection from "@components/home-sections/NewsSection";
import SubjectsSection from "@components/home-sections/SubjectsSection";
import UserSection from "@components/home-sections/UserSection";

// Types
import { Teacher } from "@utils/types/person";
import { NewsList } from "@utils/types/news";
import { Schedule } from "@utils/types/schedule";

const TeacherHome: NextPage<{
  user: Teacher;
  schedule: Schedule;
  news: NewsList;
}> = ({ user, schedule, news }) => {
  const [showChangePassword, setShowChangePassword] = useState<boolean>(false);
  const [showEditProfile, setShowEditProfile] = useState<boolean>(false);
  const [showLogOut, setShowLogOut] = useState<boolean>(false);

  return (
    <>
      <RegularLayout>
        <UserSection
          user={user}
          setShowChangePassword={setShowChangePassword}
          setShowEditProfile={setShowEditProfile}
          setShowLogOut={setShowLogOut}
        />
        <SubjectsSection schedule={schedule} />
        <NewsSection
          news={news.map((newsItem) => ({
            ...newsItem,
            postDate: new Date(newsItem.postDate),
          }))}
        />
      </RegularLayout>

      {/* Dialogs */}
      <ChangePassword
        show={showChangePassword}
        onClose={() => setShowChangePassword(false)}
      />
      <EditProfileDialog
        user={user}
        show={showEditProfile}
        onClose={() => setShowEditProfile(false)}
      />
      <LogOutDialog show={showLogOut} onClose={() => setShowLogOut(false)} />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const user: Teacher = {
    id: 31,
    role: "teacher",
    prefix: "mister",
    name: {
      "en-US": { firstName: "Atipol", lastName: "Sukrisadanon" },
      th: { firstName: "อติพล", lastName: "สุกฤษฎานนท์" },
    },
    profile: "/images/dummybase/atipol.webp",
    classAdvisorAt: {
      id: 509,
      name: {
        "en-US": "M.509",
        th: "ม.509",
      }
    },
    subjectsInCharge: [
      {
        id: 8,
        code: { "en-US": "I21202", th: "I21202" },
        name: {
          "en-US": { name: "Communication and Presentation" },
          th: { name: "การสื่อสารและการนำเสนอ" },
        },
        subjectSubgroup: {
          name: { "en-US": "English", th: "ภาษาอังกฤษ" },
          subjectGroup: {
            name: { "en-US": "Foreign Languages", th: "ภาษาต่างประเทศ" },
          },
        },
      },
      {
        id: 19,
        code: { "en-US": "ENG20218", th: "อ20218" },
        name: {
          "en-US": { name: "Reading 6" },
          th: { name: "การอ่าน 6" },
        },
        subjectSubgroup: {
          name: { "en-US": "English", th: "ภาษาอังกฤษ" },
          subjectGroup: {
            name: { "en-US": "Foreign Language", th: "ภาษาต่างประเทศ" },
          },
        },
      },
      {
        id: 26,
        code: { "en-US": "ENG32102", th: "อ32102" },
        name: {
          "en-US": { name: "English 4" },
          th: { name: "ภาษาอังกฤษ 4" },
        },
        subjectSubgroup: {
          name: { "en-US": "English", th: "ภาษาอังกฤษ" },
          subjectGroup: {
            name: { "en-US": "Foreign Language", th: "ภาษาต่างประเทศ" },
          },
        },
      },
    ],
  };
  const news: NewsList = [
    {
      id: 12,
      type: "stats",
      postDate: new Date(2020, 0, 3),
      content: {
        "en-US": {
          title: "COVID-19 Vaccination",
          supportingText:
            "On the vaccination of all Suankularb students, including the number and the brand recieved.",
        },
        th: {
          title: "การรับวัคซีน COVID-19",
          supportingText:
            "การรวบรวมข้อมูลตัวเลขของนักเรียนโรงเรียนสวนกุหลาบวิทยาลัยที่ได้รับวัคซีนป้องกัน COVID-19",
        },
      },
    },
  ];
  const schedule: Schedule = {
    content: [
      {
        day: getDay(new Date()),
        content: [],
      },
    ],
  };

  return {
    props: {
      ...(await serverSideTranslations(locale as string, [
        "common",
        "account",
        "news",
        "dashboard",
      ])),
      user,
      // (@SiravitPhokeed)
      // Apparently NextJS doesn’t serialize Date when in development
      // It does in production, though.
      // So I guess I’ll keep this workaround, well, around…
      news: news.map((newsItem) => ({
        ...newsItem,
        postDate: newsItem.postDate.getTime(),
      })),
      schedule,
    },
  };
};

export default TeacherHome;
