// Modules
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// SK Components
import {
  Button,
  Header,
  LinkButton,
  MaterialIcon,
  RegularLayout,
  Search,
  Section,
  Table,
  Title,
} from "@suankularb-components/react";

// Components
import ContactChip from "@components/ContactChip";
import TeacherCard from "@components/TeacherCard";

// Helpers
import { nameJoiner } from "@utils/helpers/name";

// Types
import { Class as ClassType } from "@utils/types/class";
import { Contact } from "@utils/types/contact";
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
            className="!w-full"
          />
        ))}
      </div>
      <div className="flex flex-row flex-wrap items-center justify-end gap-2">
        <Button
          label={t("classAdvisors.addAdvisors")}
          type="filled"
        />
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
        <Button
          label={t("classContacts.addClassContacts")}
          type="filled"
        />
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
        <Button
          label={t("studentList.printList")}
          type="filled"
        />
      </div>
    </Section>
  );
};

// Page
const Class: NextPage<{ classItem: ClassType }> = ({ classItem }) => {
  const { t } = useTranslation("common");
  const locale = useRouter().locale == "en-US" ? "en-US" : "th";

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

  return {
    props: {
      ...(await serverSideTranslations(locale as string, [
        "common",
        "class",
        "teacher",
      ])),
      classItem,
    },
  };
};

export default Class;
