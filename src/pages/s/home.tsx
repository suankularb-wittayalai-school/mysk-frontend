// Modules
import { getDay } from "date-fns";

import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { useEffect, useState } from "react";

// SK Components
import {
  Card,
  CardHeader,
  ChipFilterList,
  Header,
  MaterialIcon,
  RegularLayout,
  Section,
  Title,
  XScrollContent,
  LinkButton,
} from "@suankularb-components/react";

// Components
import NewsCard from "@components/NewsCard";
import Schedule from "@components/Schedule";
import TeacherCard from "@components/TeacherCard";
import ChangePassword from "@components/dialogs/ChangePassword";
import EditProfileDialog from "@components/dialogs/EditProfile";
import LogOutDialog from "@components/dialogs/LogOut";

// Types
import { NewsList } from "@utils/types/news";
import { Student, Teacher } from "@utils/types/person";
import { Schedule as ScheduleType } from "@utils/types/schedule";

// Helpers
import { filterNews } from "@utils/helpers/filter-news";
import UserSection from "@components/home-sections/UserSection";

const NewsSection = (): JSX.Element => {
  const { t } = useTranslation("dashboard");
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
  const [newsFilter, setNewsFilter] = useState<Array<string>>([]);
  const [filteredNews, setFilteredNews] = useState<NewsList>(news);

  useEffect(
    () =>
      filterNews(news, newsFilter, (newNews: NewsList) =>
        setFilteredNews(newNews)
      ),

    // Adding `news` as a dependency causes an inifinie loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [newsFilter]
  );

  return (
    <Section>
      <Header
        icon={<MaterialIcon icon="newspaper" allowCustomSize={true} />}
        text={t("news.title")}
      />
      <ChipFilterList
        choices={[
          { id: "news", name: t("news.filter.news") },
          { id: "form", name: t("news.filter.forms") },
          { id: "payment", name: t("news.filter.payments") },
          [
            { id: "not-done", name: t("news.filter.amountDone.notDone") },
            { id: "done", name: t("news.filter.amountDone.done") },
          ],
        ]}
        onChange={(newFilter: Array<string>) => setNewsFilter(newFilter)}
        scrollable={true}
      />
      {filteredNews.length == 0 ? (
        <ul className="px-4">
          <li className="grid h-[13.75rem] place-content-center rounded-xl bg-surface-1 text-center text-on-surface">
            {t("news.noRelevantNews")}
          </li>
        </ul>
      ) : (
        <XScrollContent>
          {filteredNews.map((newsItem) => (
            <li key={newsItem.id}>
              <NewsCard newsItem={newsItem} btnType="tonal" />
            </li>
          ))}
        </XScrollContent>
      )}
      <div className="flex flex-row items-center justify-end gap-2">
        <LinkButton
          label={t("news.action.seeAll")}
          type="filled"
          url="/news"
          LinkElement={Link}
        />
      </div>
    </Section>
  );
};

const ClassSection = (): JSX.Element => {
  const { t } = useTranslation("dashboard");
  const schedule: ScheduleType = {
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

  return (
    <Section>
      <Header
        icon={<MaterialIcon icon="groups" allowCustomSize={true} />}
        text={t("class.title")}
      />
      <Schedule schedule={schedule} role="student" />
      <div className="flex flex-row flex-wrap items-center justify-end gap-2">
        <LinkButton
          label={t("class.action.seeSchedule")}
          type="outlined"
          url="/405/schedule"
          LinkElement={Link}
        />
        <LinkButton
          label={t("class.action.seeClassDetail")}
          type="filled"
          url="/405/class"
          LinkElement={Link}
        />
      </div>
    </Section>
  );
};

const ClassAdvisorsCard = (): JSX.Element => {
  const locale = useRouter().locale == "th" ? "th" : "en-US";
  const { t } = useTranslation(["dashboard", "common"]);

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
      subjectsInCharge: [],
    },
  ];

  return (
    <Card type="stacked" className="h-fit">
      <CardHeader
        icon={<MaterialIcon icon="group" />}
        title={
          <h3 className="text-lg font-medium">{t("teachers.classAdvisors")}</h3>
        }
        className="font-display"
      />
      <div
        className={`overflow-x-hidden rounded-b-xl ${
          classAdvisors.length > 2
            ? "aspect-[2/1] overflow-y-auto"
            : "overflow-y-hidden"
        }`}
      >
        <div className="grid grid-cols-2 p-[2px]">
          {/* Loop through the array of Class Advisors */}
          {classAdvisors.map((teacher) => (
            <div
              key={teacher.id}
              className="relative aspect-square bg-tertiary-container"
            >
              {/* Photo */}
              {teacher.profile && (
                <Image src={teacher.profile} layout="fill" alt="" />
              )}

              {/* Name bar */}
              <div
                className="absolute bottom-0 flex w-full flex-row items-center justify-between
                  gap-2 bg-[#c1c7cecc] p-2 text-on-surface-variant backdrop-blur-sm dark:bg-[#41484dcc]"
              >
                {/* Name */}
                <h4 className="flex flex-col font-display font-medium leading-none">
                  <span className="max-lines-1 text-lg">
                    {teacher.name[locale].firstName}{" "}
                    {(teacher.name[locale].middleName || "")[0]}
                  </span>
                  <span className="max-lines-1 text-base">
                    {teacher.name[locale].lastName}
                  </span>
                </h4>
                {/* Go to Teacher button */}
                <div>
                  <LinkButton
                    type="tonal"
                    name={t("seeDetails", { ns: "common" })}
                    iconOnly
                    icon={<MaterialIcon icon="arrow_forward" />}
                    url={`/teacher/${teacher.id}`}
                    LinkElement={Link}
                    className="!h-8 !w-8"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

const TeachersSection = (): JSX.Element => {
  const { t } = useTranslation("dashboard");
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

  return (
    <Section>
      <Header
        icon={<MaterialIcon icon="school" allowCustomSize={true} />}
        text={t("teachers.title")}
      />
      <div className="flex flex-col justify-start gap-3 !px-0 sm:grid sm:grid-cols-2 md:grid-cols-4">
        <div className="px-4 sm:px-0">
          <ClassAdvisorsCard />
        </div>
        {teachers.length == 0 ? (
          <div
            className="mx-4 grid place-items-center rounded-xl bg-surface-1 p-8 text-center text-on-surface-variant
              sm:mx-0 md:col-span-3"
          >
            <p>{t("teachers.noTeachers")}</p>
          </div>
        ) : (
          <div
            className="scroll-w-0 scroll-desktop h-full overflow-x-auto
              sm:relative sm:overflow-y-scroll
              md:static md:col-span-3 md:overflow-y-visible"
          >
            <ul
              className="flex h-full w-fit flex-row gap-3 px-4
                sm:absolute sm:top-0 sm:w-full sm:grid-rows-2 sm:flex-col sm:pl-0 sm:pr-2
                md:static md:grid md:grid-cols-9 md:pr-0"
            >
              {teachers.map((teacher, index) => (
                <li
                  key={teacher.id}
                  className={`w-80 sm:w-full md:col-span-3 ${
                    index == 0
                      ? "md:col-start-1"
                      : index == 1
                      ? "md:col-start-5"
                      : index == 2
                      ? "md:col-start-3"
                      : index == 3
                      ? "md:col-start-7"
                      : "md:hidden"
                  }`}
                >
                  <TeacherCard teacher={teacher} hasArrow />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="flex flex-row items-center justify-end gap-2">
        <LinkButton
          label={t("teachers.action.seeAll")}
          type="filled"
          url="/teachers"
          LinkElement={Link}
        />
      </div>
    </Section>
  );
};

// Page
const StudentHome: NextPage<{ user: Student | Teacher }> = ({ user }) => {
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
        <NewsSection />
        <ClassSection />
        <TeachersSection />
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

  return {
    props: {
      ...(await serverSideTranslations(locale as string, [
        "common",
        "account",
        "news",
        "dashboard",
      ])),
      user,
    },
  };
};

export default StudentHome;
