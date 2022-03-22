// Modules
import { isPast, isThisYear } from "date-fns";

import { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import { Trans, useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { useEffect, useState } from "react";

// SK Components
import {
  Button,
  Card,
  CardHeader,
  CardSupportingText,
  CardActions,
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
import Schedule from "@components/Schedule";
import TeacherCard from "@components/TeacherCard";
import ChangePassword from "@components/dialogs/ChangePassword";
import EditProfileDialog from "@components/dialogs/EditProfile";
import LogOutDialog from "@components/dialogs/LogOut";

// Types
import { NewsList } from "@utils/types/news";
import { Student, Teacher } from "@utils/types/person";
import { Schedule as ScheduleType } from "@utils/types/schedule";
import DiscardDraft from "@components/dialogs/DiscardDraft";

const UserActions = ({
  setshowChangePassword,
  setShowEditProfile,
  setShowLogOut,
  className,
}: {
  setshowChangePassword: Function;
  setShowEditProfile: Function;
  setShowLogOut: Function;
  className?: string;
}): JSX.Element => {
  const { t } = useTranslation("dashboard");

  return (
    <div
      className={`flex-row flex-wrap items-center justify-end gap-2 ${
        className || "flex"
      }`}
    >
      <Button
        name={t("user.action.changePassword")}
        type="text"
        onClick={() => setshowChangePassword(true)}
        className="!hidden sm:!flex"
      />
      <Button
        name={t("user.action.requestEdit")}
        type="outlined"
        icon={<MaterialIcon icon="edit" />}
        onClick={() => setShowEditProfile(true)}
      />
      <Button
        name={t("user.action.logOut")}
        type="filled"
        icon={<MaterialIcon icon="logout" />}
        onClick={() => setShowLogOut(true)}
        className="!bg-error !text-on-error"
      />
    </div>
  );
};

const UserSection = ({
  setShowChangePassword,
  setShowEditProfile,
  setShowLogOut,
}: {
  setShowChangePassword: Function;
  setShowEditProfile: Function;
  setShowLogOut: Function;
}): JSX.Element => {
  const locale = useRouter().locale == "th" ? "th" : "en-US";
  const { t } = useTranslation(["dashboard", "common"]);

  // Dummybase
  const user: Student | Teacher = {
    id: 9,
    name: {
      "en-US": { firstName: "Sadudee", lastName: "Theparree" },
      th: { firstName: "สดุดี", lastName: "เทพอารีย์" },
    },
    profile: "/images/dummybase/sadudee.webp",
    class: "405",
    classNo: 11,
  };
  const notifCount = 1;

  return (
    <>
      <Head>
        <title>
          {t("title")} - {t("brand.name", { ns: "common" })}
        </title>
      </Head>
      <Section>
        <div className="grid grid-cols-[1fr_3fr] items-stretch gap-4 sm:gap-6 md:grid-cols-[1fr_5fr]">
          <div>
            <div className="container-tertiary relative aspect-square w-full overflow-hidden rounded-4xl sm:rounded-8xl">
              <Image
                src={user.profile ? user.profile : "/images/common/avatar.svg"}
                layout="fill"
                alt={t("user.profileAlt")}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-grow flex-col gap-2">
              <div className="flex flex-col">
                <h2 className="max-lines-1 break-all font-display text-4xl font-bold">
                  {user.name[locale].firstName} {user.name[locale].lastName}
                </h2>
                <p className="font-display text-xl">
                  <Trans i18nKey="user.classAndNo" ns="dashboard">
                    M.{{ class: user.class }} No.{{ classNo: user.classNo }}
                  </Trans>
                </p>
              </div>
              {/* FIXME: Replace the following element with `Chip` when you can use a JSX element as `name` */}
              <button
                className="container-error has-action--tertiary hidden w-fit flex-row items-center gap-1 rounded-xl p-2
                  hover:shadow focus:shadow-none sm:flex"
              >
                <MaterialIcon
                  icon={
                    notifCount > 0 ? "notifications_active" : "notifications"
                  }
                  className="text-error"
                />
                <p>
                  <Trans
                    i18nKey="user.hasNotifications"
                    ns="dashboard"
                    count={notifCount}
                  >
                    You have {{ notifCount }} notifications.
                  </Trans>
                </p>
                <MaterialIcon icon="arrow_forward" className="text-error" />
              </button>
            </div>
            <UserActions
              className="hidden md:flex"
              setshowChangePassword={setShowChangePassword}
              setShowEditProfile={setShowEditProfile}
              setShowLogOut={setShowLogOut}
            />
          </div>
        </div>
        <UserActions
          className="flex md:hidden"
          setshowChangePassword={setShowChangePassword}
          setShowEditProfile={setShowEditProfile}
          setShowLogOut={setShowLogOut}
        />
      </Section>
    </>
  );
};

const NewsSection = (): JSX.Element => {
  const locale = useRouter().locale == "en-US" ? "en-US" : "th";
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
            "ประกาศเกียรติคุณโรงเรียนสวนกุหลาบวิทยาลัย ประจปีการศึกษา 2563",
        },
      },
    },
  ];
  const [newsFilter, setNewsFilter] = useState<Array<string>>([]);
  const [filteredNews, setFilteredNews] = useState<NewsList>(news);
  const { t } = useTranslation("dashboard");

  useEffect(
    () => {
      // Reset filtered news if all filters are deselected
      if (newsFilter.length == 0) {
        setFilteredNews(news);

        // Handles done
      } else if (
        newsFilter.includes("not-done") ||
        newsFilter.includes("done")
      ) {
        if (newsFilter.length > 1) {
          setFilteredNews(
            news.filter(
              (newsItem) =>
                newsFilter.includes(newsItem.type) &&
                (newsFilter.includes("done")
                  ? newsItem.done
                  : newsItem.done == false)
            )
          );
        } else {
          setFilteredNews(
            news.filter((newsItem) =>
              newsFilter.includes("done")
                ? newsItem.done
                : newsItem.done == false
            )
          );
        }
      }

      // Handles types
      else {
        setFilteredNews(
          news.filter((newsItem) => newsFilter.includes(newsItem.type))
        );
      }
    },

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
          <li className="bg-surface-1 grid h-[13.75rem] place-content-center rounded-xl text-center text-on-surface">
            {t("news.noRelevantNews")}
          </li>
        </ul>
      ) : (
        <XScrollContent>
          {filteredNews.map((newsItem) => (
            <li key={`${newsItem.type}-${newsItem.id}`}>
              <Card type="stacked" appearance="outlined">
                <CardHeader
                  icon={
                    newsItem.type == "form" ? (
                      <MaterialIcon icon="edit" />
                    ) : newsItem.type == "payment" ? (
                      <MaterialIcon icon="account_balance" />
                    ) : (
                      <MaterialIcon icon="information" />
                    )
                  }
                  title={
                    <h3 className="text-lg font-medium">
                      {newsItem.content[locale].title}
                    </h3>
                  }
                  label={
                    <div className="flex divide-x divide-outline">
                      <span className="pr-2">
                        {t(`news.itemType.${newsItem.type}`)}
                      </span>
                      <time className="pl-2 text-outline">
                        {newsItem.postDate.toLocaleDateString(locale, {
                          year: isThisYear(newsItem.postDate)
                            ? undefined
                            : "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </time>
                    </div>
                  }
                  end={
                    newsItem.type != "news" ? (
                      <div
                        className={`${
                          newsItem.done
                            ? "container-primary"
                            : (newsItem.type == "form" ||
                                newsItem.type == "payment") &&
                              newsItem.dueDate &&
                              isPast(newsItem.dueDate)
                            ? "bg-error text-on-error"
                            : "container-tertiary"
                        } grid aspect-square w-10 place-content-center rounded-xl`}
                      >
                        {newsItem.done ? (
                          <MaterialIcon icon="done" />
                        ) : (
                          <MaterialIcon icon="close" />
                        )}
                      </div>
                    ) : undefined
                  }
                  className="font-display"
                />
                <CardSupportingText>
                  <p className="max-lines-2">
                    {
                      newsItem.content[locale == "en-US" ? "en-US" : "th"]
                        .supportingText
                    }
                  </p>
                </CardSupportingText>
                <CardActions>
                  <LinkButton
                    name={t(
                      `news.itemAction.${newsItem.type}${
                        newsItem.type != "news"
                          ? `.${newsItem.done ? "edit" : "do"}`
                          : ""
                      }`
                    )}
                    type="filled"
                    url={`/${newsItem.type}/${newsItem.id}`}
                    LinkElement={Link}
                    className="container-secondary"
                  />
                </CardActions>
              </Card>
            </li>
          ))}
        </XScrollContent>
      )}
      <div className="flex flex-row items-center justify-end gap-2">
        <LinkButton
          name={t("news.action.seeAll")}
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
        day: 1,
        content: [
          {
            periodStart: 1,
            periodEnd: 1,
            subject: {
              name: {
                "en-US": { name: "English" },
                th: { name: "ภาษาอังกฤษ" },
              },
              teachers: [
                {
                  id: 1,
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
              ],
              subjectSubgroup: {
                name: {
                  "en-US": "English",
                  th: "ภาษาอังกฤษ",
                },
                subjectGroup: {
                  name: {
                    "en-US": "Foreign Languages",
                    th: "ภาษาต่างประเทศ",
                  },
                },
              },
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
      <Schedule schedule={schedule} />
      <div className="flex flex-row flex-wrap items-center justify-end gap-2">
        <LinkButton
          name={t("class.action.seeSchedule")}
          type="outlined"
          url="/405/schedule"
          LinkElement={Link}
        />
        <LinkButton
          name={t("class.action.seeClassDetail")}
          type="filled"
          url="/405/class"
          LinkElement={Link}
        />
      </div>
    </Section>
  );
};

const ClassCounselorsCard = (): JSX.Element => {
  const locale = useRouter().locale == "th" ? "th" : "en-US";
  const { t } = useTranslation(["dashboard", "common"]);
  const classAdvisors: Array<Teacher> = [
    {
      id: 2,
      name: {
        "en-US": { firstName: "Taradol", lastName: "Ranarintr" },
        th: { firstName: "ธราดล", lastName: "รานรินทร์" },
      },
      profile: "/images/dummybase/taradol.webp",
      subjectsInCharge: [
        {
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
        className={`overflow-x-hidden rounded-b-2xl ${
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
                <Link href={`/teacher/${teacher.id}`}>
                  <a
                    aria-label={t("seeDetails", { ns: "common" })}
                    className="btn btn--filled container-secondary !p-1 text-2xl"
                  >
                    <MaterialIcon
                      icon="arrow_forward"
                      allowCustomSize={true}
                      className="!block"
                    />
                  </a>
                </Link>
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
          <ClassCounselorsCard />
        </div>
        {teachers.length == 0 ? (
          <div
            className="bg-surface-1 mx-4 grid place-items-center rounded-xl p-8 text-center text-on-surface-variant
              sm:mx-0 md:col-span-3"
          >
            <p>{t("teachers.noTeachers")}</p>
          </div>
        ) : (
          <div
            className="scroll-w-0 h-full overflow-x-auto
            sm:relative sm:overflow-y-scroll
            md:static md:col-span-3 md:overflow-y-visible"
          >
            <ul
              className="flex h-full w-fit flex-row gap-3
              px-4 sm:absolute sm:top-0 sm:w-full sm:grid-rows-2 sm:flex-col
              sm:px-0 md:static md:grid md:grid-cols-9 md:pr-0"
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
          name={t("teachers.action.seeAll")}
          type="filled"
          url="/teachers"
          LinkElement={Link}
        />
      </div>
    </Section>
  );
};

// Page
const Home: NextPage = () => {
  const { t } = useTranslation("common");

  // Dialog controls
  const [showChangePassword, setShowChangePassword] = useState<boolean>(false);
  const [showEditProfile, setShowEditProfile] = useState<boolean>(false);
  const [showLogOut, setShowLogOut] = useState<boolean>(false);

  return (
    <>
      {/* Content */}
      <RegularLayout
        Title={
          <Title
            name={{ title: t("brand.name") }}
            pageIcon={<MaterialIcon icon="home" />}
            backGoesTo="/"
            LinkElement={Link}
            className="sm:!hidden"
          />
        }
      >
        <UserSection
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
        userRole="student"
        show={showEditProfile}
        onClose={() => setShowEditProfile(false)}
      />
      <LogOutDialog show={showLogOut} onClose={() => setShowLogOut(false)} />
    </>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, [
      "common",
      "account",
      "dashboard",
    ])),
  },
});

export default Home;
