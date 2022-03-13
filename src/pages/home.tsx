// Modules
import { isPast, isThisYear } from "date-fns";
import { NextPage } from "next";
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

// Types
import { NewsList } from "@utils/types/news";
import { Teacher } from "@utils/types/person";
import { Schedule as ScheduleType } from "@utils/types/schedule";
import TeacherCard from "@components/TeacherCard";

const UserActions = ({ className }: { className: string }): JSX.Element => {
  const { t } = useTranslation("dashboard");
  const router = useRouter();

  return (
    <div
      className={`flex-row flex-wrap items-center justify-end gap-2 ${
        className || "flex"
      }`}
    >
      <Button
        name={t("user.action.changePassword")}
        type="text"
        onClick={() => {}}
        className="!hidden sm:!flex"
      />
      <Button
        name={t("user.action.requestEdit")}
        type="outlined"
        icon={<MaterialIcon icon="edit" />}
        onClick={() => {}}
      />
      <Button
        name={t("user.action.logOut")}
        type="filled"
        icon={<MaterialIcon icon="logout" />}
        onClick={() => router.push("/")}
        className="!bg-error !text-on-error"
      />
    </div>
  );
};

const UserSection = (): JSX.Element => {
  const locale = useRouter().locale == "th" ? "th" : "en-US";
  const { t } = useTranslation("dashboard");

  // Dummybase
  const user = {
    name: {
      "en-US": { firstName: "Sadudee", lastName: "Theparree" },
      th: { firstName: "สดุดี", lastName: "เทพอารีย์" },
    },
    class: "405",
    classNo: "11",
  };
  const notifCount = 1;

  return (
    <Section>
      <div className="grid grid-cols-[1fr_3fr] items-stretch gap-4 sm:gap-6 md:grid-cols-[1fr_5fr]">
        <div>
          <div className="container-tertiary relative aspect-square w-full overflow-hidden rounded-4xl sm:rounded-8xl">
            <Image
              src="/images/dummybase/sadudee.jpg"
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
            {/* TODO: Replace the following element with `Chip` once it is added to `@suankularb-components/react */}
            <div className="container-error hidden w-fit flex-row items-center gap-1 rounded-xl p-2 sm:flex">
              <MaterialIcon
                icon={notifCount > 0 ? "notifications_active" : "notifications"}
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
            </div>
          </div>
          <UserActions className="hidden md:flex" />
        </div>
      </div>
      <UserActions className="flex md:hidden" />
    </Section>
  );
};

const NewsSection = (): JSX.Element => {
  const locale = useRouter().locale;
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

  useEffect(() => {
    // Reset filtered news if all filters are deselected
    if (newsFilter.length == 0) {
      setFilteredNews(news);

      // Handles done
    } else if (newsFilter.includes("not-done") || newsFilter.includes("done")) {
      if (newsFilter.length > 1) {
        setFilteredNews(
          news.filter(
            (newsItem) =>
              newsFilter.includes(newsItem.type) &&
              (newsFilter.includes("done") ? newsItem.done : !newsItem.done)
          )
        );
      } else {
        setFilteredNews(
          news.filter((newsItem) =>
            newsFilter.includes("done") ? newsItem.done : !newsItem.done
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
  }, [newsFilter]);

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
                    {newsItem.content[locale == "en-US" ? "en-US" : "th"].title}
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
  const classAdvisors: Array<Teacher> = [
    {
      id: 2,
      name: {
        "en-US": { firstName: "Taradol", lastName: "Ranarintr" },
        th: { firstName: "ธราดล", lastName: "รานรินทร์" },
      },
      profile: "/images/dummybase/taradol.jpg",
    },
    {
      id: 3,
      name: {
        "en-US": { firstName: "Mattana", lastName: "Tatanyang" },
        th: { firstName: "มัทนา", lastName: "ต๊ะตันยาง" },
      },
      profile: "/images/dummybase/mattana.jpg",
    },
  ];

  return (
    <Card type="stacked">
      <CardHeader
        icon={<MaterialIcon icon="group" />}
        title={<h3 className="text-lg font-medium">ครูที่ปรึกษา</h3>}
        label="" // FIXME: When Label is no longer necessary, remove this
        className="font-display"
      />
      <div
        className={`aspect-[2/1] overflow-x-hidden rounded-b-2xl ${
          classAdvisors.length > 2 ? "overflow-y-auto" : "overflow-y-hidden"
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
              {teacher.profile && <Image src={teacher.profile} layout="fill" />}
              {/* Darkens photo in dark mode */}
              <div className="pointer-events-none absolute h-full w-full dark:bg-[#00000033]" />
              {/* Name bar */}
              <div
                className="absolute bottom-0 flex w-full flex-row items-center justify-between gap-2
                  bg-[#c1c7cecc] p-2 text-on-surface-variant backdrop-blur-sm dark:bg-[#41484dcc]"
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
                <button className="btn btn--filled container-secondary !p-1 text-2xl">
                  <MaterialIcon
                    icon="arrow_forward"
                    allowCustomSize={true}
                    className="!block"
                  />
                </button>
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

  return (
    <Section>
      <Header
        icon={<MaterialIcon icon="school" allowCustomSize={true} />}
        text={t("teachers.title")}
      />
      <div className="flex flex-col gap-3 sm:grid sm:grid-cols-2 md:grid-cols-4">
        <ClassCounselorsCard />
        <div className="flex flex-col justify-between md:col-span-3">
          <div className="flex flex-col gap-3 sm:grid sm:grid-cols-6 md:grid-cols-9">
            <TeacherCard className="col-span-3" />
          </div>
          <div className="flex flex-col gap-3 sm:grid sm:grid-cols-6 md:grid-cols-9">
            <TeacherCard className="col-span-3" />
          </div>
        </div>
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

  return (
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
      <UserSection />
      <NewsSection />
      <ClassSection />
      <TeachersSection />
    </RegularLayout>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "dashboard"])),
  },
});

export default Home;
