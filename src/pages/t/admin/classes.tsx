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
import EditClassDialog from "@components/dialogs/EditClass";
import ClassTable from "@components/tables/ClassTable";

// Types
import { Class } from "@utils/types/class";
import { ClassroomDB } from "@utils/types/database/class";
import { db2Class } from "@utils/backend/database";

// Page
const Classes: NextPage<{ allClasses: Class[] }> = ({
  allClasses,
}): JSX.Element => {
  const { t } = useTranslation("admin");
  const router = useRouter();

  const [showAdd, setShowAdd] = useState<boolean>(false);

  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [editingClass, setEditingClass] = useState<Class>();

  const [showConfDel, setShowConfDel] = useState<boolean>(false);

  async function handleDelete() {}

  return (
    <>
      {/* Head */}
      <Head>
        <title>
          {t("classList.title")}
          {" - "}
          {t("brand.name", { ns: "common" })}
        </title>
      </Head>

      {/* Page */}
      <RegularLayout
        Title={
          <Title
            name={{ title: t("classList.title") }}
            pageIcon={<MaterialIcon icon="meeting_room" />}
            backGoesTo="/t/admin"
            LinkElement={Link}
            key="title"
          />
        }
      >
        <Section>
          <div className="layout-grid-cols-3">
            <Search placeholder={t("classList.searchClasses")} />
            <div className="col-span-2 flex flex-row items-end justify-end gap-2">
              <Button
                label={t("classList.action.addClass")}
                type="filled"
                onClick={() => setShowAdd(true)}
              />
            </div>
          </div>
          <ClassTable
            classes={allClasses}
            setShowEdit={setShowEdit}
            setEditingClass={setEditingClass}
            setShowConfDel={setShowConfDel}
          />
        </Section>
      </RegularLayout>

      {/* Dialogs */}
      <EditClassDialog
        show={showEdit}
        onClose={() => setShowEdit(false)}
        // TODO: Refetch classes here ↓
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
        // TODO: Refetch classes here ↓
        onSubmit={() => {
          setShowAdd(false);
          router.replace(router.asPath);
        }}
        mode="add"
      />
      <ConfirmDelete
        show={showConfDel}
        onClose={() => setShowConfDel(false)}
        // TODO: Refetch classes here ↓
        onSubmit={() => {
          setShowConfDel(false);
          handleDelete();
          router.replace(router.asPath);
        }}
      />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  let allClasses: Class[] = [];

  const { data: classes, error } = await supabase
    .from<ClassroomDB>("classroom")
    .select("*, schedule:schedule(*)");

  if (error) {
    console.error(error);
  }

  if (classes) {
    allClasses = await Promise.all(
      classes.map(async (classItem) => await db2Class(classItem))
    );
  }

  // console.log(allClasses);

  return {
    props: {
      ...(await serverSideTranslations(locale as string, [
        "common",
        "admin",
        "account",
      ])),
      allClasses,
    },
  };
};

export default Classes;
