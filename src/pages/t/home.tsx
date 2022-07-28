// Modules

import { AnimatePresence, motion } from "framer-motion";

import { GetStaticProps, NextPage } from "next";
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
import { NewsList, NewsListNoDate, StudentFormItem } from "@utils/types/news";
import { Schedule } from "@utils/types/schedule";

// Hooks
import { useTeacherAccount } from "@utils/hooks/auth";

const TeacherHome: NextPage<{
  studentForms: StudentFormItem[];
  news: NewsListNoDate;
}> = ({ studentForms, news }) => {
  const { t } = useTranslation("common");
  const [user] = useTeacherAccount({ loginRequired: true });

  const day = new Date().getDay() as Day;
  const [schedule, setSchedule] = useState<Schedule>({
    content: [{ day, content: [] }],
  });
  useEffect(() => {
    const fetchAndSetSchedule = async () =>
      user && setSchedule(await getSchedule("teacher", user.id, day));
    fetchAndSetSchedule();
  }, [user]);

  // Dialog control
  const [showChangePassword, setShowChangePassword] = useState<boolean>(false);
  const [showEditProfile, setShowEditProfile] = useState<boolean>(false);
  const [showLogOut, setShowLogOut] = useState<boolean>(false);

  return (
    <>
      <Head>
        <title>{t("brand.name", { ns: "common" })}</title>
      </Head>
      <AnimatePresence>
        {user && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={animationTransition}
            >
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
                <NewsSection news={news} />
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
  const studentForms: StudentFormItem[] = [
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
  const news: NewsListNoDate = [];

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
      // So I guess I’ll keep this workaround, well, around…
      studentForms: studentForms.map((newsItem) => ({
        ...newsItem,
        postDate: newsItem.postDate.getTime(),
      })),
      news,
    },
  };
};

export default TeacherHome;
