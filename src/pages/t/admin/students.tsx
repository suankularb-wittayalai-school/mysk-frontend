// Modules
import type { GetServerSideProps, NextPage } from "next";
import Link from "next/link";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

import { useState } from "react";

// Supabase client
// import { supabase } from "@utils/supabaseConfig";

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
import ConfirmDelete from "@components/dialogs/ConfirmDelete";
import EditPersonDialog from "@components/dialogs/EditPerson";
import StudentTable from "@components/tables/StudentTable";

// Types
import { Student } from "@utils/types/person";
import Head from "next/head";

// Page
const Students: NextPage<{ allStudents: Array<Student> }> = ({
  allStudents,
}): JSX.Element => {
  const { t } = useTranslation("admin");

  const [showAdd, setShowAdd] = useState<boolean>(false);

  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [editingPerson, setEditingPerson] = useState<Student>();

  const [showConfDel, setShowConfDel] = useState<boolean>(false);

  return (
    <>
      {/* Head */}
      <Head>
        <title>
          {t("studentList.title")}
          {" - "}
          {t("brand.name", { ns: "common" })}
        </title>
      </Head>

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
            setEditingPerson={setEditingPerson}
            setShowConfDelStudent={setShowConfDel}
          />
        </Section>
      </RegularLayout>

      {/* Dialogs */}
      <EditPersonDialog
        show={showEdit}
        onClose={() => setShowEdit(false)}
        // TODO: Refetch students here ↓
        onSubmit={() => setShowEdit(false)}
        mode="edit"
        person={editingPerson}
      />
      <EditPersonDialog
        show={showAdd}
        onClose={() => setShowAdd(false)}
        // TODO: Refetch students here ↓
        onSubmit={() => setShowAdd(false)}
        mode="add"
        userRole="student"
      />
      <ConfirmDelete
        show={showConfDel}
        onClose={() => setShowConfDel(false)}
        // TODO: Refetch teachers here ↓
        onSubmit={() => setShowConfDel(false)}
      />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const allStudents: Array<Student> = [
    {
      id: 985,
      prefix: "Master",
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
      citizen_id: "1234567890123",
      birthdate: "2020-01-01",
      classNo: 1,
    },
    {
      id: 986,
      prefix: "Master",
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
      citizen_id: "1234567890124",
      birthdate: "2020-01-01",
      classNo: 2,
    },
    {
      id: 987,
      prefix: "Master",
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
      citizen_id: "1234567890125",
      birthdate: "2020-01-01",
      classNo: 3,
    },
    {
      id: 988,
      prefix: "Master",
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
      citizen_id: "1234567890126",
      birthdate: "2020-01-01",
      classNo: 4,
    },
    {
      id: 989,
      prefix: "Master",
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
      citizen_id: "1234567890127",
      birthdate: "2020-01-01",
      classNo: 5,
    },
    {
      id: 990,
      prefix: "Master",
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
      citizen_id: "1234567890128",
      birthdate: "2020-01-01",
      classNo: 6,
    },
    {
      id: 991,
      prefix: "Master",
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
      citizen_id: "1234567890129",
      birthdate: "2020-01-01",
      classNo: 7,
    },
    {
      id: 992,
      prefix: "Master",
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
      citizen_id: "1234567890130",
      birthdate: "2020-01-01",
      classNo: 8,
    },
    {
      id: 993,
      prefix: "Master",
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
      citizen_id: "1234567890131",
      birthdate: "2020-01-01",
      classNo: 9,
    },
    {
      id: 994,
      prefix: "Master",
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
      citizen_id: "1234567890132",
      birthdate: "2020-01-01",
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
