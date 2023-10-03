/**
 * `/admin/table/subject` TABLE OF CONTENTS
 *
 * Note: `Ctrl` + click to jump to a component.
 *
 * **Page**
 * - {@link ManageSubjectsPage}
 */

// External libraries
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
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
import PageHeader from "@/components/common/PageHeader";

// Backend

// Helpers
import withLoading from "@/utils/helpers/withLoading";
import getLocaleString from "@/utils/helpers/getLocaleString";
import { createTitleStr } from "@/utils/helpers/title";

// Hooks
import useLocale from "@/utils/helpers/useLocale";
import useToggle from "@/utils/helpers/useToggle";

// Types
import { getSubjectsForAdmin } from "@/utils/backend/subject/getSubjectsForAdmin";
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
const SubjectRowActions: FC<{ row: Pick<Subject, "id" | "name" | "code"> }> = ({
  row,
}) => {
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
  subjectList: Pick<Subject, "id" | "name" | "code">[];
  totalSubjectCount: number;
}> = ({ subjectList, totalSubjectCount }) => {
  const locale = useLocale();
  const { t } = useTranslation("admin", { keyPrefix: "data.manage.subject" });
  const { t: tCommon } = useTranslation("common");

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
            const { data, error } = await getSubjectsForAdmin(
              supabase,
              page,
              rowsPerPage,
              globalFilter, // <-- For when a search result spans many pages
              sorting,
            );
            if (error) return subjectList;
            return data;
          })(),
        );
        return true;
      },
      toggleLoading,
      { hasEndToggle: true },
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
            const { data, count, error } = await getSubjectsForAdmin(
              supabase,
              1,
              rowsPerPage,
              globalFilter,
              sorting,
            );
            setTotalRows(count);
            if (error) return [];
            return data;
          })(),
        );
        return true;
      },
      toggleLoading,
      { hasEndToggle: true },
    );
  }, [globalFilter]);

  // Column definitions
  const columns = useMemo<
    DataTableColumnDef<Pick<Subject, "id" | "name" | "code">>[]
  >(
    () => [
      {
        id: "codeTH",
        accessorFn: (row) => getLocaleString(row.code, "th"),
        header: t("thead.codeTH"),
        thAttr: { className: "w-2/12" },
      },
      {
        id: "codeEN",
        accessorFn: (row) => getLocaleString(row.code, "en-US"),
        header: t("thead.codeEN"),
        thAttr: { className: "w-2/12" },
      },
      {
        id: "nameTH",
        accessorFn: (row) => getLocaleString(row.name, "th"),
        header: t("thead.nameTH"),
        thAttr: { className: "w-3/12" },
      },
      {
        id: "nameEN",
        accessorFn: (row) => getLocaleString(row.name, "en-US"),
        header: t("thead.nameEN"),
        thAttr: { className: "w-3/12" },
      },
    ],
    [locale],
  );

  // console.log(data);

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
        <title>{createTitleStr(t("title"), tCommon)}</title>
      </Head>
      <PageHeader title={t("title")} parentURL="/admin" />
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
  const supabase = createPagesServerClient({
    req: req as NextApiRequest,
    res: res as NextApiResponse,
  });

  const { data: subjectList, count: totalSubjectCount } =
    await getSubjectsForAdmin(supabase, 1, rowsPerPage);

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
