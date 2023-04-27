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

import { useEffect, useMemo, useState } from "react";

// SK Components
import {
  ContentLayout,
  DataTable,
  DataTableBody,
  DataTableColumnDef,
  DataTableContent,
  DataTableHead,
  DataTablePagination,
  FAB,
  MaterialIcon,
  Progress,
  Section,
} from "@suankularb-components/react";

// Internal components
import MultilangText from "@/components/common/MultilingualText";
import MySKPageHeader from "@/components/common/MySKPageHeader";

// Backend
import { getAdminClasses } from "@/utils/backend/classroom/classroom";

// Helpers
import { nameJoiner } from "@/utils/helpers/name";
import { createTitleStr } from "@/utils/helpers/title";

// Hooks
import { useLocale } from "@/utils/hooks/i18n";

// Types
import { getLocaleYear } from "@/utils/helpers/date";
import { withLoading } from "@/utils/helpers/loading";
import { useToggle } from "@/utils/hooks/toggle";
import { ClassAdminListItem } from "@/utils/types/class";
import { CustomPage, LangCode } from "@/utils/types/common";

/**
 * The number of rows visible per page. Used in pagination.
 */
const rowsPerPage = 50;

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
  const { t } = useTranslation("admin");

  const supabase = useSupabaseClient();

  // Data Table states
  const [sorting, setSorting] = useState<SortingState>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, toggleLoading] = useToggle();

  const [data, setData] = useState<ClassAdminListItem[]>(classList);

  // Handle page change
  useEffect(() => {
    // Scroll to the top
    window.scroll({ top: 0 });

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
            if (page === 1) return classList;

            // For other pages, we have to fetch that specific page from the
            // database
            const { data, error } = await getAdminClasses(
              supabase,
              page,
              rowsPerPage
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

  // Column definitions
  const columns = useMemo<DataTableColumnDef<ClassAdminListItem>[]>(
    () => [
      // 3-digit number
      {
        accessorKey: "number",
        header: "Number",
        thAttr: { className: "w-2/12" },
        render: (row) => <>M.{row.number}</>,
      },
      // Full list of Class Advisors in both languages
      {
        accessorKey: "advisors",
        header: "Class advisors",
        thAttr: { className: "w-6/12" },
        render: (row) => (
          <MultilangText
            text={{
              // Thai
              th: row.classAdvisors
                .map((advisor) => nameJoiner("th", advisor.name))
                .join(", "),
              // American English
              "en-US": row.classAdvisors
                .map((advisor) => nameJoiner("en-US", advisor.name))
                .join(", "),
            }}
            options={{ hideEmptyLanguage: true, priorityLanguage: locale }}
          />
        ),
      },
      // Number of students
      {
        accessorKey: "studentCount",
        header: "Student count",
        thAttr: { className: "w-2/12" },
        render: (row: ClassAdminListItem) => <>{row.studentCount} students</>,
      },
      // Academic year
      {
        accessorKey: "year",
        header: "Academic year",
        thAttr: { className: "w-2/12" },
        render: (row: ClassAdminListItem) => (
          <>{getLocaleYear(locale, row.year)}</>
        ),
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

  // (@SiravitPhokeed)
  //
  // You might be wondering why there is no search here. The problem is the
  // current database is so poorly structured that most of the relevant data is
  // basically impossible to sort or filter by. `number` seems like the only
  // promising candidate (and perhaps the most useful), but we made the
  // decision to have it be a `bigint` and apparently Supabase refuses to allow
  // `like` on it.
  //
  // TL;DR: No search until we get an actually workable API.

  return (
    <>
      <Head>
        <title>{createTitleStr("Manage classes", t)}</title>
      </Head>
      <MySKPageHeader
        title="Manage classes"
        icon={<MaterialIcon icon="table" />}
        parentURL="/admin"
      />
      <ContentLayout>
        <Section>
          <DataTable>
            <Progress
              appearance="linear"
              alt="Loading table…"
              visible={loading}
            />
            <DataTableContent contentWidth={800}>
              <DataTableHead headerGroups={getHeaderGroups()} locale={locale} />
              <DataTableBody rowModel={getRowModel()} />
            </DataTableContent>
            <DataTablePagination
              rowsPerPage={rowsPerPage}
              totalRows={totalClassCount}
              locale={locale}
              onChange={setPage}
            />
          </DataTable>
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
