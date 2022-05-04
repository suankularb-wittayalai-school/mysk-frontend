// Modules
import type { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";

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
import { Role, Student } from "@utils/types/person";
import { PersonTable, StudentDB } from "@utils/types/database/person";
import { StudentTable as StudentTableType } from "@utils/types/database/person";

// Helper function
import { db2Student } from "@utils/backend/database";

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

  async function handleDelete() {
    // console.log(editingPerson);
    if (!editingPerson) {
      return;
    }

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
      .limit(1);

    // console.log(userid, editingPerson);

    if (selectingError || userid.length == 0) {
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

    // delete the person of the student
    const { data: person, error: personDeletingError } = await supabase
      .from<PersonTable>("people")
      .delete()
      .match({ id: deleting[0].person });

    if (personDeletingError || !person) {
      console.error(personDeletingError);
      return;
    }

    // delete account of the student
    await fetch(`/api/account`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: userid[0].id,
      }),
    });

    // console.log(person);

    setShowConfDel(false);
    router.replace(router.asPath);
  }

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
        onSubmit={() => handleDelete()}
      />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const { data, error } = await supabase
    .from<StudentDB>("student")
    .select(`id, std_id, people:person(*)`);

  if (error) {
    console.error(error);
  }

  // console.log(data);

  if (!data) {
    return { props: { allStudents: [] } };
  }

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
