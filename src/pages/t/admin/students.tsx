// Modules
import type { GetServerSideProps, NextPage } from "next";
import Link from "next/link";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

import { useState } from "react";

// SK Components
import {
  Button,
  MaterialIcon,
  RegularLayout,
  Search,
  Section,
  Title,
} from "@suankularb-components/react";

// Components
import EditStudentDialog from "@components/dialogs/EditStudent";
import StudentTable from "@components/tables/StudentTable";

// Types
import { Student } from "@utils/types/person";

// Page
const Students: NextPage<{ allStudents: Array<Student> }> = ({
  allStudents,
}): JSX.Element => {
  const { t } = useTranslation("admin");

  const [showAdd, setShowAdd] = useState<boolean>(false);

  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [editingStudent, setEditingStudent] = useState<Student>();

  return (
    <>
      {/* Page */}
      <RegularLayout
        Title={
          <Title
            name={{ title: t("studentList.title") }}
            pageIcon={<MaterialIcon icon="groups" />}
            backGoesTo="/t/admin"
            LinkElement={Link}
            key="title"
          />
        }
      >
        <Section>
          <div className="layout-grid-cols-3">
            <Search placeholder={t("studentList.searchStudents")} />
            <div className="col-span-2 flex flex-row items-end justify-end gap-2">
              <Button
                label={t("studentList.action.addStudent")}
                type="filled"
                onClick={() => setShowAdd(true)}
              />
            </div>
          </div>
          <StudentTable
            students={allStudents}
            setShowEdit={setShowEdit}
            setEditingStudent={setEditingStudent}
          />
        </Section>
      </RegularLayout>

      {/* Dialogs */}
      <EditStudentDialog
        show={showEdit}
        onClose={() => setShowEdit(false)}
        // TODO: Refetch students here ↓
        onSubmit={() => setShowEdit(false)}
        mode="edit"
        student={editingStudent}
      />
      <EditStudentDialog
        show={showAdd}
        onClose={() => setShowAdd(false)}
        // TODO: Refetch students here ↓
        onSubmit={() => setShowAdd(false)}
        mode="add"
      />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const allStudents: Array<Student> = [
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
      id: 989,
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
    {
      id: 990,
      prefix: "master",
      role: "student",
      name: {
        th: {
          firstName: "ธนากวินพร",
          lastName: "ดิษปรางค์รัตน์",
        },
      },
      studentID: "58273",
      class: {
        id: 101,
        name: {
          "en-US": "M.101",
          th: "ม.101",
        },
      },
      classNo: 6,
    },
    {
      id: 991,
      prefix: "master",
      role: "student",
      name: {
        th: {
          firstName: "เจตนิพิฐ",
          lastName: "เลาหเรืองรองกุล",
        },
      },
      studentID: "58274",
      class: {
        id: 101,
        name: {
          "en-US": "M.101",
          th: "ม.101",
        },
      },
      classNo: 7,
    },
    {
      id: 992,
      prefix: "master",
      role: "student",
      name: {
        th: {
          firstName: "เรืองรองกุล",
          lastName: "สัจจะธนาพร",
        },
      },
      studentID: "58275",
      class: {
        id: 101,
        name: {
          "en-US": "M.101",
          th: "ม.101",
        },
      },
      classNo: 8,
    },
    {
      id: 993,
      prefix: "master",
      role: "student",
      name: {
        th: {
          firstName: "เจริญธรรม",
          lastName: "ศรีปรางค์",
        },
      },
      studentID: "58276",
      class: {
        id: 101,
        name: {
          "en-US": "M.101",
          th: "ม.101",
        },
      },
      classNo: 9,
    },
    {
      id: 994,
      prefix: "master",
      role: "student",
      name: {
        th: {
          firstName: "เจตนิพิฐ",
          lastName: "ปรางค์รัตน์",
        },
      },
      studentID: "58277",
      class: {
        id: 101,
        name: {
          "en-US": "M.101",
          th: "ม.101",
        },
      },
      classNo: 10,
    },
  ];

  return {
    props: {
      ...(await serverSideTranslations(locale as string, [
        "common",
        "admin",
        "account",
      ])),
      allStudents,
    },
  };
};

export default Students;
