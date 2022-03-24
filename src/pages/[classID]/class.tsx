// Modules
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// SK Components
import {
  Button,
  Header,
  MaterialIcon,
  RegularLayout,
  Search,
  Section,
  Table,
  Title,
} from "@suankularb-components/react";

// Components
import TeacherCard from "@components/TeacherCard";

// Helpers
import { nameJoiner } from "@utils/helpers/name";

// Types
import { Class as ClassType } from "@utils/types/class";
import { Student, Teacher } from "@utils/types/person";

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
            hasArrow
            className="!w-full"
          />
        ))}
      </div>
    </Section>
  );
};

const ContactSection = (): JSX.Element => {
  const { t } = useTranslation("class");

  return (
    <Section labelledBy="class-contacts">
      <Header
        icon={<MaterialIcon icon="contacts" />}
        text={t("classContacts.title")}
      />
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
        <Table>
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
    </Section>
  );
};

// Page
const Class: NextPage<{ classItem: ClassType }> = ({ classItem }) => {
  const { t } = useTranslation("class");
  const locale = useRouter().locale == "en-US" ? "en-US" : "th";

  return (
    <>
      <Head>
        <title>{classItem.name[locale]}</title>
      </Head>
      <RegularLayout
        Title={
          <Title
            name={{ title: classItem.name[locale] }}
            pageIcon={<MaterialIcon icon="groups" />}
            backGoesTo="/home"
            LinkElement={Link}
          />
        }
      >
        <ClassAdvisorsSection classAdvisors={classItem.classAdvisors} />
        <ContactSection />
        <StudentListSection students={classItem.students} />
      </RegularLayout>
    </>
  );
};

export const getStaticPaths: GetStaticPaths<{ classID: string }> = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
  // TODO: Fetch class here
  const classItem = {
    id: 405,
    name: {
      "en-US": "M.405",
      th: "ม.405",
    },
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
        role: "teacher",
        prefix: "missus",
        name: {
          "en-US": { firstName: "Mattana", lastName: "Tatanyang" },
          th: { firstName: "มัทนา", lastName: "ต๊ะตันยาง" },
        },
        profile: "/images/dummybase/mattana.webp",
        subjectsInCharge: [
          {
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
        class: "405",
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
        class: "405",
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
        class: "405",
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
        class: "405",
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
        class: "405",
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
        class: "405",
        classNo: 6,
      },
    ],
  };

  return {
    props: {
      ...(await serverSideTranslations(locale == "en-US" ? "en-US" : "th", [
        "common",
        "class",
        "teacher",
      ])),
      classItem,
    },
  };
};

export default Class;
