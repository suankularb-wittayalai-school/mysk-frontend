// Modules
import { getDay } from "date-fns";

import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { useState } from "react";

// SK Components
import {
  MaterialIcon,
  RegularLayout,
  Title,
} from "@suankularb-components/react";

// Components
import ChangePassword from "@components/dialogs/ChangePassword";
import EditProfileDialog from "@components/dialogs/EditProfile";
import LogOutDialog from "@components/dialogs/LogOut";
import UserSection from "@components/home-sections/UserSection";
import NewsSection from "@components/home-sections/NewsSection";
import StudentClassSection from "@components/home-sections/StudentClass";
import TeachersSection from "@components/home-sections/TeachersSection";

// Types
import { NewsList } from "@utils/types/news";
import { Student, Teacher } from "@utils/types/person";
import { Schedule } from "@utils/types/schedule";

// Page
const StudentHome: NextPage<{
  user: Student | Teacher;
  news: NewsList;
  schedule: Schedule;
  teachers: Array<Teacher>;
  classAdvisors: Array<Teacher>;
}> = ({ user, news, schedule, teachers, classAdvisors }) => {
  const { t } = useTranslation(["dashboard", "common"]);

  // Dialog controls
  const [showChangePassword, setShowChangePassword] = useState<boolean>(false);
  const [showEditProfile, setShowEditProfile] = useState<boolean>(false);
  const [showLogOut, setShowLogOut] = useState<boolean>(false);

  return (
    <>
      {/* Title */}
      <Head>
        <title>
          {t("title")} - {t("brand.name", { ns: "common" })}
        </title>
      </Head>

      {/* Content */}
      <RegularLayout
        Title={
          <Title
            name={{ title: t("brand.name", { ns: "common" }) }}
            pageIcon={<MaterialIcon icon="home" />}
            backGoesTo={() => setShowLogOut(true)}
            LinkElement={Link}
            className="sm:!hidden"
          />
        }
      >
        <UserSection
          user={user}
          setShowChangePassword={setShowChangePassword}
          setShowEditProfile={setShowEditProfile}
          setShowLogOut={setShowLogOut}
        />
        <NewsSection
          news={news.map((newsItem) => ({
            ...newsItem,
            postDate: new Date(newsItem.postDate),
          }))}
          showFilters
        />
        <StudentClassSection schedule={schedule} />
        <TeachersSection teachers={teachers} classAdvisors={classAdvisors} />
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
  const user: Student = {
    id: 9,
    role: "student",
    prefix: "mister",
    name: {
      "en-US": { firstName: "Sadudee", lastName: "Theparree" },
      th: { firstName: "สดุดี", lastName: "เทพอารีย์" },
    },
    profile: "/images/dummybase/sadudee.webp",
    class: "405",
    classNo: 11,
  };
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
            "ประกาศเกียรติคุณโรงเรียนสวนกุหลาบวิทยาลัย ประจำปีการศึกษา 2563",
        },
      },
    },
  ];
  const schedule: Schedule = {
    content: [
      {
        day: getDay(new Date()),
        content: [
          { periodStart: 1, duration: 1 },
          {
            periodStart: 2,
            duration: 1,
            subject: {
              name: {
                "en-US": {
                  name: "Chemistry",
                  shortName: "Chem",
                },
                th: {
                  name: "เคมี",
                  shortName: "เคมี",
                },
              },
              teachers: [
                {
                  name: {
                    "en-US": {
                      firstName: "Thanthapatra",
                      lastName: "Bunchuay",
                    },
                    th: {
                      firstName: "ธันฐภัทร",
                      lastName: "บุญช่วย",
                    },
                  },
                },
              ],
            },
          },
        ],
      },
    ],
  };
  const teachers: Array<Teacher> = [
    {
      id: 0,
      role: "teacher",
      prefix: "mister",
      name: {
        "en-US": {
          firstName: "Taradol",
          lastName: "Ranarintr",
        },
        th: {
          firstName: "ธราดล",
          lastName: "รานรินทร์",
        },
      },
      profile: "/images/dummybase/taradol.webp",
      classAdvisorAt: {
        id: 405,
        name: {
          "en-US": "M.405",
          th: "ม.405",
        },
      },
      subjectsInCharge: [],
    },
    {
      id: 1,
      role: "teacher",
      prefix: "mister",
      name: {
        "en-US": {
          firstName: "Thanakorn",
          lastName: "Atjanawat",
        },
        th: {
          firstName: "ธนกร",
          lastName: "อรรจนาวัฒน์",
        },
      },
      profile: "/images/dummybase/thanakorn.webp",
      classAdvisorAt: {
        id: 404,
        name: {
          "en-US": "M.040",
          th: "ม.404",
        },
      },
      subjectsInCharge: [],
    },
    {
      id: 2,
      role: "teacher",
      prefix: "missus",
      name: {
        "en-US": {
          firstName: "Mattana",
          lastName: "Tatanyang",
        },
        th: {
          firstName: "มัทนา",
          lastName: "ต๊ะตันยาง",
        },
      },
      profile: "/images/dummybase/mattana.webp",
      classAdvisorAt: {
        id: 405,
        name: {
          "en-US": "M.405",
          th: "ม.405",
        },
      },
      subjectsInCharge: [],
    },
    {
      id: 3,
      role: "teacher",
      prefix: "mister",
      name: {
        "en-US": {
          firstName: "John",
          middleName: "Peter",
          lastName: "Smith",
        },
        th: {
          firstName: "จอห์น",
          middleName: "ปีเตอร์",
          lastName: "สมิธ",
        },
      },
      subjectsInCharge: [],
    },
  ];
  const classAdvisors: Array<Teacher> = [
    {
      id: 2,
      role: "teacher",
      prefix: "mister",
      name: {
        "en-US": { firstName: "Taradol", lastName: "Ranarintr" },
        th: { firstName: "ธราดล", lastName: "รานรินทร์" },
      },
      profile: "/images/dummybase/taradol.webp",
      classAdvisorAt: {
        id: 405,
        name: {
          "en-US": "M.405",
          th: "ม.405",
        },
      },
      subjectsInCharge: [
        {
          id: 25,
          code: {
            "en-US": "SOC31152",
            th: "ส31152",
          },
          name: {
            "en-US": {
              name: "Social Studies 2 (World)",
            },
            th: { name: "สังคมศึกษา 2 (พลโลก)" },
          },
          subjectSubgroup: {
            name: { "en-US": "Social Studies", th: "สังคมศึกษา" },
            subjectGroup: {
              name: { "en-US": "Social Studies", th: "สังคมศึกษา" },
            },
          },
        },
      ],
    },
    {
      id: 3,
      role: "teacher",
      prefix: "missus",
      name: {
        "en-US": { firstName: "Mattana", lastName: "Tatanyang" },
        th: { firstName: "มัทนา", lastName: "ต๊ะตันยาง" },
      },
      profile: "/images/dummybase/mattana.webp",
      classAdvisorAt: {
        id: 405,
        name: {
          "en-US": "M.405",
          th: "ม.405",
        },
      },
      subjectsInCharge: [],
    },
  ];

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
      teachers,
      classAdvisors,
    },
  };
};

export default StudentHome;
