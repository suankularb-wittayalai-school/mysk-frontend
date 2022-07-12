// Modules
import { getDay } from "date-fns";

import { AnimatePresence, motion } from "framer-motion";

import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

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

// Animations
import { animationTransition } from "@utils/animations/config";
import { fromUpToDown } from "@utils/animations/slide";

// Types
import { NewsList } from "@utils/types/news";
import { Teacher } from "@utils/types/person";
import { Schedule } from "@utils/types/schedule";

// Helpers
import { createTitleStr } from "@utils/helpers/title";

// Hooks
import { useStudentAccount } from "@utils/hooks/auth";

// Page
const StudentHome: NextPage<{
  news: NewsList;
  schedule: Schedule;
  teachers: Array<Teacher>;
  classAdvisors: Array<Teacher>;
}> = ({ news, schedule, teachers, classAdvisors }) => {
  const { t } = useTranslation(["dashboard", "common"]);
  const router = useRouter();

  // Dialog controls
  const [showChangePassword, setShowChangePassword] = useState<boolean>(false);
  const [showEditProfile, setShowEditProfile] = useState<boolean>(false);
  const [showLogOut, setShowLogOut] = useState<boolean>(false);
  const [user] = useStudentAccount({ loginRequired: true });

  return (
    <>
      {/* Title */}
      <Head>
        <title>{createTitleStr(t("title"), t)}</title>
      </Head>
      <AnimatePresence>
        {user && (
          <>
            {/* Content */}
            <motion.div
              initial="hidden"
              animate="enter"
              exit="exit"
              variants={fromUpToDown}
              transition={animationTransition}
            >
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
                <TeachersSection
                  teachers={teachers}
                  classAdvisors={classAdvisors}
                />
              </RegularLayout>
            </motion.div>
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
              onClose={() => setShowLogOut(false)}
            />
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const news: NewsList = [];
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

      // (@SiravitPhokeed)
      // Apparently NextJS doesn’t serialize Date when in development
      // It does in production, though.
      // ---
      // Update: this isn’t a problem anymore as Supabase sends in
      // dates as a string, which NextJS can deal with.
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
