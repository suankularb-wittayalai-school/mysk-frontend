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
  Actions,
  Button,
  Card,
  CardHeader,
  Header,
  LayoutGridCols,
  MaterialIcon,
  RegularLayout,
  Search,
  Section,
  Title,
} from "@suankularb-components/react";

// Components
import ConfirmDelete from "@components/dialogs/ConfirmDelete";
import EditClassDialog from "@components/dialogs/EditClass";
import GenerateClassesDialog from "@components/dialogs/GenerateClasses";
import ImportDataDialog from "@components/dialogs/ImportData";
import HoverList from "@components/HoverList";

// Backend
import {
  deleteClassroom,
  importClasses,
} from "@utils/backend/classroom/classroom";
import { db2Class } from "@utils/backend/database";

// Types
import { Class } from "@utils/types/class";
import { LangCode } from "@utils/types/common";
import { ClassroomDB } from "@utils/types/database/class";

// Helpers
import { range } from "@utils/helpers/array";
import { createTitleStr } from "@utils/helpers/title";

// Hooks
import { useToggle } from "@utils/hooks/toggle";

// Page-specific components
const GradeSection = ({
  grade,
  classes,
  setEditingClass,
  toggleShowEdit,
  toggleShowConfDel,
}: {
  grade: number;
  classes: Class[];
  setEditingClass: (classItem: Class) => void;
  toggleShowEdit: () => void;
  toggleShowConfDel: () => void;
}): JSX.Element => {
  const { t } = useTranslation(["admin", "common"]);
  return (
    <Section>
      <Header
        icon={<MaterialIcon icon="subdirectory_arrow_right" allowCustomSize />}
        text={t("class", { ns: "common", number: grade })}
      />
      <LayoutGridCols cols={3}>
        {classes.map((classItem) => (
          <Card key={classItem.id} type="stacked" appearance="tonal">
            <CardHeader
              title={
                <h3>
                  {t("class", { ns: "common", number: classItem.number })}
                </h3>
              }
              label={
                classItem.classAdvisors.length == 0 ? (
                  <p className="text-outline">
                    {t("classList.card.noAdvisors")}
                  </p>
                ) : (
                  <HoverList people={classItem.classAdvisors} />
                )
              }
              end={
                <Actions>
                  <Button
                    type="text"
                    icon={<MaterialIcon icon="delete" />}
                    iconOnly
                    isDangerous
                    onClick={() => {
                      setEditingClass(classItem);
                      toggleShowConfDel();
                    }}
                  />
                  <Button
                    type="text"
                    icon={<MaterialIcon icon="edit" />}
                    iconOnly
                    onClick={() => {
                      setEditingClass(classItem);
                      toggleShowEdit();
                    }}
                  />
                </Actions>
              }
            />
          </Card>
        ))}
      </LayoutGridCols>
    </Section>
  );
};

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
        </Section>

        {range(Math.floor(classes[classes.length - 1].number / 100), 1).map(
          (grade) => (
            <GradeSection
              key={grade}
              grade={grade}
              classes={classes.filter(
                (classItem) =>
                  classItem.number > grade * 100 &&
                  classItem.number < (grade + 1) * 100
              )}
              setEditingClass={setEditingClass}
              toggleShowEdit={toggleShowEdit}
              toggleShowConfDel={toggleShowConfDel}
            />
          )
        )}
      </RegularLayout>

      {/* Dialogs */}
      <ImportDataDialog
        show={showImport}
        onClose={toggleShowImport}
        onSubmit={async (
          data: { number: number; year: number; semester: number }[]
        ) => {
          await importClasses(data);
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
          if (editingClass) await deleteClassroom(editingClass);
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
