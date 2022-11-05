// External libraries
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { useEffect, useMemo, useState } from "react";

import { withPageAuth } from "@supabase/auth-helpers-nextjs";

// SK Components
import {
  Actions,
  Button,
  MaterialIcon,
  RegularLayout,
  Search,
  Section,
  Table,
  Title,
} from "@suankularb-components/react";

// Components
import CopyButton from "@components/CopyButton";
import DataTableBody from "@components/data-table/DataTableBody";
import DataTableHeader from "@components/data-table/DataTableHeader";
import ConfirmDelete from "@components/dialogs/ConfirmDelete";
import EditPersonDialog from "@components/dialogs/EditPerson";
import ImportDataDialog from "@components/dialogs/ImportData";

// Backend
import { db2Teacher } from "@utils/backend/database";

// Backend
import { deleteTeacher, importTeachers } from "@utils/backend/person/teacher";

// Types
import { LangCode } from "@utils/types/common";
import { ImportedTeacherData, Teacher } from "@utils/types/person";

// Helpers
import { nameJoiner } from "@utils/helpers/name";
import { createTitleStr } from "@utils/helpers/title";

// Hooks
import { useToggle } from "@utils/hooks/toggle";
import {
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

// Page-specific components
const TeacherTable = ({
  teachers,
  query,
  setEditingIdx,
  toggleShowEdit,
  toggleShowConfDel,
}: {
  teachers: Teacher[];
  query?: string;
  setEditingIdx: (id: number) => void;
  toggleShowEdit: () => void;
  toggleShowConfDel: () => void;
}) => {
  const { t } = useTranslation("admin");
  const locale = useRouter().locale as LangCode;

  const [globalFilter, setGlobalFilter] = useState<string>("");
  useEffect(() => setGlobalFilter(query || ""), [query]);
  const columns = useMemo(
    () => [
      {
        accessorKey: "teacherID",
        header: t("teacherList.table.id"),
        thClass: "w-2/12",
      },
      {
        accessorKey: "name",
        header: t("teacherList.table.name"),
        thClass: "w-6/12",
        tdClass: "!text-left",
      },
      {
        accessorKey: "classAdvisorAt",
        header: t("teacherList.table.classAdvisorAt"),
        thClass: "w-2/12",
        noDataMsg: (
          <div className="grid place-content-center">
            <Button
              type="text"
              icon={<MaterialIcon icon="add" />}
              iconOnly
              onClick={toggleShowEdit}
            />
          </div>
        ),
      },
    ],
    []
  );
  const data = useMemo(
    () =>
      teachers.map((teacher, idx) => ({
        idx,
        teacherID: teacher.teacherID.toString(),
        name: nameJoiner(locale, teacher.name, teacher.prefix, {
          prefix: true,
        }),
        classAdvisorAt: teacher.classAdvisorAt?.number
          ? t("class", { ns: "common", number: teacher.classAdvisorAt.number })
          : "",
      })),
    []
  );
  const { getHeaderGroups, getRowModel } = useReactTable({
    data,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <Table width={800}>
      <DataTableHeader
        headerGroups={getHeaderGroups()}
        endRow={<th className="w-2/12" />}
      />
      <DataTableBody
        rowModel={getRowModel()}
        endRow={(row) => (
          <td>
            <Actions align="center">
              <CopyButton textToCopy={row.name} />
              <Button
                name={t("teacherList.table.action.edit")}
                type="text"
                iconOnly
                icon={<MaterialIcon icon="edit" />}
                onClick={() => {
                  setEditingIdx(row.idx);
                  toggleShowEdit();
                }}
              />
              <Button
                type="text"
                iconOnly
                icon={<MaterialIcon icon="delete" />}
                isDangerous
                onClick={() => {
                  setEditingIdx(row.idx);
                  toggleShowConfDel();
                }}
              />
            </Actions>
          </td>
        )}
      />
    </Table>
  );
};

// Page
const Teachers: NextPage<{ teachers: Teacher[] }> = ({
  teachers,
}): JSX.Element => {
  const { t } = useTranslation("admin");
  const router = useRouter();

  const [query, setQuery] = useState<string>("");

  const [showAdd, toggleShowAdd] = useToggle();
  const [showImport, toggleShowImport] = useToggle();
  const [showConfDel, toggleShowConfDel] = useToggle();

  const [showEdit, toggleShowEdit] = useToggle();
  const [editingIdx, setEditingIdx] = useState<number>(-1);

  return (
    <>
      {/* Head */}
      <Head>
        <title>{createTitleStr(t("teacherList.title"), t)}</title>
      </Head>

      {/* Page */}
      <RegularLayout
        Title={
          <Title
            name={{ title: t("teacherList.title") }}
            pageIcon={<MaterialIcon icon="group" />}
            backGoesTo="/admin"
            LinkElement={Link}
            key="title"
          />
        }
      >
        <Section>
          <div className="layout-grid-cols-3">
            <Search
              placeholder={t("teacherList.searchTeachers")}
              onChange={setQuery}
            />
            <div className="flex flex-row items-end justify-end gap-2 md:col-span-2">
              <Button
                label={t("common.action.import")}
                type="outlined"
                icon={<MaterialIcon icon="file_upload" />}
                onClick={toggleShowImport}
              />
              <Button
                label={t("teacherList.action.addTeacher")}
                type="filled"
                icon={<MaterialIcon icon="add" />}
                onClick={toggleShowAdd}
              />
            </div>
          </div>
          <div>
            <TeacherTable
              teachers={teachers}
              query={query}
              setEditingIdx={setEditingIdx}
              toggleShowEdit={toggleShowEdit}
              toggleShowConfDel={toggleShowConfDel}
            />
          </div>
        </Section>
      </RegularLayout>

      {/* Dialogs */}
      <ImportDataDialog
        show={showImport}
        onClose={toggleShowImport}
        onSubmit={async (e: ImportedTeacherData[]) => {
          // console.log(e);
          await importTeachers(e);
          toggleShowImport();
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
        onClose={toggleShowEdit}
        onSubmit={() => {
          toggleShowEdit();
          router.replace(router.asPath);
        }}
        mode="edit"
        person={teachers[editingIdx]}
      />
      <EditPersonDialog
        show={showAdd}
        onClose={toggleShowAdd}
        onSubmit={() => {
          toggleShowAdd();
          router.replace(router.asPath);
        }}
        mode="add"
        userRole="teacher"
      />
      <ConfirmDelete
        show={showConfDel}
        onClose={toggleShowConfDel}
        onSubmit={() => {
          if (editingIdx < 0) return;
          deleteTeacher(teachers[editingIdx]).then(() => {
            router.replace(router.asPath);
            toggleShowConfDel();
          });
        }}
      />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = withPageAuth({
  async getServerSideProps({ locale }, supabase) {
    const { data, error } = await supabase
      .from("teacher")
      .select("*, person(*), subject_group(*)");

    if (error) {
      console.error(error);
      return { props: { teachers: [] } };
    }

    if (!data) return { props: { teachers: [] } };

    const teachers: Teacher[] = await Promise.all(
      data.map(async (teacher) => await db2Teacher(supabase, teacher))
    );

    return {
      props: {
        ...(await serverSideTranslations(locale as LangCode, [
          "common",
          "admin",
          "account",
        ])),
        teachers,
      },
    };
  },
});

export default Teachers;
