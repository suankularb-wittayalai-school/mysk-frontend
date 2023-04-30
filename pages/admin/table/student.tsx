/**
 * `/admin/table/student` TABLE OF CONTENTS
 *
 * Note: `Ctrl` + click to jump to a component.
 *
 * **Components**
 * - {@link StudentRowActions}
 *
 * **Page**
 * - {@link ManageStudentsPage}
 */

// External libraries
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

import {
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import Head from "next/head";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { FC, useEffect, useMemo, useState } from "react";

// SK Components
import {
  Button,
  ContentLayout,
  DataTableColumnDef,
  FAB,
  MaterialIcon,
  Section,
  SegmentedButton,
} from "@suankularb-components/react";

// Internal components
import AdminDataTable from "@/components/admin/AdminDataTable";
import MySKPageHeader from "@/components/common/MySKPageHeader";

// Backend
import { getAdminStudentList } from "@/utils/backend/person/student";

// Helpers
import { withLoading } from "@/utils/helpers/loading";
import { createTitleStr } from "@/utils/helpers/title";

// Hooks
import { useLocale } from "@/utils/hooks/i18n";
import { useToggle } from "@/utils/hooks/toggle";

// Types
import { CustomPage, LangCode } from "@/utils/types/common";
import { StudentAdminListItem } from "@/utils/types/person";
import ConfirmDeleteDialog from "@/components/common/ConfirmDeleteDialog";

/**
 * The number of rows visible per page. Used in pagination.
 */
const rowsPerPage = 20;

/**
 * Row actions for a student in the Admin Data Table.
 *
 * @param row The data for the row this is placed in.
 *
 * @returns A Segmented Button.
 */
const StudentRowActions: FC<{ row: StudentAdminListItem }> = ({ row }) => {
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);

  return (
    <>
      <SegmentedButton alt="Row actions">
        {/* Edit */}
        <Button
          appearance="outlined"
          icon={<MaterialIcon icon="edit" />}
          tooltip="Edit this entry"
          onClick={() => setEditOpen(true)}
        />

        {/* Delete */}
        <Button
          appearance="outlined"
          icon={<MaterialIcon icon="delete" />}
          tooltip="Delete this entry"
          dangerous
          onClick={() => setDeleteOpen(true)}
        />
      </SegmentedButton>

      {/* Dialogs */}

      {/* Edit */}
      {/* TODO: Edit Student Dialog */}

      {/* Delete */}
      <ConfirmDeleteDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onSubmit={() => {
          // TODO: Actually delete this entry from the database
          setDeleteOpen(false);
        }}
      />
    </>
  );
};

/**
 * Displays a paginated Data Table of all students of all academic years, where
 * admins can add, edit, and remove students.
 *
 * @param studentList An array of Student Admin List Items.
 * @param totalStudentCount The total number of Students in the database, NOT taking into account the current academic year or pagination.
 *
 * @returns A Page.
 */
const ManageStudentsPage: CustomPage<{
  studentList: StudentAdminListItem[];
  totalStudentCount: number;
}> = ({ studentList, totalStudentCount }) => {
  const locale = useLocale();
  const { t } = useTranslation("admin", { keyPrefix: "data.manage.student" });

  const supabase = useSupabaseClient();

  // Data Table states
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [sorting, setSorting] = useState<SortingState>([
    { id: "studentID", desc: true },
  ]);
  const [page, setPage] = useState<number>(1);
  const [loading, toggleLoading] = useToggle();

  const [data, setData] = useState<any[]>(studentList);
  const [totalRows, setTotalRows] = useState<number>(totalStudentCount);

  // NOTE: the code for page and global filter change is nearly identical
  // across all `/admin/table` pages, not sure how to merge them into 1 place
  // though

  // Handle page change
  useEffect(() => {
    // Scroll to the top
    window.scroll({ top: 0 });
    setTotalRows(totalStudentCount);

    withLoading(
      // Fetch the new page if necessary
      async () => {
        setData(
          // This is an Immediately Invoked Function Expression (IIFE; pronounced
          // “iffy”), where we define a function fetching the page and
          // immediately call it
          // Learn more: https://developer.mozilla.org/en-US/docs/Glossary/IIFE
          await (async () => {
            // The first page is already fetched, so we can just use that
            if (page === 1) return studentList;

            // For other pages, we have to fetch that specific page from the
            // database
            const { data, error } = await getAdminStudentList(
              supabase,
              page,
              rowsPerPage,
              globalFilter // <-- For when a search result spans many pages
            );
            if (error) return studentList;
            return data;
          })()
        );
        return true;
      },
      toggleLoading,
      { hasEndToggle: true }
    );
  }, [page]);

  // Handle global filter
  useEffect(() => {
    withLoading(
      // Fetch the new page if necessary
      async () => {
        setData(
          await (async () => {
            // Reset the table if there is no global filter or if the filter is
            // a text query that is too short
            if (
              !globalFilter ||
              (!/[0-9]{1,5}/.test(globalFilter) && globalFilter.length < 3)
            ) {
              setTotalRows(totalStudentCount);
              return studentList;
            }

            // Fetch the rows with the global filter
            setPage(1);
            const { data, count, error } = await getAdminStudentList(
              supabase,
              1,
              rowsPerPage,
              globalFilter
            );
            setTotalRows(count);
            if (error) return [];
            return data;
          })()
        );
        return true;
      },
      toggleLoading,
      { hasEndToggle: true }
    );
  }, [globalFilter]);

  // Column definitions
  const columns = useMemo<DataTableColumnDef<StudentAdminListItem>[]>(
    () => [
      {
        accessorKey: "studentID",
        header: t("thead.studentID"),
        thAttr: { className: "w-2/12" },
        tdAttr: {
          align: "center",
          className: '[font-feature-settings:"tnum"on,"lnum"on]',
        },
      },
      {
        id: "nameTH",
        accessorFn: (row) => row.name.th,
        header: t("thead.nameTH"),
        thAttr: { className: "w-4/12" },
      },
      {
        id: "nameEN",
        accessorFn: (row) => row.name["en-US"],
        header: t("thead.nameEN"),
        thAttr: { className: "w-4/12" },
      },
      {
        id: "class",
        accessorFn: (row) => `M.${row.classItem.number}`,
        header: t("thead.class"),
        thAttr: { className: "w-1/12" },
        tdAttr: {
          align: "center",
          className: '[font-feature-settings:"tnum"on,"lnum"on]',
        },
      },
      {
        id: "classNo",
        accessorFn: (row) => row.classNo,
        header: t("thead.classNo"),
        thAttr: { className: "w-1/12" },
        tdAttr: {
          align: "right",
          className: '[font-feature-settings:"tnum"on,"lnum"on]',
        },
      },
    ],
    [locale]
  );

  // Tanstack Table setup
  const { getHeaderGroups, getRowModel } = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <>
      <Head>
        <title>{createTitleStr(t("title"), t)}</title>
      </Head>
      <MySKPageHeader
        title={t("title")}
        icon={<MaterialIcon icon="table" />}
        parentURL="/admin"
      />
      <ContentLayout>
        <Section>
          <AdminDataTable
            headerGroups={getHeaderGroups()}
            rowModel={getRowModel()}
            rowActions={(row) => <StudentRowActions row={row} />}
            globalFilter={globalFilter}
            onGlobalFilterChange={setGlobalFilter}
            totalRows={totalRows}
            rowsPerPage={rowsPerPage}
            onPageChange={setPage}
            loading={loading}
          />
        </Section>
      </ContentLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  req,
  res,
}) => {
  const supabase = createServerSupabaseClient({
    req: req as NextApiRequest,
    res: res as NextApiResponse,
  });

  const { data: studentList, count: totalStudentCount } =
    await getAdminStudentList(supabase, 1, rowsPerPage);

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "admin",
      ])),
      studentList,
      totalStudentCount,
    },
  };
};

// Admins can create a Student via this FAB.
ManageStudentsPage.fab = (
  <FAB
    color="primary"
    icon={<MaterialIcon icon="add" />}
    stateOnScroll="disappear"
  />
);

export default ManageStudentsPage;
