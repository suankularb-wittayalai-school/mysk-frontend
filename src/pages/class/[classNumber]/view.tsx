// External libraries
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// SK Components
import {
  Card,
  CardHeader,
  Header,
  LayoutGridCols,
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

// Backend
import { getClassroom } from "@utils/backend/classroom/classroom";

// Helpers
import { nameJoiner } from "@utils/helpers/name";
import { createTitleStr } from "@utils/helpers/title";

// Types
import { Class as ClassType } from "@utils/types/class";
import { LangCode } from "@utils/types/common";
import { Contact } from "@utils/types/contact";
import { Student, Teacher } from "@utils/types/person";

const RelatedPagesSection = ({ classNumber }: { classNumber: number }) => {
  return (
    <Section>
      <LayoutGridCols cols={2}>
        <Link href={`/class/${classNumber}/teachers`}>
          <a>
            <Card type="horizontal" hasAction>
              <CardHeader
                icon={<MaterialIcon icon="recent_actors" />}
                title={<h2>รายชื่ออาจารย์</h2>}
                label="ดูรายชื่ออาจารย์ที่สอนห้องม.504"
                end={<MaterialIcon icon="arrow_forward" />}
              />
            </Card>
          </a>
        </Link>
        <Link href={`/class/${classNumber}/students`}>
          <a>
            <Card type="horizontal" hasAction>
              <CardHeader
                icon={<MaterialIcon icon="groups" />}
                title={<h2>รายชื่อนักเรียน</h2>}
                label="ดูรายชื่อนักเรียนห้องม.504"
                end={<MaterialIcon icon="arrow_forward" />}
              />
            </Card>
          </a>
        </Link>
      </LayoutGridCols>
    </Section>
  );
};

const ClassAdvisorsSection = ({
  classAdvisors,
}: {
  classAdvisors: Teacher[];
}): JSX.Element => {
  const { t } = useTranslation("class");

  return (
    <Section labelledBy="class-advisors">
      <Header
        icon={<MaterialIcon icon="group" allowCustomSize />}
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
  contacts: Contact[];
}): JSX.Element => {
  const { t } = useTranslation("class");

  return (
    <Section labelledBy="class-contacts">
      <Header
        icon={<MaterialIcon icon="contacts" allowCustomSize />}
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
  const locale = useRouter().locale as LangCode;

  return (
    <Section labelledBy="student-list">
      <div className="layout-grid-cols-3--header items-start">
        <div className="[grid-area:header]">
          <Header
            icon={<MaterialIcon icon="groups" allowCustomSize />}
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
const Class: NextPage<{ classNumber: number; classItem: ClassType }> = ({
  classNumber,
  classItem,
}) => {
  const { t } = useTranslation("common");

  return (
    <>
      <Head>
        <title>
          {createTitleStr(t("class", { number: classItem.number }), t)}
        </title>
      </Head>
      <RegularLayout
        Title={
          <Title
            name={{ title: t("class", { number: classItem.number }) }}
            pageIcon={<MaterialIcon icon="groups" />}
            backGoesTo="/learn"
            LinkElement={Link}
          />
        }
      >
        <RelatedPagesSection classNumber={classNumber} />
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
  const classNumber = Number(params?.classNumber);
  const classItem = await getClassroom(classNumber);

  return {
    props: {
      ...(await serverSideTranslations(locale as string, [
        "common",
        "class",
        "teacher",
      ])),
      classNumber,
      classItem,
    },
  };
};

export default Class;
