/**
 * `/admin/table/subject` TABLE OF CONTENTS
 *
 * Note: `Ctrl` + click to jump to a component.
 *
 * **Page**
 * - {@link ManageSubjectsPage}
 */

// External libraries
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

import {
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
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
import ConfirmDeleteDialog from "@/components/common/ConfirmDeleteDialog";
import MySKPageHeader from "@/components/common/MySKPageHeader";

// Backend
import { getAdminSubjectList } from "@/utils/backend/subject/subject";

// Helpers
import { getLocaleYear } from "@/utils/helpers/date";
import { getLocaleObj, getLocaleString } from "@/utils/helpers/i18n";
import { withLoading } from "@/utils/helpers/loading";
import { createTitleStr } from "@/utils/helpers/title";

// Hooks
import { useLocale } from "@/utils/hooks/i18n";
import { useToggle } from "@/utils/hooks/toggle";

// Types
import { CustomPage, LangCode } from "@/utils/types/common";
import { Subject } from "@/utils/types/subject";

/**
 * The number of rows visible per page. Used in pagination.
 */
const rowsPerPage = 20;

/**
 * Row actions for a subject in the Admin Data Table.
 *
 * @param row The data for the row this is placed in.
 *
 * @returns A Segmented Button.
 */
const SubjectRowActions: FC<{ row: Subject }> = ({ row }) => {
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
      {/* TODO: Edit Subject Dialog */}

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
 * Displays a paginated Data Table of all subjects of all academic years, where
 * admins can add, edit, and remove subjects.
 *
 * @param subjectList An array of Subject Admin List Items.
 * @param totalSubjectCount The total number of Subjects in the database, NOT taking into account the current academic year or pagination.
 *
 * @returns A Page.
 */
const ManageSubjectsPage: CustomPage<{
  subjectList: Subject[];
  totalSubjectCount: number;
}> = ({ subjectList, totalSubjectCount }) => {
  const locale = useLocale();
  const { t } = useTranslation("admin");

  const supabase = useSupabaseClient();

  // Data Table states
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, toggleLoading] = useToggle();

  const [data, setData] = useState(subjectList);
  const [totalRows, setTotalRows] = useState<number>(totalSubjectCount);

  // NOTE: the code for page and global filter change is nearly identical
  // across all `/admin/table` pages (see `/admin/table/student` for best
  // explanation), not sure how to merge them into 1 place though

  // Handle page and sorting state change
  useEffect(() => {
    // Scroll to the top
    window.scroll({ top: 0 });
    setTotalRows(totalSubjectCount);

    withLoading(
      // Fetch the new page if necessary
      async () => {
        setData(
          await (async () => {
            // The first page is already fetched, so we can just use that
            if (page === 1 && !sorting.length) return subjectList;

            // For other pages, we have to fetch that specific page from the
            // database
            const { data, error } = await getAdminSubjectList(
              supabase,
              page,
              rowsPerPage,
              globalFilter, // <-- For when a search result spans many pages
              sorting
            );
            if (error) return subjectList;
            return data;
          })()
        );
        return true;
      },
      toggleLoading,
      { hasEndToggle: true }
    );
  }, [page, sorting]);

  // Handle global filter
  useEffect(() => {
    withLoading(
      // Fetch the new page if necessary
      async () => {
        setData(
          await (async () => {
            // Reset the table if there is no global filter
            if (!globalFilter) {
              setTotalRows(totalSubjectCount);
              return subjectList;
            }

            // Fetch the rows with the global filter
            setPage(1);
            const { data, count, error } = await getAdminSubjectList(
              supabase,
              1,
              rowsPerPage,
              globalFilter,
              sorting
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
  const columns = useMemo<DataTableColumnDef<Subject>[]>(
    () => [
      {
        id: "codeTH",
        accessorFn: (row) => getLocaleString(row.code, "th"),
        header: "Thai code",
        thAttr: { className: "w-2/12" },
      },
      {
        id: "codeEN",
        accessorFn: (row) => getLocaleString(row.code, "en-US"),
        header: "English code",
        thAttr: { className: "w-2/12" },
      },
      {
        id: "nameTH",
        accessorFn: (row) => getLocaleObj(row.name, "th").name,
        header: "Thai name",
        thAttr: { className: "w-3/12" },
      },
      {
        id: "nameEN",
        accessorFn: (row) => getLocaleObj(row.name, "en-US").name,
        header: "English name",
        thAttr: { className: "w-3/12" },
      },
      {
        id: "year",
        accessorFn: (row) => getLocaleYear(locale, row.year),
        header: "Academic year",
        thAttr: { className: "w-1/12" },
        tdAttr: { align: "center" },
      },
      {
        accessorKey: "semester",
        header: "Semester",
        thAttr: { className: "w-1/12" },
        tdAttr: { align: "center" },
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
    // (@SiravitPhokeed)
    // We’re not using `getSortedRowModel` because we’re sorting directly on
    // Supabase in `getAdminSubjectList`.
  });

  return (
    <>
      <Head>
        <title>{createTitleStr("Manage subjects", t)}</title>
      </Head>
      <MySKPageHeader
        title="Manage subjects"
        icon={<MaterialIcon icon="table" />}
        parentURL="/admin"
      />
      <ContentLayout>
        <Section>
          <AdminDataTable
            headerGroups={getHeaderGroups()}
            rowModel={getRowModel()}
            rowActions={(row) => <SubjectRowActions row={row} />}
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

  const { data: subjectList, count: totalSubjectCount } =
    await getAdminSubjectList(supabase, 1, rowsPerPage);

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "admin",
      ])),
      subjectList,
      totalSubjectCount,
    },
  };
};

// Admins can create a Subject via this FAB.
ManageSubjectsPage.fab = (
  <FAB
    color="primary"
    icon={<MaterialIcon icon="add" />}
    stateOnScroll="disappear"
  />
);

export default ManageSubjectsPage;
