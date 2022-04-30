// Modules
import type { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

import { useState } from "react";

// Supabase client
import { supabase } from "@utils/supabaseClient";

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
  const router = useRouter();

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
        onSubmit={() => {
          setShowAdd(false);
          router.replace(router.asPath);
        }}
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
  // const allStudents: Array<Student> = [
  //   {
  //     id: 985,
  //     prefix: "Master",
  //     role: "student",
  //     name: {
  //       th: {
  //         firstName: "ธนา",
  //         lastName: "สัจจะธนาพร",
  //       },
  //     },
  //     studentID: "58268",
  //     class: {
  //       id: 101,
  //       name: {
  //         "en-US": "M.101",
  //         th: "ม.101",
  //       },
  //     },
  //     citizen_id: "1234567890123",
  //     birthdate: "2020-01-01",
  //     classNo: 1,
  //   },
  // ];

  const { data, error } = await supabase
    .from("student")
    .select(`id, std_id, people:person(*)`);

  if (error) {
    console.error(error);
  }

  // console.log(data);

  if (!data) {
    return { props: { allStudents: [] } };
  }

  const allStudents = data.map((student) => {
    // delete student.people.id;
    const formatted: Student = {
      id: student.id,
      prefix: student.people.prefix_en,
      role: "student",
      name: {
        th: {
          firstName: student.people.first_name_th,
          lastName: student.people.last_name_th,
        },
        "en-US": {
          firstName: student.people.first_name_en,
          lastName: student.people.last_name_en,
        },
      },
      studentID: student.std_id,

      // TODO: Get class
      class: {
        id: 101,
        name: {
          "en-US": "M.101",
          th: "ม.101",
        },
      },
      citizen_id: student.people.citizen_id,
      birthdate: student.people.birthdate,

      // TODO: Get classNo
      classNo: 1,
    };

    return formatted;
  });

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
