// External libraries
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// SK Components
import {
  LayoutGridCols,
  MaterialIcon,
  RegularLayout,
  Search,
  Section,
  Table,
  Title,
} from "@suankularb-components/react";

// Backend
import {
  getClassIDFromNumber,
  getClassStudentList,
} from "@utils/backend/classroom/classroom";

// Helpers
import { nameJoiner } from "@utils/helpers/name";
import { createTitleStr } from "@utils/helpers/title";

// Types
import { LangCode } from "@utils/types/common";
import { StudentListItem } from "@utils/types/person";

const StudentList = ({ students }: { students: StudentListItem[] }): JSX.Element => {
  const { t } = useTranslation(["class", "common"]);
  const locale = useRouter().locale as LangCode;

  return (
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
  );
};

const ClassStudents: NextPage<{ classNumber: number; students: StudentListItem[] }> = ({
  classNumber,
  students,
}) => {
  const { t } = useTranslation("class");

  return (
    <>
      <Head>
        <title>
          {createTitleStr(t("studentList.tabTitle", { classNumber }), t)}
        </title>
      </Head>

      <RegularLayout
        Title={
          <Title
            name={{
              title: t("studentList.title"),
              subtitle: t("class", { ns: "common", number: classNumber }),
            }}
            pageIcon={<MaterialIcon icon="groups" />}
            backGoesTo={`/class/${classNumber}/view`}
            LinkElement={Link}
          />
        }
      >
        <Section>
          <LayoutGridCols cols={3}>
            <Search placeholder={t("studentList.searchStudents")} />
          </LayoutGridCols>
          <StudentList students={students} />
        </Section>
      </RegularLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  params,
}) => {
  const classNumber = Number(params?.classNumber);

  const { data: classID, error: classIDError } = await getClassIDFromNumber(
    classNumber
  );
  if (classIDError) return { notFound: true };

  const { data: students } = await getClassStudentList(classID as number);

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "class",
      ])),
      classNumber,
      students,
    },
  };
};

export default ClassStudents;
