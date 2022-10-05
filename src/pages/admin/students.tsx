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

// Backend
import { db2Student } from "@utils/backend/database";
import { deleteStudent, importStudents } from "@utils/backend/person/student";

// Helpers
import { createTitleStr } from "@utils/helpers/title";

// Supabase
import { supabase } from "@utils/supabaseClient";

// Types
import { LangCode } from "@utils/types/common";
import { ImportedStudentData, Student } from "@utils/types/person";
import { StudentDB } from "@utils/types/database/person";
import { nameJoiner } from "@utils/helpers/name";

const StudentTable = ({
  students,
  query,
}: {
  students: Student[];
  query?: string;
}) => {
  const { t } = useTranslation("admin");
  const locale = useRouter().locale as LangCode;

  const [globalFilter, setGlobalFilter] = useState<string>("");
  useEffect(() => setGlobalFilter(query || ""), [query]);
  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
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
        thClass: "w-6/12",
        tdClass: "!text-left",
      },
    ],
    []
  );
  const data = useMemo(
    () =>
      students.map((student) => ({
        id: student.studentID.toString(),
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
        endRow={<th className="w-1/12" />}
      />
      <DataTableBody
        rowModel={getRowModel()}
        endRow={
          <td>
            {" "}
            <div className="flex flex-row justify-center gap-2">
              <Button
                name={t("studentList.table.action.copy")}
                type="text"
                iconOnly
                icon={<MaterialIcon icon="content_copy" />}
                onClick={() => {}}
                className="!hidden sm:!block"
              />
              <Button
                name={t("studentList.table.action.edit")}
                type="text"
                iconOnly
                icon={<MaterialIcon icon="edit" />}
                onClick={() => {}}
              />
              <Button
                type="text"
                iconOnly
                icon={<MaterialIcon icon="delete" />}
                isDangerous
                onClick={() => {}}
              />
            </div>
          </td>
        }
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

  const [showAdd, setShowAdd] = useState<boolean>(false);
  const [showImport, setShowImport] = useState<boolean>(false);
  const [showConfDel, setShowConfDel] = useState<boolean>(false);

  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [editingPerson, setEditingPerson] = useState<Student>();

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
              students={students}
              query={query}
              // setShowEdit={setShowEdit}
              // setEditingPerson={setEditingPerson}
              // setShowConfDelStudent={setShowConfDel}
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
        onSubmit={async () => {
          if (!editingPerson) return;
          await deleteStudent(editingPerson.id);
          setShowConfDel(false);
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

  const students: Student[] = await Promise.all(
    data.map(async (student) => await db2Student(student))
  );

  return {
    props: {
      ...(await serverSideTranslations(locale as string, [
        "common",
        "admin",
        "account",
      ])),
      students,
    },
  };
};

export default Students;
