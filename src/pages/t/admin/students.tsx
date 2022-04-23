// Modules
import type { GetServerSideProps, GetStaticProps, NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

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
import StudentTable from "@components/tables/StudentTable";

// Types
import { Student } from "@utils/types/person";
import EditStudentDialog from "@components/dialogs/EditStudent";

// Page
const Developers: NextPage<{ students: Array<Student> }> = ({
  students,
}): JSX.Element => {
  const { t } = useTranslation("admin");
  const locale = useRouter().locale == "en-US" ? "en-US" : "th";

  const [showAdd, setShowAdd] = useState<boolean>(false);

  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [editingStudent, setEditingStudent] = useState<Student>();

  return (
    <>
      <RegularLayout
        Title={
          <Title
            name={{ title: "รายชื่อนักเรียน" }}
            pageIcon={<MaterialIcon icon="groups" />}
            backGoesTo="/t/admin"
            LinkElement={Link}
            key="title"
          />
        }
      >
        <Section>
          <div className="layout-grid-cols-3">
            <Search placeholder="ค้นหานักเรียน" />
            <div className="col-span-2 flex flex-row items-end justify-end gap-2">
              <Button
                label="เพิ่มนักเรียน"
                type="filled"
                onClick={() => setShowAdd(true)}
              />
            </div>
          </div>
          <StudentTable
            students={students}
            setShowEdit={setShowEdit}
            setEditingStudent={setEditingStudent}
          />
        </Section>
      </RegularLayout>
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
  const students: Array<Student> = [
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
      students,
    },
  };
};

export default Developers;
