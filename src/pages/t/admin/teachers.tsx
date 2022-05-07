// Modules
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

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

// Supabase client
import { supabase } from "@utils/supabaseClient";

// Components
import ConfirmDelete from "@components/dialogs/ConfirmDelete";
import EditPersonDialog from "@components/dialogs/EditPerson";
import TeacherTable from "@components/tables/TeacherTable";

// Backend
import { db2Teacher } from "@utils/backend/database";

// Types
import { Role, Teacher } from "@utils/types/person";
import {
  PersonTable,
  TeacherDB,
  TeacherTable as TeacherTableType,
} from "@utils/types/database/person";
import ImportDataDialog from "@components/dialogs/ImportData";

// Hooks
import { useSession } from "@utils/hooks/auth";

// Page
const Teachers: NextPage<{ allTeachers: Array<Teacher> }> = ({
  allTeachers,
}): JSX.Element => {
  const { t } = useTranslation("admin");
  const router = useRouter();

  const [showAdd, setShowAdd] = useState<boolean>(false);
  const [showImport, setShowImport] = useState<boolean>(false);
  const [showConfDel, setShowConfDel] = useState<boolean>(false);

  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [editingPerson, setEditingPerson] = useState<Teacher>();

  const session = useSession({ loginRequired: true, adminOnly: true });
  
  
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
      .match({ teacher: editingPerson.id })
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

    const {
      data: deletingTeacher,
      error: teacherDeletingError,
    } = await supabase
      .from<TeacherTableType>("teacher")
      .delete()
      .match({ id: editingPerson.id });
    if (teacherDeletingError || !deletingTeacher) {
      console.error(teacherDeletingError);
      return;
    }
    // delete the person related to the teacher
    const {
      data: deletingPerson,
      error: personDeletingError,
    } = await supabase
      .from<PersonTable>("people")
      .delete()
      .match({ id: deletingTeacher[0].person });
    if (personDeletingError || !deletingPerson) {
      console.error(personDeletingError);
      return;
    }

    // Delete account of the teacher
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

  return (
    <>
      {/* Head */}
      <Head>
        <title>
          {t("teacherList.title")}
          {" - "}
          {t("brand.name", { ns: "common" })}
        </title>
      </Head>

      {/* Page */}
      <RegularLayout
        Title={
          <Title
            name={{ title: t("teacherList.title") }}
            pageIcon={<MaterialIcon icon="group" />}
            backGoesTo="/t/admin"
            LinkElement={Link}
            key="title"
          />
        }
      >
        <Section>
          <div className="layout-grid-cols-3">
            <Search placeholder={t("teacherList.searchTeachers")} />
            <div className="flex flex-row items-end justify-end gap-2 md:col-span-2">
              <Button
                label={t("common.action.import")}
                type="outlined"
                icon={<MaterialIcon icon="file_upload" />}
                onClick={() => setShowImport(true)}
              />
              <Button
                label={t("teacherList.action.addTeacher")}
                type="filled"
                icon={<MaterialIcon icon="add" />}
                onClick={() => setShowAdd(true)}
              />
            </div>
          </div>
          <TeacherTable
            teachers={allTeachers}
            setShowEdit={setShowEdit}
            setEditingPerson={setEditingPerson}
            setShowConfDelTeacher={setShowConfDel}
          />
        </Section>
      </RegularLayout>

      {/* Dialogs */}
      <ImportDataDialog
        show={showImport}
        onClose={() => setShowImport(false)}
        onSubmit={() => {
          setShowImport(false);
          router.replace(router.asPath);
        }}
        // prettier-ignore
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
          { name: "teacher_id", type: "text" },
          { name: "subject_group", type: '"วิทยาศาสตร์" | "คณิตศาสตร์" | "ภาษาต่างประเทศ" | "ภาษาไทย" | "สุขศึกษาและพลศึกษา" | "การงานอาชีพและเทคโนโลยี" | "ศิลปะ" | "สังคมศึกษา ศาสนา และวัฒนธรรม" | "การศึกษาค้นคว้าด้วยตนเอง"' },
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
        userRole="teacher"
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
    .from<TeacherDB>("teacher")
    .select("id, teacher_id, people:person(*), SubjectGroup:subject_group(*)");

  if (error) {
    console.error(error);
    return { props: { allTeachers: [] } };
  }

  if (!data) {
    return { props: { allTeachers: [] } };
  }
  // console.log(data);

  const allTeachers: Teacher[] = await Promise.all(
    data.map(async (student) => await db2Teacher(student))
  );

  return {
    props: {
      ...(await serverSideTranslations(locale as string, [
        "common",
        "admin",
        "account",
      ])),
      allTeachers,
    },
  };
};

export default Teachers;
