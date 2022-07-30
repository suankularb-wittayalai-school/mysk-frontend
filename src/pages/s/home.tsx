// Modules
import { getDay } from "date-fns";

import { GetServerSideProps, NextPage } from "next";
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
import EditSelfDialog from "@components/dialogs/EditSelf";
import LogOutDialog from "@components/dialogs/LogOut";
import UserSection from "@components/home-sections/UserSection";
import NewsSection from "@components/home-sections/NewsSection";
import StudentClassSection from "@components/home-sections/StudentClass";
import TeachersSection from "@components/home-sections/TeachersSection";

// Types
import { NewsListNoDate } from "@utils/types/news";
import { Student, Teacher } from "@utils/types/person";
import { Schedule } from "@utils/types/schedule";

// Helpers
import { createTitleStr } from "@utils/helpers/title";

// Hooks
import { getStudentByCookie } from "@utils/backend/person/student";

// Page
const StudentHome: NextPage<{
  user: Student;
  news: NewsListNoDate;
  schedule: Schedule;
  teachers: Teacher[];
  classAdvisors: Teacher[];
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
        <title>{createTitleStr(t("title"), t)}</title>
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
        <NewsSection news={news} showFilters />
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

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  req,
}) => {
  const { data: user } = await getStudentByCookie(req);
  const news: NewsListNoDate = [];
  const schedule: Schedule = {
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
      user,
      news,
      schedule,
      teachers,
      classAdvisors,
    },
  };
};

export default StudentHome;
