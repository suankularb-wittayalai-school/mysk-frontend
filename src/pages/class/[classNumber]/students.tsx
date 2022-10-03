// External libraries
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { useEffect, useMemo, useState } from "react";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

// SK Components
import {
  LayoutGridCols,
  MaterialIcon,
  RegularLayout,
  Search,
  Section,
  Table,
  Title,
} from "@suankularb-components/react";

// Backend
import {
  getClassIDFromNumber,
  getClassStudentList,
} from "@utils/backend/classroom/classroom";

// Helpers
import { nameJoiner } from "@utils/helpers/name";
import { createTitleStr } from "@utils/helpers/title";

// Types
import { LangCode } from "@utils/types/common";
import { StudentListItem } from "@utils/types/person";
import DataTableHeader from "@components/data-table/DataTableHeader";

const StudentList = ({
  students,
  query,
}: {
  students: StudentListItem[];
  query?: string;
}): JSX.Element => {
  const { t } = useTranslation(["class", "common"]);
  const locale = useRouter().locale as LangCode;

  // Query
  const [globalFilter, setGlobalFilter] = useState("");
  useEffect(() => setGlobalFilter(query || ""), [query]);

  // Table config
  const data = students.map((student) => ({
    id: student.id,
    classNo: student.classNo,
    name: nameJoiner(
      locale,
      student.name,
      t(`name.prefix.${student.prefix}`, { ns: "common" }),
      { prefix: true }
    ),
  }));
  const columns = useMemo<ColumnDef<object>[]>(
    () => [
      {
        accessorKey: "classNo",
        header: t("studentList.table.classNo"),
        thClass: "w-2/12",
        enableGlobalFilter: false,
      },
      {
        accessorKey: "name",
        header: t("studentList.table.name"),
        tdClass: "!text-left",
      },
    ],
    []
  );
  const { getHeaderGroups, getRowModel } = useReactTable({
    data,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
  });

  return (
    <div>
      <Table width={320}>
        <DataTableHeader headerGroups={getHeaderGroups()} />
        <tbody>
          {getRowModel().rows.map((row) => {
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td
                      key={cell.id}
                      className={
                        (
                          cell.column.columnDef as ColumnDef<object> & {
                            tdClass: string;
                          }
                        ).tdClass
                      }
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

const ClassStudents: NextPage<{
  classNumber: number;
  students: StudentListItem[];
}> = ({ classNumber, students }) => {
  const { t } = useTranslation("class");

  // Query
  const [query, setQuery] = useState("");

  return (
    <>
      <Head>
        <title>
          {createTitleStr(t("studentList.tabTitle", { classNumber }), t)}
        </title>
      </Head>

      <RegularLayout
        Title={
          <Title
            name={{
              title: t("studentList.title"),
              subtitle: t("class", { ns: "common", number: classNumber }),
            }}
            pageIcon={<MaterialIcon icon="groups" />}
            backGoesTo={`/class/${classNumber}/view`}
            LinkElement={Link}
          />
        }
      >
        <Section>
          <LayoutGridCols cols={3}>
            <Search
              placeholder={t("studentList.searchStudents")}
              onChange={setQuery}
            />
          </LayoutGridCols>
          <StudentList students={students} query={query} />
        </Section>
      </RegularLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  params,
}) => {
  const classNumber = Number(params?.classNumber);

  const { data: classID, error: classIDError } = await getClassIDFromNumber(
    classNumber
  );
  if (classIDError) return { notFound: true };

  const { data: students } = await getClassStudentList(classID as number);

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "class",
      ])),
      classNumber,
      students,
    },
  };
};

export default ClassStudents;
