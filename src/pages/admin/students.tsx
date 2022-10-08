// Modules
import type { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

import { useEffect, useMemo, useState } from "react";

import {
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

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
import DataTableHeader from "@components/data-table/DataTableHeader";
import DataTableBody from "@components/data-table/DataTableBody";
import ConfirmDelete from "@components/dialogs/ConfirmDelete";
import EditPersonDialog from "@components/dialogs/EditPerson";
import ImportDataDialog from "@components/dialogs/ImportData";
import CopyButton from "@components/CopyButton";

// Backend
import { db2Student } from "@utils/backend/database";
import { deleteStudent, importStudents } from "@utils/backend/person/student";

// Helpers
import { nameJoiner } from "@utils/helpers/name";
import { createTitleStr } from "@utils/helpers/title";

// Hooks
import { useToggle } from "@utils/hooks/toggle";

// Supabase
import { supabase } from "@utils/supabaseClient";

// Types
import { StudentDB } from "@utils/types/database/person";
import { LangCode } from "@utils/types/common";
import { ImportedStudentData, Student } from "@utils/types/person";

const StudentTable = ({
  students,
  query,
  setEditingIdx,
  toggleShowEdit,
  toggleShowConfDel,
}: {
  students: Student[];
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
        accessorKey: "studentID",
        header: t("studentList.table.id"),
        thClass: "w-2/12",
      },
      {
        accessorKey: "class",
        header: t("studentList.table.class"),
        thClass: "w-1/12",
      },
      {
        accessorKey: "classNo",
        header: t("studentList.table.classNo"),
        thClass: "w-1/12",
      },
      {
        accessorKey: "name",
        header: t("studentList.table.name"),
        thClass: "w-5/12",
        tdClass: "!text-left",
      },
    ],
    []
  );
  const data = useMemo(
    () =>
      students.map((student, idx) => ({
        idx,
        studentID: student.studentID.toString(),
        class: student.class.number.toString(),
        classNo: student.classNo.toString(),
        name: nameJoiner(
          locale,
          student.name,
          t(`name.prefix.${student.prefix}`, { ns: "common" }),
          { prefix: true }
        ),
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
                name={t("studentList.table.action.edit")}
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
const Students: NextPage<{ students: Student[] }> = ({
  students,
}): JSX.Element => {
  const { t } = useTranslation("admin");
  const router = useRouter();

  const [query, setQuery] = useState<string>("");

  const [showAdd, toggleShowAdd] = useToggle();
  const [showImport, setShowImport] = useState<boolean>(false);
  const [showConfDel, toggleShowConfDel] = useToggle();

  const [showEdit, toggleShowEdit] = useToggle();
  const [editingIdx, setEditingIdx] = useState<number>(-1);

  return (
    <>
      {/* Head */}
      <Head>
        <title>{createTitleStr(t("studentList.title"), t)}</title>
      </Head>

      {/* Page */}
      <RegularLayout
        Title={
          <Title
            name={{ title: t("studentList.title") }}
            pageIcon={<MaterialIcon icon="groups" />}
            backGoesTo="/admin"
            LinkElement={Link}
            key="title"
          />
        }
      >
        <Section>
          <div className="layout-grid-cols-3">
            <Search
              placeholder={t("studentList.searchStudents")}
              onChange={(e) => setQuery(e)}
            />
            <Actions className="md:col-span-2">
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
                onClick={toggleShowAdd}
              />
            </Actions>
          </div>
          <div>
            <StudentTable
              students={students}
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
        onClose={() => setShowImport(false)}
        onSubmit={async (e: ImportedStudentData[]) => {
          await importStudents(e);
          setShowImport(false);
          router.replace(router.asPath);
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
        onClose={toggleShowEdit}
        onSubmit={() => {
          toggleShowEdit();
          router.replace(router.asPath);
        }}
        mode="edit"
        person={students[editingIdx]}
      />
      <EditPersonDialog
        show={showAdd}
        onClose={toggleShowAdd}
        onSubmit={() => {
          toggleShowAdd();
          router.replace(router.asPath);
        }}
        mode="add"
        userRole="student"
      />
      <ConfirmDelete
        show={showConfDel}
        onClose={toggleShowConfDel}
        onSubmit={async () => {
          await deleteStudent(students[editingIdx]);
          toggleShowConfDel();
          router.replace(router.asPath);
        }}
      />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const { data, error } = await supabase
    .from<StudentDB>("student")
    .select(`id, std_id, people:person(*)`);

  if (error) console.error(error);
  if (!data) return { props: { students: [] } };

  const students: Student[] = (
    await Promise.all(data.map(async (student) => await db2Student(student)))
  ).sort((a, b) => (a.studentID < b.studentID ? -1 : 1));

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "admin",
        "account",
      ])),
      students,
    },
  };
};

export default Students;
