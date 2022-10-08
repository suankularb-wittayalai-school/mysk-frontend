// Modules
import type { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

import { useState } from "react";

// Supabase
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
import ClassTable from "@components/tables/ClassTable";
import ConfirmDelete from "@components/dialogs/ConfirmDelete";
import EditClassDialog from "@components/dialogs/EditClass";
import GenerateClassesDialog from "@components/dialogs/GenerateClasses";
import ImportDataDialog from "@components/dialogs/ImportData";

// Backend
import { db2Class } from "@utils/backend/database";

// Types
import { Class } from "@utils/types/class";
import { LangCode } from "@utils/types/common";
import { ClassroomDB, ClassroomTable } from "@utils/types/database/class";

// Helpers
import { createTitleStr } from "@utils/helpers/title";

// Hooks
import { createClassroom } from "@utils/backend/classroom/classroom";

// Page
const Classes: NextPage<{ allClasses: Class[] }> = ({
  allClasses,
}): JSX.Element => {
  const { t } = useTranslation("admin");
  const router = useRouter();

  const [showAdd, setShowAdd] = useState<boolean>(false);
  const [showGenerate, setShowGenerate] = useState<boolean>(false);
  const [showImport, setShowImport] = useState<boolean>(false);
  const [showConfDel, setShowConfDel] = useState<boolean>(false);

  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [editingClass, setEditingClass] = useState<Class>();

  async function handleDelete() {
    const { data: _, error: classError } = await supabase
      .from<ClassroomTable>("classroom")
      .delete()
      .match({ id: editingClass?.id });
    if (classError) {
      console.error(classError);
    }
  }

  async function handleImport(classes: { number: number; year: number }[]) {
    const classesToImport: Class[] = classes.map((classData) => ({
      id: 0,
      number: classData.number,
      year: classData.year,
      students: [],
      classAdvisors: [],
      schedule: {
        id: 0,
        content: [],
      },
      contacts: [],
      subjects: [],
    }));

    await Promise.all(
      classesToImport.map(async (classItem) => await createClassroom(classItem))
    );
  }

  return (
    <>
      {/* Head */}
      <Head>
        <title>{createTitleStr(t("classList.title"), t)}</title>
      </Head>

      {/* Page */}
      <RegularLayout
        Title={
          <Title
            name={{ title: t("classList.title") }}
            pageIcon={<MaterialIcon icon="meeting_room" />}
            backGoesTo="/admin"
            LinkElement={Link}
            key="title"
          />
        }
      >
        <Section>
          <div className="layout-grid-cols-3">
            <Search placeholder={t("classList.searchClasses")} />
            <div className="flex flex-row items-end md:col-span-2">
              <div
                className="flex w-full flex-row flex-wrap items-center justify-end
                  gap-2 sm:flex-nowrap"
              >
                <Button
                  label={t("common.action.import")}
                  type="text"
                  onClick={() => setShowImport(true)}
                />
                <Button
                  label={t("classList.action.generate")}
                  type="outlined"
                  icon={<MaterialIcon icon="auto_awesome" />}
                  onClick={() => setShowGenerate(true)}
                />
                <Button
                  label={t("classList.action.addClass")}
                  type="filled"
                  icon={<MaterialIcon icon="add" />}
                  onClick={() => setShowAdd(true)}
                />
              </div>
            </div>
          </div>
          <div>
            <ClassTable
              classes={allClasses}
              setShowEdit={setShowEdit}
              setEditingClass={setEditingClass}
              setShowConfDel={setShowConfDel}
            />
          </div>
        </Section>
      </RegularLayout>

      {/* Dialogs */}
      <ImportDataDialog
        show={showImport}
        onClose={() => setShowImport(false)}
        onSubmit={(e: { number: number; year: number; semester: number }[]) => {
          // console.log(e);

          handleImport(e).then(() => {
            setShowImport(false);
            router.replace(router.asPath);
          });
        }}
        columns={[
          { name: "number", type: "numeric (3-digit)" },
          { name: "year", type: "number (in AD)" },
        ]}
      />
      <GenerateClassesDialog
        show={showGenerate}
        onClose={() => setShowGenerate(false)}
        onSubmit={() => {
          setShowGenerate(false);
          router.replace(router.asPath);
        }}
      />
      <EditClassDialog
        show={showEdit}
        onClose={() => setShowEdit(false)}
        onSubmit={() => {
          setShowEdit(false);
          router.replace(router.asPath);
        }}
        mode="edit"
        classItem={editingClass}
      />
      <EditClassDialog
        show={showAdd}
        onClose={() => setShowAdd(false)}
        onSubmit={() => {
          setShowAdd(false);
          router.replace(router.asPath);
        }}
        mode="add"
      />
      <ConfirmDelete
        show={showConfDel}
        onClose={() => setShowConfDel(false)}
        onSubmit={() => {
          setShowConfDel(false);
          handleDelete().then(() => router.replace(router.asPath));
        }}
      />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  let allClasses: Class[] = [];

  const { data: classes, error } = await supabase
    .from<ClassroomDB>("classroom")
    .select("*")
    .order("number", { ascending: true });

  if (error) console.error(error);

  if (classes) {
    allClasses = await Promise.all(
      classes.map(async (classItem) => await db2Class(classItem))
    );
  }

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "admin",
        "account",
        "class",
      ])),
      allClasses,
    },
  };
};

export default Classes;
