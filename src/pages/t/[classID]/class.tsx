// Modules
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { isThisYear } from "date-fns";

// SK Components
import {
  Button,
  Card,
  CardHeader,
  ChipFilterList,
  Header,
  LinkButton,
  MaterialIcon,
  RegularLayout,
  Search,
  Section,
  Table,
  Title,
  XScrollContent,
} from "@suankularb-components/react";

// External Libraries
import { useEffect, useState } from "react";

// Components
import ContactChip from "@components/ContactChip";
import TeacherCard from "@components/TeacherCard";

// Helpers
import { nameJoiner } from "@utils/helpers/name";

// Types
import { Class as ClassType } from "@utils/types/class";
import { Contact } from "@utils/types/contact";
import { Student, Teacher } from "@utils/types/person";
import { StudentForm } from "@utils/types/news";

const StudentFormCard = ({ form }: { form: StudentForm }): JSX.Element => {
  const locale = useRouter().locale as "en-US" | "th";
  const { t } = useTranslation("news");

  return (
    <Card type="horizontal">
      <CardHeader
        // Title
        title={
          <h3 className="text-lg font-bold break-all">
            {form.content[locale]?.title || form.content.th.title}
          </h3>
        }
        // Type and post date
        label={
          <div className="flex divide-x divide-outline">
            <span className="pr-2">{t(`itemType.${form.type}`)}</span>
            <time className="pl-2 text-outline">
              {form.postDate.toLocaleDateString(locale, {
                year: isThisYear(form.postDate) ? undefined : "numeric",
                month: "short",
                day: "numeric",
              })}
            </time>
          </div>
        }
        // Completion and link
        end={
          <div className="flex flex-row items-center gap-2">
            <div
              className={`rounded-lg py-2 px-3 font-sans font-bold ${
                form.percentDone < 25
                  ? "error"
                  : form.percentDone < 50
                  ? "container-tertiary"
                  : "container-primary"
              }`}
            >
              {form.percentDone}%
            </div>
            <LinkButton
              name={t("action.seeDetails")}
              type="tonal"
              iconOnly
              icon={<MaterialIcon icon="arrow_forward" />}
              url={`/t/${form.type}/${form.id}`}
              LinkElement={Link}
            />
          </div>
        }
        className="font-display"
      />
    </Card>
  );
};

const FormSection = ({
  studentForms: forms,
}: {
  studentForms: Array<StudentForm>;
}): JSX.Element => {
  const { t } = useTranslation(["dashboard", "news", "class"]);
  const [newsFilter, setNewsFilter] = useState<Array<string>>([]);
  const [filteredNews, setFilteredNews] = useState<Array<StudentForm>>(forms);
  const locale = useRouter().locale as "en-US" | "th";

  useEffect(
    () => {
      // Reset filtered news if all filters are deselected
      if (newsFilter.length == 0) {
        setFilteredNews(forms);

        // Handles done
      } else if (
        newsFilter.includes("few-done") ||
        newsFilter.includes("most-done") ||
        newsFilter.includes("all-done")
      ) {
        if (newsFilter.length > 1) {
          setFilteredNews(
            forms.filter(
              (newsItem) =>
                newsFilter.includes(newsItem.type) &&
                (newsFilter.includes("few-done")
                  ? newsItem.percentDone < 25
                  : newsFilter.includes("most-done")
                  ? newsItem.percentDone >= 25 && newsItem.percentDone < 50
                  : newsFilter.includes("all-done") &&
                    newsItem.percentDone >= 50)
            )
          );
        } else {
          setFilteredNews(
            forms.filter((newsItem) =>
              newsFilter.includes("few-done")
                ? newsItem.percentDone < 25
                : newsFilter.includes("most-done")
                ? newsItem.percentDone >= 25 && newsItem.percentDone < 50
                : newsFilter.includes("all-done") && newsItem.percentDone >= 50
            )
          );
        }
      }

      // Handles types
      else {
        setFilteredNews(
          forms.filter((newsItem) => newsFilter.includes(newsItem.type))
        );
      }
    },

    // Adding `forms` as a dependency causes an inifinie loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [newsFilter]
  );

  return (
    <Section>
      <Header
        icon={<MaterialIcon icon="groups" allowCustomSize={true} />}
        text={t("studentForms.title", { ns: "class" })}
      />
      <ChipFilterList
        choices={[
          { id: "form", name: t("news.filter.forms") },
          { id: "payment", name: t("news.filter.payments") },
          [
            { id: "few-done", name: t("news.filter.amountDone.fewDone") },
            { id: "most-done", name: t("news.filter.amountDone.mostDone") },
            { id: "all-done", name: t("news.filter.amountDone.allDone") },
          ],
        ]}
        onChange={(newFilter: Array<string>) => setNewsFilter(newFilter)}
        scrollable={true}
      />
      {filteredNews.length == 0 ? (
        <ul className="px-4">
          <li
            className="grid h-[4.8125rem] place-content-center rounded-xl
              bg-surface-1 text-center text-on-surface"
          >
            {t("class.noRelevantForms")}
          </li>
        </ul>
      ) : (
        <XScrollContent>
          {filteredNews.map((form) => (
            <li key={form.id}>
              <StudentFormCard form={form} />
            </li>
          ))}
        </XScrollContent>
      )}
    </Section>
  );
};

const ClassAdvisorsSection = ({
  classAdvisors,
}: {
  classAdvisors: Array<Teacher>;
}): JSX.Element => {
  const { t } = useTranslation("class");

  return (
    <Section labelledBy="class-advisors">
      <Header
        icon={<MaterialIcon icon="group" />}
        text={t("classAdvisors.title")}
      />
      <div className="layout-grid-cols-3 !w-full !flex-col">
        {classAdvisors.map((classAdvisor) => (
          <TeacherCard
            key={classAdvisor.id}
            teacher={classAdvisor}
            hasSubjectSubgroup
            className="!w-full"
          />
        ))}
      </div>
      <div className="flex flex-row flex-wrap items-center justify-end gap-2">
        <Button label={t("classAdvisors.addAdvisors")} type="filled" />
      </div>
    </Section>
  );
};

const ContactSection = ({
  contacts,
}: {
  contacts: Array<Contact>;
}): JSX.Element => {
  const { t } = useTranslation("class");

  return (
    <Section labelledBy="class-contacts">
      <Header
        icon={<MaterialIcon icon="contacts" />}
        text={t("classContacts.title")}
      />
      <div className="layout-grid-cols-3 !w-full !flex-col">
        {contacts.map((contact) => (
          <ContactChip
            key={contact.id}
            contact={contact}
            className="!w-initial"
          />
        ))}
      </div>
      <div className="flex flex-row flex-wrap items-center justify-end gap-2">
        <Button label={t("classContacts.addClassContacts")} type="filled" />
      </div>
    </Section>
  );
};

const StudentListSection = ({
  students,
}: {
  students: Array<Student>;
}): JSX.Element => {
  const { t } = useTranslation(["class", "common"]);
  const locale = useRouter().locale == "th" ? "th" : "en-US";

  return (
    <Section labelledBy="student-list">
      <div className="layout-grid-cols-3--header items-start">
        <div className="[grid-area:header]">
          <Header
            icon={<MaterialIcon icon="groups" />}
            text={t("studentList.title")}
          />
        </div>
        <Search
          placeholder={t("studentList.searchStudents")}
          className="[grid-area:search]"
        />
      </div>
      <div>
        <Table width={320}>
          <thead>
            <tr>
              <th className="w-24">{t("studentList.table.classNo")}</th>
              <th>{t("studentList.table.name")}</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.classNo}</td>
                <td className="!text-left">
                  {nameJoiner(
                    locale,
                    student.name,
                    t(`name.prefix.${student.prefix}`, { ns: "common" }),
                    {
                      prefix: true,
                    }
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <div className="flex flex-row flex-wrap items-center justify-end gap-2">
        <Button label={t("studentList.printList")} type="filled" />
      </div>
    </Section>
  );
};

// Page
const Class: NextPage<{
  classItem: ClassType;
  studentForms: Array<StudentForm>;
}> = ({ classItem, studentForms }) => {
  const { t } = useTranslation("common");
  const locale = useRouter().locale as "en-US" | "th";

  return (
    <>
      <Head>
        <title>
          {classItem.name[locale]} - {t("brand.name")}
        </title>
      </Head>
      <RegularLayout
        Title={
          <Title
            name={{ title: classItem.name[locale] }}
            pageIcon={<MaterialIcon icon="groups" />}
            backGoesTo="/s/home"
            LinkElement={Link}
          />
        }
      >
        <FormSection
          studentForms={studentForms.map((newsItem) => ({
            ...newsItem,
            postDate: new Date(newsItem.postDate),
          }))}
        />
        <ClassAdvisorsSection classAdvisors={classItem.classAdvisors} />
        <ContactSection contacts={classItem.contacts} />
        <StudentListSection students={classItem.students} />
      </RegularLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  params,
}) => {
  // TODO: Fetch class here
  const classItem: ClassType = {
    id: 405,
    name: {
      "en-US": "M.405",
      th: "ม.405",
    },
    contacts: [
      {
        id: 15,
        type: "line",
        name: {
          "en-US": "Students only",
          th: "กลุ่มนักเรียน",
        },
        includes: {
          students: true,
          parents: false,
          teachers: false,
        },
        value: "https://line.me/R/ti/g/aOslRIgnDj",
      },
      {
        id: 16,
        type: "discord",
        name: {
          "en-US": "Students only",
          th: "กลุ่มนักเรียน",
        },
        includes: {
          students: true,
          parents: false,
          teachers: false,
        },
        value: "https://discord.gg/BEsTtp",
      },
      {
        id: 17,
        type: "line",
        name: {
          "en-US": "Students and teachers",
          th: "กลุ่มนักเรียนกับอาจารย์",
        },
        includes: {
          students: true,
          parents: false,
          teachers: true,
        },
        value: "https://line.me/R/ti/g/aOslRIgnDj",
      },
      {
        id: 17,
        type: "line",
        name: {
          "en-US": "Whole class",
          th: "กลุ่มรวมห้อง",
        },
        includes: {
          students: true,
          parents: true,
          teachers: true,
        },
        value: "https://line.me/R/ti/g/aOslRIgnDj",
      },
      {
        id: 18,
        type: "line",
        name: {
          "en-US": "M.4 EPlus+",
          th: "กลุ่ม EPlus+ ม.4",
        },
        includes: {
          students: true,
          parents: true,
          teachers: true,
        },
        value: "https://line.me/R/ti/g/aOslRIgnDj",
      },
    ],
    classAdvisors: [
      {
        id: 2,
        role: "teacher",
        prefix: "mister",
        name: {
          "en-US": { firstName: "Taradol", lastName: "Ranarintr" },
          th: { firstName: "ธราดล", lastName: "รานรินทร์" },
        },
        profile: "/images/dummybase/taradol.webp",
        teacherID: "skt551",
        subjectsInCharge: [
          {
            id: 8,
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
        teacherID: "skt196",
        subjectsInCharge: [
          {
            id: 2,
            code: {
              "en-US": "ENG31252",
              th: "อ31252",
            },
            name: {
              "en-US": {
                name: "Communication 2",
              },
              th: { name: "ภาษาอังกฤษเพื่อการสื่อสาร 2" },
            },
            subjectSubgroup: {
              name: { "en-US": "English", th: "ภาษาอังกฤษ" },
              subjectGroup: {
                name: { "en-US": "Foreign Language", th: "ภาษาต่างประเทศ" },
              },
            },
          },
        ],
      },
    ],
    students: [
      {
        id: 248,
        role: "student",
        prefix: "mister",
        name: {
          "en-US": {
            firstName: "Paniti",
            lastName: "Putpan",
          },
          th: {
            firstName: "ปณิธิ",
            lastName: "พุฒพันธ์",
          },
        },
        studentID: "56522",
        class: {
          id: 405,
          name: {
            "en-US": "M.405",
            th: "ม.405",
          },
        },
        classNo: 1,
      },
      {
        id: 249,
        role: "student",
        prefix: "mister",
        name: {
          "en-US": {
            firstName: "Chayatawn",
            lastName: "Yupattanawong",
          },
          th: {
            firstName: "ชยธร",
            lastName: "อยู่พัฒนวงศ์",
          },
        },
        studentID: "56523",
        class: {
          id: 405,
          name: {
            "en-US": "M.405",
            th: "ม.405",
          },
        },
        classNo: 2,
      },
      {
        id: 250,
        role: "student",
        prefix: "miss",
        name: {
          "en-US": {
            firstName: "Tanvin",
            lastName: "Chanchairujira",
          },
          th: {
            firstName: "ธันวิน",
            lastName: "ชาญชัยรุจิรา",
          },
        },
        studentID: "56525",
        class: {
          id: 405,
          name: {
            "en-US": "M.405",
            th: "ม.405",
          },
        },
        classNo: 3,
      },
      {
        id: 251,
        role: "student",
        prefix: "mister",
        name: {
          "en-US": {
            firstName: "Thas",
            lastName: "Thasanakosol",
          },
          th: {
            firstName: "ธรรศ",
            lastName: "ทัศนโกศล",
          },
        },
        studentID: "56535",
        class: {
          id: 405,
          name: {
            "en-US": "M.405",
            th: "ม.405",
          },
        },
        classNo: 4,
      },
      {
        id: 252,
        role: "student",
        prefix: "mister",
        name: {
          "en-US": {
            firstName: "Katakorn",
            lastName: "Worakittiphan",
          },
          th: {
            firstName: "กตกร",
            lastName: "วรกิตติพันธ์",
          },
        },
        studentID: "56540",
        class: {
          id: 405,
          name: {
            "en-US": "M.405",
            th: "ม.405",
          },
        },
        classNo: 5,
      },
      {
        id: 253,
        role: "student",
        prefix: "mister",
        name: {
          "en-US": {
            firstName: "Rojravee",
            lastName: "Boonchokcharoensri",
          },
          th: {
            firstName: "โรจน์รวี",
            lastName: "บุญโชคเจริญศรี",
          },
        },
        studentID: "56542",
        class: {
          id: 405,
          name: {
            "en-US": "M.405",
            th: "ม.405",
          },
        },
        classNo: 6,
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

  return {
    props: {
      ...(await serverSideTranslations(locale as string, [
        "account",
        "news",
        "dashboard",
        "common",
        "class",
        "teacher",
      ])),
      classItem,
      studentForms: studentForms.map((newsItem) => ({
        ...newsItem,
        postDate: newsItem.postDate.getTime(),
      })),
    },
  };
};

export default Class;
