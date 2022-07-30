// Modules
import { AnimatePresence, motion } from "framer-motion";

import { GetServerSideProps, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { useEffect, useState } from "react";

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

// Animations
import { animationTransition } from "@utils/animations/config";

// Backend
import { getSchedule } from "@utils/backend/schedule/schedule";

// Types
import { NewsListNoDate, StudentFormItem } from "@utils/types/news";
import { Teacher } from "@utils/types/person";
import { Schedule } from "@utils/types/schedule";
import { getTeacherByCookie } from "@utils/backend/person/teacher";

const TeacherHome: NextPage<{
  user: Teacher;
  studentForms: StudentFormItem[];
  news: NewsListNoDate;
}> = ({ user, studentForms, news }) => {
  const { t } = useTranslation("common");

  const day = new Date().getDay() as Day;
  const [schedule, setSchedule] = useState<Schedule>({
    content: [{ day, content: [] }],
  });
  useEffect(() => {
    const fetchAndSetSchedule = async () =>
      setSchedule(await getSchedule("teacher", user.id, day));
    fetchAndSetSchedule();
  }, []);

  // Dialog control
  const [showChangePassword, setShowChangePassword] = useState<boolean>(false);
  const [showEditProfile, setShowEditProfile] = useState<boolean>(false);
  const [showLogOut, setShowLogOut] = useState<boolean>(false);

  return (
    <>
      <Head>
        <title>{t("brand.name", { ns: "common" })}</title>
      </Head>

      {/* Content */}
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
        <TeacherClassSection studentForms={studentForms} />
        <NewsSection news={news} />
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
  const { data: user } = await getTeacherByCookie(req);
  const studentForms: StudentFormItem[] = [];
  const news: NewsListNoDate = [];

  return {
    props: {
      ...(await serverSideTranslations(locale as string, [
        "common",
        "account",
        "news",
        "dashboard",
      ])),
      user,
      studentForms,
      news,
    },
  };
};

export default TeacherHome;
