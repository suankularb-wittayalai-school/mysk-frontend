// Modules
import { getDay } from "date-fns";

import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { useEffect, useState } from "react";

// SK Components
import {
  MaterialIcon,
  RegularLayout,
  Title,
} from "@suankularb-components/react";

// Supabase imports
import { supabase } from "@utils/supabaseClient";

// Components
import ChangePassword from "@components/dialogs/ChangePassword";
import EditSelfDialog from "@components/dialogs/EditSelf";
import LogOutDialog from "@components/dialogs/LogOut";
import UserSection from "@components/home-sections/UserSection";
import NewsSection from "@components/home-sections/NewsSection";
import StudentClassSection from "@components/home-sections/StudentClass";
import TeachersSection from "@components/home-sections/TeachersSection";

// Types
import { NewsList } from "@utils/types/news";
import { Student, Teacher } from "@utils/types/person";
import { StudentSchedule } from "@utils/types/schedule";
import { StudentDB } from "@utils/types/database/person";

// External Types
import { Session } from "@supabase/supabase-js";

// Helper functions
import { db2Student } from "@utils/backend/database";
import { useSession, useStudentAccount } from "@utils/hooks/auth";

// Page
const StudentHome: NextPage<{
  // user: Student | Teacher;
  news: NewsList;
  schedule: StudentSchedule;
  teachers: Array<Teacher>;
  classAdvisors: Array<Teacher>;
}> = ({ news, schedule, teachers, classAdvisors }) => {
  const { t } = useTranslation(["dashboard", "common"]);
  const router = useRouter();

  // Dialog controls
  const [showChangePassword, setShowChangePassword] = useState<boolean>(false);
  const [showEditProfile, setShowEditProfile] = useState<boolean>(false);
  const [showLogOut, setShowLogOut] = useState<boolean>(false);
  const [user, session] = useStudentAccount({ loginRequired: true });

  if (!user) return <></>;

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
      <EditSelfDialog
        user={user}
        show={showEditProfile}
        onClose={() => setShowEditProfile(false)}
      />
      <LogOutDialog show={showLogOut} onClose={() => setShowLogOut(false)} />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const news: NewsList = [];
  const schedule: StudentSchedule = {
    id: 0,
    content: [
      {
        day: getDay(new Date()),
        content: [],
      },
    ],
  };
  const teachers: Array<Teacher> = [];
  const classAdvisors: Array<Teacher> = [];

  return {
    props: {
      ...(await serverSideTranslations(locale as string, [
        "common",
        "account",
        "news",
        "dashboard",
      ])),
      // user,
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
