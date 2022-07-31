// Modules
import type { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";

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
import ConfirmDelete from "@components/dialogs/ConfirmDelete";
import EditPersonDialog from "@components/dialogs/EditPerson";
import ImportDataDialog from "@components/dialogs/ImportData";
import StudentTable from "@components/tables/StudentTable";

// Backend
import { db2Student } from "@utils/backend/database";

// Supabase
import { supabase } from "@utils/supabaseClient";

// Types
import { Prefix, Role, Student } from "@utils/types/person";
import { PersonTable, StudentDB } from "@utils/types/database/person";
import { StudentTable as StudentTableType } from "@utils/types/database/person";

// Hooks
import { useSession } from "@utils/hooks/auth";
import { createStudent } from "@utils/backend/person/student";
import { createTitleStr } from "@utils/helpers/title";

interface ImportedData {
  prefix: "เด็กชาย" | "นาย" | "นาง" | "นางสาว";
  first_name_th: string;
  first_name_en: string;
  middle_name_th?: string;
  middle_name_en?: string;
  last_name_th: string;
  last_name_en: string;
  birthdate: string;
  citizen_id: number;
  student_id: number;
  class_number: number;
  email: string;
}

const prefixMap = {
  เด็กชาย: "Master.",
  นาย: "Mr.",
  นาง: "Mrs.",
  นางสาว: "Miss.",
} as const;

// Page
const Students: NextPage<{ allStudents: Array<Student> }> = ({
  allStudents,
}): JSX.Element => {
  const { t } = useTranslation("admin");
  const router = useRouter();

  const [showAdd, setShowAdd] = useState<boolean>(false);
  const [showImport, setShowImport] = useState<boolean>(false);
  const [showConfDel, setShowConfDel] = useState<boolean>(false);

  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [editingPerson, setEditingPerson] = useState<Student>();

  async function handleDelete() {
    if (!editingPerson) return;

    const { data: userid, error: selectingError } = await supabase
      .from<{
        id: string;
        email: string;
        role: Role;
        student: number;
        teacher: number;
      }>("users")
      .select("id")
      .match({ student: editingPerson.id })
      .limit(1)
      .single();

    if (selectingError) {
      console.error(selectingError);
      return;
    }

    if (!userid) {
      console.error("No user found");
      return;
    }

    const { data: deleting, error } = await supabase
      .from<StudentTableType>("student")
      .delete()
      .match({ id: editingPerson.id });
    if (error || !deleting) {
      console.error(error);
      return;
    }

    // Delete the person of the student
    const { data: person, error: personDeletingError } = await supabase
      .from<PersonTable>("people")
      .delete()
      .match({ id: deleting[0].person });

    if (personDeletingError || !person) {
      console.error(personDeletingError);
      return;
    }

    // Delete account of the student
    await fetch(`/api/account`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: userid.id,
      }),
    });

    setShowConfDel(false);
    router.replace(router.asPath);
  }

  async function handleImport(data: ImportedData[]) {
    const students: Array<{ person: Student; email: string }> = data.map(
      (student) => {
        const person: Student = {
          id: 0,
          name: {
            th: {
              firstName: student.first_name_th,
              middleName: student.middle_name_th,
              lastName: student.last_name_th,
            },
            "en-US": {
              firstName: student.first_name_en,
              middleName: student.middle_name_en,
              lastName: student.last_name_en,
            },
          },
          birthdate: student.birthdate,
          citizenID: student.citizen_id.toString(),
          studentID: student.student_id.toString(),
          prefix: prefixMap[student.prefix] as Prefix,
          role: "student",
          contacts: [],
          class: {
            id: 0,
            number: student.class_number,
          },
          classNo: 0,
        };
        const email = student.email;
        return { person, email };
      }
    );

    await Promise.all(
      students.map(
        async (student) => await createStudent(student.person, student.email)
      )
    );
  }

  return (
    <>
      {/* Head */}
      <Head>
        {" "}
        <title>{createTitleStr(t("studentList.title"), t)}</title>
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
            <div className="flex flex-row items-end justify-end gap-2 md:col-span-2">
              <Button
                label={t("common.action.import")}
                type="outlined"
                icon={<MaterialIcon icon="file_upload" />}
                onClick={() => setShowImport(true)}
              />
              <Button
                label={t("studentList.action.addStudent")}
                type="filled"
                icon={<MaterialIcon icon="add" />}
                onClick={() => setShowAdd(true)}
              />
            </div>
          </div>
          <div>
            <StudentTable
              students={allStudents}
              setShowEdit={setShowEdit}
              setEditingPerson={setEditingPerson}
              setShowConfDelStudent={setShowConfDel}
            />
          </div>
        </Section>
      </RegularLayout>

      {/* Dialogs */}
      <ImportDataDialog
        show={showImport}
        onClose={() => setShowImport(false)}
        onSubmit={(e: ImportedData[]) => {
          // console.log(e);
          handleImport(e).then(() => {
            setShowImport(false);
            router.replace(router.asPath);
          });
        }}
        columns={[
          { name: "prefix", type: '"เด็กชาย" | "นาย" | "นาง" | "นางสาว"' },
          { name: "first_name_th", type: "text" },
          { name: "first_name_en", type: "text" },
          { name: "middle_name_th", type: "text", optional: true },
          { name: "middle_name_en", type: "text", optional: true },
          { name: "last_name_th", type: "text" },
          { name: "last_name_en", type: "text" },
          { name: "birthdate", type: "date (YYYY-MM-DD) (in AD)" },
          { name: "citizen_id", type: "numeric (13-digit)" },
          { name: "student_id", type: "numeric (5-digit)" },
          { name: "class_number", type: "numeric (3-digit)" },
          { name: "email", type: "email" },
        ]}
      />
      <EditPersonDialog
        show={showEdit}
        onClose={() => setShowEdit(false)}
        onSubmit={() => {
          setShowEdit(false);
          router.replace(router.asPath);
        }}
        mode="edit"
        person={editingPerson}
      />
      <EditPersonDialog
        show={showAdd}
        onClose={() => setShowAdd(false)}
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
        onSubmit={() => handleDelete()}
      />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const { data, error } = await supabase
    .from<StudentDB>("student")
    .select(`id, std_id, people:person(*)`);

  if (error) console.error(error);
  if (!data) return { props: { allStudents: [] } };

  const allStudents: Student[] = await Promise.all(
    data.map(async (student) => await db2Student(student))
  );

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
