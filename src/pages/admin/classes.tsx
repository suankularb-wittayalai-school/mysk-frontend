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
  Card,
  CardSupportingText,
  LayoutGridCols,
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
import { useToggle } from "@utils/hooks/toggle";

// Page
const Classes: NextPage<{ classes: Class[] }> = ({ classes }): JSX.Element => {
  const { t } = useTranslation("admin");
  const router = useRouter();

  const [showAdd, toggleShowAdd] = useToggle();
  const [showGenerate, toggleShowGenerate] = useToggle();
  const [showImport, toggleShowImport] = useToggle();
  const [showConfDel, toggleShowConfDel] = useToggle();

  const [showEdit, toggleShowEdit] = useToggle();
  const [editingClass, setEditingClass] = useState<Class>();

  async function handleDelete() {
    const { error: classError } = await supabase
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
                  onClick={toggleShowImport}
                />
                <Button
                  label={t("classList.action.generate")}
                  type="outlined"
                  icon={<MaterialIcon icon="auto_awesome" />}
                  onClick={toggleShowGenerate}
                />
                <Button
                  label={t("classList.action.addClass")}
                  type="filled"
                  icon={<MaterialIcon icon="add" />}
                  onClick={toggleShowAdd}
                />
              </div>
            </div>
          </div>
          <LayoutGridCols cols={3}>
            {classes.map((classItem) => (
              <Card key={classItem.id} type="stacked">
                <CardSupportingText>
                  <p>TODO: {classItem.id}</p>
                </CardSupportingText>
              </Card>
            ))}
          </LayoutGridCols>
        </Section>
      </RegularLayout>

      {/* Dialogs */}
      <ImportDataDialog
        show={showImport}
        onClose={toggleShowImport}
        onSubmit={async (
          data: { number: number; year: number; semester: number }[]
        ) => {
          await handleImport(data);
          toggleShowImport();
          router.replace(router.asPath);
        }}
        columns={[
          { name: "number", type: "numeric (3-digit)" },
          { name: "year", type: "number (in AD)" },
        ]}
      />
      <GenerateClassesDialog
        show={showGenerate}
        onClose={toggleShowGenerate}
        onSubmit={() => {
          toggleShowGenerate();
          router.replace(router.asPath);
        }}
      />
      <EditClassDialog
        show={showEdit}
        onClose={toggleShowEdit}
        onSubmit={() => {
          toggleShowEdit();
          router.replace(router.asPath);
        }}
        mode="edit"
        classItem={editingClass}
      />
      <EditClassDialog
        show={showAdd}
        onClose={toggleShowAdd}
        onSubmit={() => {
          toggleShowAdd();
          router.replace(router.asPath);
        }}
        mode="add"
      />
      <ConfirmDelete
        show={showConfDel}
        onClose={toggleShowConfDel}
        onSubmit={async () => {
          toggleShowConfDel();
          await handleDelete();
          router.replace(router.asPath);
        }}
      />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  let classes: Class[] = [];

  const { data, error } = await supabase
    .from<ClassroomDB>("classroom")
    .select("*")
    .order("number", { ascending: true });

  if (error) console.error(error);

  if (data)
    classes = await Promise.all(
      data.map(async (classItem) => await db2Class(classItem))
    );

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "admin",
        "account",
        "class",
      ])),
      classes,
    },
  };
};

export default Classes;
