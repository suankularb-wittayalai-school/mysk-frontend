// Imports
import PageHeader from "@/components/common/PageHeader";
import ClubContactActions from "@/components/club/manage/kornor/ClubContactActions";
import StatisticsBubble from "@/components/club/manage/kornor/StatisticsBubble";
import SnackbarContext from "@/contexts/SnackbarContext";
import createMySKClient from "@/utils/backend/mysk/createMySKClient";
import cn from "@/utils/helpers/cn";
import useLocale from "@/utils/helpers/useLocale";
import getLocaleString from "@/utils/helpers/getLocaleString";
import useRefreshProps from "@/utils/helpers/useRefreshProps";
import { Club } from "@/utils/types/club";
import { LangCode } from "@/utils/types/common";
import {
  Actions,
  Button,
  Columns,
  ContentLayout,
  DataTable,
  DataTableBody,
  DataTableContent,
  DataTableHead,
  DataTablePagination,
  DataTableSearch,
  MaterialIcon,
  Snackbar,
} from "@suankularb-components/react";
import {
  PaginationState,
  SortingState,
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { GetServerSideProps, NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { sum } from "radash";
import { useContext, useState } from "react";
import Head from "next/head";

/**
 * A summary of Activity Day data and statistics for Kornor.
 *
 * @param clubs The entire list of Clubs.
 *
 * @returns A Page.
 */
const KornorManagePage: NextPage<{
  statistics: {
    club_members: number;
    club_staffs: number;
    active_clubs: number;
    total_clubs: number;
    total_students: number;
  };
  clubs: Club[];
}> = ({ statistics, clubs }) => {
  const { t } = useTranslation("manage", { keyPrefix: "kornor" });
  const { t: tx } = useTranslation("common");
  const locale = useLocale();
  const refreshProps = useRefreshProps();

  const { setSnackbar } = useContext(SnackbarContext);

  // Tanstack Table configurations
  const data = clubs;
  const columnHelper = createColumnHelper<Club>();
  const maxMemberCount = Math.max(...clubs.map((club) => club.member_count));
  // Average member count
  const averageMemberCount =
    sum(clubs.map((club) => club.member_count)) / clubs.length;
  const columns = [
    // Club name
    // We use the `name` property
    columnHelper.accessor((row) => getLocaleString(row.name, locale), {
      id: "clubName",
      header: t("data.table.thead.clubName"),
    }),

    // Member count
    // We use the length of `members`
    columnHelper.accessor((row) => row.member_count, {
      id: "memberCount",
      header: t("data.table.thead.memberCount"),
      cell: (props) =>
        t("data.table.tbody.memberCount", { count: props.getValue() }),
    }),

    // Discord server link
    // We find a Contact with Discord type
    columnHelper.accessor(
      (row) =>
        row.contacts.find((contact) => contact.type === "discord")?.value,
      {
        id: "discord",
        header: t("data.table.thead.discord"),
        cell: (props) =>
          props.getValue() ? (
            <>
              <span className="w-24 grow truncate">{props.getValue()}</span>
              <ClubContactActions value={props.getValue()!} />
            </>
          ) : null,
      },
    ),

    // Line OpenChat link
    // We find a Contact with Line type
    columnHelper.accessor(
      (row) => row.contacts.find((contact) => contact.type === "line")?.value,
      {
        id: "lineOpenChat",
        header: t("data.table.thead.line"),
        cell: (props) =>
          props.getValue() ? (
            <>
              <span className="w-24 grow truncate">{props.getValue()}</span>
              <ClubContactActions value={props.getValue()!} />
            </>
          ) : null,
      },
    ),
  ];

  // Tanstack Tables states
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [sorting, setSorting] = useState<SortingState>([
    { id: "memberCount", desc: true },
  ]);

  // Tanstack Tables setup
  const { getHeaderGroups, getRowModel, setPageIndex } = useReactTable({
    data: data,
    columns,
    state: { globalFilter, sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <>
      <Head>
        <title>tabName</title>
      </Head>
      <PageHeader parentURL="/club" className="mx-4 sm:mx-0">
        {t("title")}
      </PageHeader>

      <ContentLayout>
        {/* Statistics Bubbles */}
        <Columns
          columns={2}
          element={(props) => <section aria-label="Statistics" {...props} />}
          className="!gap-y-6 overflow-x-hidden sm:overflow-x-visible"
        >
          {/* People */}
          <div
            className={cn(
              `flex flex-col items-center -space-y-4 sm:col-span-2 md:col-span-1 md:items-end`,
            )}
          >
            <StatisticsBubble
              size="large"
              color="primary"
              count={statistics.club_members + statistics.club_staffs}
              percentage={
                ((statistics.club_members + statistics.club_staffs) /
                  statistics.total_students) *
                100
              }
              label={t("statistics.people.totalStudents")}
            />
            <div className="flex flex-row -space-x-4">
              <StatisticsBubble
                size="small"
                color="surface"
                count={statistics.club_members}
                label={t("statistics.people.totalMembers")}
              />
              <StatisticsBubble
                size="small"
                color="surface"
                count={statistics.club_staffs}
                label={t("statistics.people.totalStaff")}
              />
            </div>
          </div>

          {/* Clubs */}
          <div
            className={cn(
              `flex flex-col items-center -space-y-4 sm:col-span-2 md:col-span-1 md:items-start`,
            )}
          >
            <StatisticsBubble
              size="large"
              color="secondary"
              count={statistics.active_clubs}
              percentage={
                (statistics.active_clubs / statistics.total_clubs) * 100
              }
              label={t("statistics.clubs.totalClubs")}
            />
            <div className="flex flex-row -space-x-4">
              <StatisticsBubble
                size="small"
                color="surface"
                count={maxMemberCount}
                label={t("statistics.clubs.totalMembers")}
              />
              <StatisticsBubble
                size="small"
                color="surface"
                count={averageMemberCount}
                label={t("statistics.clubs.totalStaff")}
              />
            </div>
          </div>
        </Columns>

        <section className="mx-4 flex flex-col gap-4 sm:mx-0">
          {/* Export Button */}
          <Actions align="left">
            <Button
              appearance="filled"
              icon={<MaterialIcon icon="refresh" />}
              onClick={async () => {
                await refreshProps();
                setSnackbar(<Snackbar>{tx("snackbar.refreshed")}</Snackbar>);
              }}
            >
              {t("data.action.refresh")}
            </Button>
            <Button
              appearance="outlined"
              icon={<MaterialIcon icon="download" />}
              onClick={() => {}}
            >
              {t("data.action.export")}
            </Button>
          </Actions>

          {/* Club list */}
          <DataTable className="[&>.skc-data-table-content]:!overflow-x-auto">
            <DataTableSearch locale={locale} onChange={setGlobalFilter} />
            <DataTableContent contentWidth={960}>
              <DataTableHead
                headerGroups={getHeaderGroups()}
                locale={locale}
                className="bg-surface-1"
              />
              <DataTableBody rowModel={getRowModel()} />
            </DataTableContent>
            <DataTablePagination
              rowsPerPage={5}
              totalRows={data.length}
              locale={locale}
              onChange={(page) => setPageIndex(page - 1)}
            />
          </DataTable>
        </section>
      </ContentLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  req,
  res,
}) => {
  const mysk = await createMySKClient(req);

  if (!mysk.user?.is_admin) return { notFound: true };

  // Fetch Clubs
  const { data: clubs } = await mysk.fetch("/v1/clubs", {
    query: {
      fetch_level: "default",
      descendant_fetch_level: "default",
      pagination: { p: 1, size: 100 },
    },
  });

  // Fetch Statistics
  const { data: statistics } = await mysk.fetch("/v1/clubs/statistics");

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "manage",
      ])),
      clubs,
      statistics,
    },
  };
};

export default KornorManagePage;
