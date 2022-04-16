// Modules
import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { useState } from "react";

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
import EditStudentDialog from "@components/dialogs/EditStudent";

// Types
import { Student } from "@utils/types/person";

// Helpers
import { nameJoiner } from "@utils/helpers/name";

const StudentSection = ({
  someStudents,
  setShowEdit,
  setEditingStudent,
}: {
  someStudents: Array<Student>;
  setShowEdit: Function;
  setEditingStudent: Function;
}): JSX.Element => {
  const { t } = useTranslation("admin");
  const locale = useRouter().locale == "en-US" ? "en-US" : "th";

  return (
    <Section>
      <div className="layout-grid-cols-3--header">
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
        <Table width={800}>
          <thead>
            <tr>
              <th className="w-1/12">{t("studentList.table.id")}</th>
              <th className="w-1/12">{t("studentList.table.class")}</th>
              <th className="w-1/12">{t("studentList.table.classNo")}</th>
              <th className="w-5/12">{t("studentList.table.name")}</th>
              <th className="w-1/12" />
            </tr>
          </thead>
          <tbody>
            {someStudents.map((student) => (
              <tr key={student.id}>
                <td>{student.studentID}</td>
                <td>{student.class.name[locale] || student.class.name.th}</td>
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
                <td>
                  <div className="flex flex-row justify-center gap-2">
                    <Button
                      name={t("studentList.table.action.copy")}
                      type="text"
                      iconOnly
                      icon={<MaterialIcon icon="content_copy" />}
                      onClick={() =>
                        navigator.clipboard?.writeText(
                          nameJoiner(locale, student.name)
                        )
                      }
                      className="!hidden sm:!block"
                    />
                    <Button
                      name={t("studentList.table.action.edit")}
                      type="text"
                      iconOnly
                      icon={<MaterialIcon icon="edit" />}
                      onClick={() => {
                        setShowEdit(true);
                        setEditingStudent(student);
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <div className="flex flex-row items-center justify-end gap-2">
        <LinkButton
          type="filled"
          label={t("studentList.action.seeAll")}
          url="/t/admin/students"
          LinkElement={Link}
        />
      </div>
    </Section>
  );
};

const Admin: NextPage<{ someStudents: Array<Student> }> = ({
  someStudents,
}) => {
  const { t } = useTranslation(["admin", "common"]);

  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [editingStudent, setEditingStudent] = useState<Student>();

  return (
    <>
      <Head>
        <title>
          {t("title")} - {t("brand.name", { ns: "common" })}
        </title>
      </Head>
      <RegularLayout
        Title={
          <Title
            name={{ title: t("title") }}
            pageIcon={<MaterialIcon icon="security" />}
            backGoesTo="/t/home"
            LinkElement={Link}
          />
        }
      >
        <StudentSection
          someStudents={someStudents}
          setShowEdit={setShowEdit}
          setEditingStudent={setEditingStudent}
        />
      </RegularLayout>
      <EditStudentDialog
        show={showEdit}
        onClose={() => setShowEdit(false)}
        mode="edit"
        student={editingStudent}
      />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const someStudents: Array<Student> = [
    {
      id: 985,
      prefix: "master",
      role: "student",
      name: {
        th: {
          firstName: "ธนา",
          lastName: "สัจจะธนาพร",
        },
      },
      studentID: "58268",
      class: {
        id: 101,
        name: {
          "en-US": "M.101",
          th: "ม.101",
        },
      },
      classNo: 1,
    },
    {
      id: 986,
      prefix: "master",
      role: "student",
      name: {
        th: {
          firstName: "กวินภพ",
          lastName: "ดิษสุนรัตน์",
        },
      },
      studentID: "58269",
      class: {
        id: 101,
        name: {
          "en-US": "M.101",
          th: "ม.101",
        },
      },
      classNo: 2,
    },
    {
      id: 987,
      prefix: "master",
      role: "student",
      name: {
        th: {
          firstName: "ณฐกร",
          lastName: "ศรีปรางค์",
        },
      },
      studentID: "58270",
      class: {
        id: 101,
        name: {
          "en-US": "M.101",
          th: "ม.101",
        },
      },
      classNo: 3,
    },
    {
      id: 988,
      prefix: "master",
      role: "student",
      name: {
        th: {
          firstName: "เจตนิพิฐ",
          lastName: "เลาหเรืองรองกุล",
        },
      },
      studentID: "58271",
      class: {
        id: 101,
        name: {
          "en-US": "M.101",
          th: "ม.101",
        },
      },
      classNo: 4,
    },
    {
      id: 988,
      prefix: "master",
      role: "student",
      name: {
        th: {
          firstName: "พิริยกร",
          lastName: "เจริญธรรมรักษา",
        },
      },
      studentID: "58272",
      class: {
        id: 101,
        name: {
          "en-US": "M.101",
          th: "ม.101",
        },
      },
      classNo: 5,
    },
  ];

  return {
    props: {
      ...(await serverSideTranslations(locale as string, [
        "common",
        "admin",
        "account",
      ])),
      someStudents,
    },
  };
};

export default Admin;
