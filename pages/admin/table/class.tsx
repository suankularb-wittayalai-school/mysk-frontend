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
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
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
import PageHeader from "@/components/common/PageHeader";

// Backend
// import { getAdminClasses } from "@/utils/backend/classroom/classroom";

// Helpers
import { getLocaleYear } from "@/utils/helpers/date";
import withLoading from "@/utils/helpers/withLoading";
import getLocaleName from "@/utils/helpers/getLocaleName";
import { createTitleStr } from "@/utils/helpers/title";

// Hooks
import useLocale from "@/utils/helpers/useLocale";
import useToggle from "@/utils/helpers/useToggle";

// Types
import { Classroom } from "@/utils/types/classroom";
import { CustomPage, LangCode } from "@/utils/types/common";
import { getClassroomsForAdmin } from "@/utils/backend/classroom/getClassroomsForAdmin";

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
const ClassRowActions: FC<{
  row: Pick<Classroom, "id" | "number" | "class_advisors" | "year"> & {
    studentCount: number;
  };
}> = ({ row }) => {
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
  classList: (Pick<Classroom, "id" | "number" | "class_advisors" | "year"> & {
    studentCount: number;
  })[];
  totalClassCount: number;
}> = ({ classList, totalClassCount }) => {
  const locale = useLocale();
  const { t } = useTranslation("admin", { keyPrefix: "data.manage.class" });
  const { t: tCommon } = useTranslation("common");

  const supabase = useSupabaseClient();

  // Data Table states
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, toggleLoading] = useToggle();

  const [data, setData] = useState<
    (Pick<Classroom, "id" | "number" | "class_advisors" | "year"> & {
      studentCount: number;
    })[]
  >(classList);
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
            const { data, error } = await getClassroomsForAdmin(
              supabase,
              page,
              rowsPerPage,
              globalFilter, // <-- For when a search result spans many pages
            );
            if (error) return classList;
            return data;
          })(),
        );
        return true;
      },
      toggleLoading,
      { hasEndToggle: true },
    );
  }, [page]);

  // console.log(data);

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
            const { data, count, error } = await getClassroomsForAdmin(
              supabase,
              1,
              rowsPerPage,
              globalFilter,
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
    DataTableColumnDef<
      Pick<Classroom, "id" | "number" | "class_advisors" | "year"> & {
        studentCount: number;
      }
    >[]
  >(
    () => [
      // 3-digit number
      {
        id: "number",
        accessorFn: (row) => t("tbody.class", { number: row.number }),
        header: t("thead.number"),
        thAttr: { className: "w-1/12" },
      },
      // Full list of Class Advisors in both languages
      {
        id: "classAdvisorsTH",
        accessorFn: (row) =>
          row.class_advisors
            .map((advisor) => getLocaleName("th", advisor))
            .join(", "),
        header: t("thead.classAdvisorsTH"),
        thAttr: { className: "w-4/12" },
        render: (row) => (
          <ul className="list-disc pl-6">
            {row.class_advisors.map((advisor) => (
              <li key={advisor.id}>{getLocaleName("th", advisor)}</li>
            ))}
          </ul>
        ),
      },
      {
        id: "classAdvisorsEN",
        accessorFn: (row) =>
          row.class_advisors
            .map((advisor) => getLocaleName("en-US", advisor))
            .join(", "),
        header: t("thead.classAdvisorsEN"),
        thAttr: { className: "w-4/12" },
        render: (row) => (
          <ul className="list-disc pl-6">
            {row.class_advisors.map((advisor) => (
              <li key={advisor.id}>{getLocaleName("en-US", advisor)}</li>
            ))}
          </ul>
        ),
      },
      // Number of students
      {
        id: "studentCount",
        accessorFn: (row) =>
          t("tbody.studentCount", { count: row.studentCount }),
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
    [locale],
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
        <title>{createTitleStr(t("title"), tCommon)}</title>
      </Head>
      <PageHeader title={t("title")} parentURL="/admin" />
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
  const supabase = createPagesServerClient({
    req: req as NextApiRequest,
    res: res as NextApiResponse,
  });

  const { data: classList } = await getClassroomsForAdmin(
    supabase,
    1,
    rowsPerPage,
  );

  const { count: totalClassCount } = await supabase
    .from("classrooms")
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
