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
  DataTableSearch,
  FAB,
  MaterialIcon,
  Progress,
  Section,
} from "@suankularb-components/react";

// Internal components
import MySKPageHeader from "@/components/common/MySKPageHeader";

// Helpers
import { createTitleStr } from "@/utils/helpers/title";

// Hooks
import { useLocale } from "@/utils/hooks/i18n";
import { useToggle } from "@/utils/hooks/toggle";

// Types
import { CustomPage, LangCode } from "@/utils/types/common";

/**
 * The number of rows visible per page. Used in pagination.
 */
const rowsPerPage = 250;

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
  subjectList: any[];
  totalSubjectCount: number;
}> = ({ subjectList, totalSubjectCount }) => {
  const locale = useLocale();
  const { t } = useTranslation("admin");

  const supabase = useSupabaseClient();

  // Data Table states
  const [globalFilter, setGlobablFilter] = useState<string>("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, toggleLoading] = useToggle();

  const [data, setData] = useState(subjectList);
  const [totalRows, setTotalRows] = useState<number>(totalSubjectCount);

  // Handle page change
  useEffect(() => {
    // Scroll to the top
    window.scroll({ top: 0 });

    // TODO

    setTotalRows(totalSubjectCount);
  });

  // Handle global filter
  useEffect(() => {
    // TODO
  }, [globalFilter]);

  // Column definitions
  const columns = useMemo<DataTableColumnDef[]>(
    () => [
      {
        id: "subjectCode",
        header: "Subject code",
      },
      {
        id: "subjectName",
        header: "Subject name",
      },
      {
        id: "teachers",
        header: "Teachers",
      },
      {
        id: "year",
        header: "Academic year",
      },
      {
        id: "semester",
        header: "Semester",
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
        <title>{createTitleStr("Manage subjects", t)}</title>
      </Head>
      <MySKPageHeader
        title="Manage subjects"
        icon={<MaterialIcon icon="table" />}
        parentURL="/admin"
      />
      <ContentLayout>
        <Section>
          <DataTable>
            <DataTableSearch
              value={globalFilter}
              locale={locale}
              onChange={setGlobablFilter}
            />
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
              totalRows={totalRows}
              locale={locale}
              onChange={setPage}
              className="sticky bottom-20 sm:bottom-0"
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

  const { data: subjectList, count: totalSubjectCount } = {
    data: [],
    count: 0,
  };

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
