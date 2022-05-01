// Modules
import { getDay } from "date-fns";

import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { useEffect, useState } from "react";

// Supabase imports
import { supabase } from "@utils/supabaseClient";

// SK Components
import {
  MaterialIcon,
  RegularLayout,
  Title,
} from "@suankularb-components/react";

// Components
import ChangePassword from "@components/dialogs/ChangePassword";
import EditSelfDialog from "@components/dialogs/EditSelf";
import LogOutDialog from "@components/dialogs/LogOut";
import NewsSection from "@components/home-sections/NewsSection";
import SubjectsSection from "@components/home-sections/SubjectsSection";
import TeacherClassSection from "@components/home-sections/TeacherClassSection";
import UserSection from "@components/home-sections/UserSection";

// Types
import { NewsList, StudentForm } from "@utils/types/news";
import { Teacher } from "@utils/types/person";
import { StudentSchedule } from "@utils/types/schedule";
import { Session } from "@supabase/supabase-js";

// helper function
import { db2teacher } from "@utils/backend/database";
import { TeacherDB } from "@utils/types/database/person";

const TeacherHome: NextPage<{
  // user: Teacher;
  schedule: StudentSchedule;
  studentForms: Array<StudentForm>;
  news: NewsList;
}> = ({ schedule, studentForms, news }) => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [showChangePassword, setShowChangePassword] = useState<boolean>(false);
  const [showEditProfile, setShowEditProfile] = useState<boolean>(false);
  const [showLogOut, setShowLogOut] = useState<boolean>(false);
  const [user, setUser] = useState<Teacher | null>(null);

  const [session, setSession] = useState<null | Session>(null);

  useEffect(() => {
    if (!supabase.auth.session()) {
      router.push("/");
    }

    setSession(supabase.auth.session());

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    if (session) {
      if (session.user?.user_metadata.role == "teacher") {
        supabase
          .from<TeacherDB>("teacher")
          .select(
            "id, teacher_id, people:person(*), SubjectGroup:subject_group(*)"
          )
          .eq("id", session.user?.user_metadata.teacher)
          .single()
          .then((res) => {
            if (res.error || !res.data) {
              console.log(res.error);
              return;
            }

            db2teacher(res.data).then((teacher) => {
              setUser(teacher);
            });
          });
      } else if (session.user?.user_metadata.role == "student") {
        router.push("/s/home");
      }
    }
  }, [session]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  if (!user) return <></>;

  return (
    <>
      <Head>
        <title>{t("brand.name", { ns: "common" })}</title>
      </Head>
      <RegularLayout
        Title={
          <Title
            name={{ title: t("brand.name") }}
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
        <SubjectsSection schedule={schedule} />
        <TeacherClassSection
          studentForms={studentForms.map((newsItem) => ({
            ...newsItem,
            postDate: new Date(newsItem.postDate),
          }))}
        />
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
      <EditSelfDialog
        user={user}
        show={showEditProfile}
        onClose={() => setShowEditProfile(false)}
      />
      <LogOutDialog
        show={showLogOut}
        onClose={() => {
          handleLogout();
          setShowLogOut(false);
        }}
      />
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
    teacherID: "skt420",
    classAdvisorAt: {
      id: 509,
      name: {
        "en-US": "M.509",
        th: "ม.509",
      },
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
  const studentForms: Array<StudentForm> = [
    {
      id: 5,
      type: "payment",
      postDate: new Date(2022, 0, 7),
      percentDone: 3,
      content: {
        "en-US": {
          title: "School Maintainance Payment",
        },
        th: {
          title: "การชำระเงินบำรุงการศึกษา",
        },
      },
    },
    {
      id: 3,
      type: "form",
      postDate: new Date(2020, 3, 14),
      percentDone: 96,
      content: {
        "en-US": {
          title: "Online Learning Readiness",
        },
        th: {
          title: "ความพร้อมการเรียนออนไลน์",
        },
      },
    },
  ];
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
  const schedule: StudentSchedule = {
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
      studentForms: studentForms.map((newsItem) => ({
        ...newsItem,
        postDate: newsItem.postDate.getTime(),
      })),
      news: news.map((newsItem) => ({
        ...newsItem,
        postDate: newsItem.postDate.getTime(),
      })),
      schedule,
    },
  };
};

export default TeacherHome;
