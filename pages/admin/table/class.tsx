/**
 * `/admin/table/class` TABLE OF CONTENTS
 *
 * Note: `Ctrl` + click to jump to a component.
 *
 * **Components**
 * - {@link ClassRowActions}
 *
 * **Page**
 * - {@link ManageClassesPage}
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
import ConfirmDeleteDialog from "@/components/common/ConfirmDeleteDialog";
import MySKPageHeader from "@/components/common/MySKPageHeader";

// Backend
import { getAdminClasses } from "@/utils/backend/classroom/classroom";

// Helpers
import { getLocaleYear } from "@/utils/helpers/date";
import { withLoading } from "@/utils/helpers/loading";
import { nameJoiner } from "@/utils/helpers/name";
import { createTitleStr } from "@/utils/helpers/title";

// Hooks
import { useLocale } from "@/utils/hooks/i18n";
import { useToggle } from "@/utils/hooks/toggle";

// Types
import { ClassAdminListItem } from "@/utils/types/class";
import { CustomPage, LangCode } from "@/utils/types/common";

/**
 * The number of rows visible per page. Used in pagination.
 */
const rowsPerPage = 20;

/**
 * Row actions for a class in the Admin Data Table.
 *
 * @param row The data for the row this is placed in.
 *
 * @returns A Segmented Button.
 */
const ClassRowActions: FC<{ row: ClassAdminListItem }> = ({ row }) => {
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
      {/* TODO: Edit Class Dialog */}

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
 * Displays a paginated Data Table of all classes of all academic years, where
 * admins can add, edit, and remove classes.
 *
 * @param classList An array of Class Admin List Items.
 * @param totalClassCount The total number of Classes in the database, NOT taking into account the current academic year or pagination.
 *
 * @returns A Page.
 */
const ManageClassesPage: CustomPage<{
  classList: ClassAdminListItem[];
  totalClassCount: number;
}> = ({ classList, totalClassCount }) => {
  const locale = useLocale();
  const { t } = useTranslation("admin", { keyPrefix: "data.manage.class" });

  const supabase = useSupabaseClient();

  // Data Table states
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, toggleLoading] = useToggle();

  const [data, setData] = useState<ClassAdminListItem[]>(classList);
  const [totalRows, setTotalRows] = useState<number>(totalClassCount);

  // NOTE: the code for page and global filter change is nearly identical
  // across all `/admin/table` pages (see `/admin/table/student` for best
  // explanation), not sure how to merge them into 1 place though

  // Handle page change
  useEffect(() => {
    // Scroll to the top
    window.scroll({ top: 0 });
    setTotalRows(totalClassCount);

    withLoading(
      // Fetch the new page if necessary
      async () => {
        setData(
          await (async () => {
            // The first page is already fetched, so we can just use that
            if (page === 1) return classList;

            // For other pages, we have to fetch that specific page from the
            // database
            const { data, error } = await getAdminClasses(
              supabase,
              page,
              rowsPerPage,
              globalFilter // <-- For when a search result spans many pages
            );
            if (error) return classList;
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
            // Reset the table if there is no global filter
            if (!globalFilter) {
              setTotalRows(totalClassCount);
              return classList;
            }

            // Fetch the rows with the global filter
            setPage(1);
            const { data, count, error } = await getAdminClasses(
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
  const columns = useMemo<DataTableColumnDef<ClassAdminListItem>[]>(
    () => [
      // 3-digit number
      {
        id: "number",
        accessorFn: (row) => t("tbody.class",{number: row.number}),
        header: t("thead.number"),
        thAttr: { className: "w-1/12" },
      },
      // Full list of Class Advisors in both languages
      {
        id: "classAdvisorsTH",
        accessorFn: (row) =>
          row.classAdvisors
            .map((advisor) => nameJoiner("th", advisor.name))
            .join(", "),
        header: t("thead.classAdvisorsTH"),
        thAttr: { className: "w-4/12" },
        render: (row) => (
          <ul className="list-disc pl-6">
            {row.classAdvisors.map((advisor) => (
              <li key={advisor.id}>
                {nameJoiner("th", advisor.name, advisor.prefix)}
              </li>
            ))}
          </ul>
        ),
      },
      {
        id: "classAdvisorsEN",
        accessorFn: (row) =>
          row.classAdvisors
            .map((advisor) => nameJoiner("en-US", advisor.name))
            .join(", "),
        header: t("thead.classAdvisorsEN"),
        thAttr: { className: "w-4/12" },
        render: (row) => (
          <ul className="list-disc pl-6">
            {row.classAdvisors.map((advisor) => (
              <li key={advisor.id}>
                {nameJoiner("en-US", advisor.name, advisor.prefix)}
              </li>
            ))}
          </ul>
        ),
      },
      // Number of students
      {
        id: "studentCount",
        accessorFn: (row) => t("tbody.studentCount",{count: row.studentCount}),
        header: t("thead.studentCount"),
        thAttr: { className: "w-2/12" },
      },
      // Academic year
      {
        id: "year",
        accessorFn: (row) => getLocaleYear(locale, row.year),
        header: t("thead.year"),
        thAttr: { className: "w-1/12" },
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
            rowActions={(row) => <ClassRowActions row={row} />}
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

  const { data: classList } = await getAdminClasses(supabase, 1, rowsPerPage);

  const { count: totalClassCount } = await supabase
    .from("classroom")
    .select("id", { count: "exact", head: true });

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "admin",
      ])),
      classList,
      totalClassCount,
    },
  };
};

// Admins can create a Class via this FAB.
ManageClassesPage.fab = (
  <FAB
    color="primary"
    icon={<MaterialIcon icon="add" />}
    stateOnScroll="disappear"
  />
);

export default ManageClassesPage;
