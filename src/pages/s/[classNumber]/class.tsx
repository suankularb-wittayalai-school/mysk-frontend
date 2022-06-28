// Modules
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// SK Components
import {
  Header,
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
import { supabase } from "@utils/supabaseClient";
import { ClassroomDB, ClassroomTable } from "@utils/types/database/class";
import { db2Class } from "@utils/backend/database";
import {
  getCurrentAcedemicYear,
  getCurrentSemester,
} from "@utils/helpers/date";
import { useStudentAccount } from "@utils/hooks/auth";

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
    </Section>
  );
};

// Page
const Class: NextPage<{ classItem: ClassType }> = ({ classItem }) => {
  const { t } = useTranslation("common");
  const locale = useRouter().locale as "en-US" | "th";
  useStudentAccount({ loginRequired: true });

  return (
    <>
      <Head>
        <title>
          {t("class", { number: classItem.number })} - {t("brand.name")}
        </title>
      </Head>
      <RegularLayout
        Title={
          <Title
            name={{ title: t("class", { number: classItem.number }) }}
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
  let classItem: ClassType = {
    id: 0,
    number: 0,
    classAdvisors: [],
    contacts: [],
    students: [],
    year: getCurrentAcedemicYear(),
    semester: 1,
    subjects: [],
  };
  const {
    data: classroom,
    error: classroomSelectionError,
  } = await supabase
    .from<ClassroomDB>("classroom")
    .select("*")
    .match({ number: params?.classNumber, year: getCurrentAcedemicYear() })
    .limit(1)
    .single();

  if (classroom) classItem = await db2Class(classroom);

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
