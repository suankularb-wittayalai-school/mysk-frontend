import MonthBarSparkline from "@/components/attendance/MonthBarSparkline";
import PersonAvatar from "@/components/common/PersonAvatar";
import cn from "@/utils/helpers/cn";
import useLocale from "@/utils/helpers/useLocale";
import { ClassroomAttendance } from "@/utils/types/attendance";
import { StylableFC } from "@/utils/types/common";
import {
  ChipSet,
  DataTable,
  DataTableBody,
  DataTableContent,
  DataTableFilters,
  DataTableHead,
  FilterChip,
  InputChip,
  MaterialIcon,
} from "@suankularb-components/react";
import {
  ColumnFiltersState,
  SortingState,
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { list, sum } from "radash";
import { useState } from "react";
import Markdown from "react-markdown";
import useTranslation from "next-translate/useTranslation";

/**
 * A table that displays Attendance of all Classrooms in the school.
 *
 * @param attendances Attendance of each Classroom.
 */
const SchoolWideAttendanceTable: StylableFC<{
  attendances: ClassroomAttendance[];
}> = ({ attendances, style, className }) => {
  const locale = useLocale();
  const { t } = useTranslation("manage/attendance");
  const { t: tx } = useTranslation("common");

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "classroom", desc: false },
  ]);

  const columnHelper = createColumnHelper<ClassroomAttendance>();
  const columns = [
    // Classroom
    columnHelper.accessor("classroom.number", {
      id: "classroom",
      cell: (info) => tx("class", { number: info.getValue() }),
      header: () => t("table.thead.classroom"),
    }),

    // Summary
    columnHelper.accessor("summary", {
      cell: (info) => {
        // Display nothing if there is no data.
        if (Object.values(info.getValue()).every((value) => value === 0))
          return null;

        const summary = info.getValue();

        // Display the numbers and the mini bar chart.
        return (
          <div
            className={cn(`absolute inset-0 grid grow
              grid-cols-[2.25rem,repeat(4,minmax(0,1fr))] divide-x-1
              divide-outline-variant print:grid-cols-4 print:divide-black`)}
          >
            <div className="flex flex-col justify-center p-1 print:hidden">
              <MonthBarSparkline
                summary={{
                  present: summary.presence,
                  late: summary.late,
                  onLeave: 0,
                  absent: summary.covid + summary.absence,
                  empty:
                    info.row.original.expected_total -
                    sum(Object.values(summary)),
                }}
                className="h-11 w-full"
              />
            </div>
            {/* Numbers */}
            {Object.entries(info.getValue()).map(([key, value]) => (
              <div key={key} className="grid place-content-center text-center">
                <span>{value}</span>
              </div>
            ))}
          </div>
        );
      },
      header: () => (
        <div
          className={cn(`absolute inset-0 grid grow
            grid-cols-[2.25rem,repeat(4,minmax(0,1fr))] *:grid
            *:place-content-center print:grid-cols-4`)}
        >
          <div className="print:hidden" />
          <div title={t("thead.summary.onTime")}>
            <MaterialIcon icon="done" className="text-primary" />
          </div>
          <div title={t("thead.summary.late")}>
            <MaterialIcon icon="alarm" className="text-tertiary" />
          </div>
          <div title={t("thead.summary.covid")}>
            <MaterialIcon icon="masks" className="text-on-surface-variant" />
          </div>
          <div title={t("thead.summary.absence")}>
            <MaterialIcon icon="close" className="text-error" />
          </div>
        </div>
      ),
      sortingFn: "summarySorter" as any,
    }),

    // Absent Students
    columnHelper.accessor("absent_students", {
      cell: (info) => (
        <ChipSet className="-m-[1px] !gap-1 print:m-0 print:!gap-y-0">
          {info.getValue().map((student) => (
            <InputChip
              key={student.id}
              avatar={<PersonAvatar profile={student.profile} />}
              className={cn(`print:!border-0 print:!p-0
                [&>:first-child]:print:!hidden [&>span]:print:!font-print
                [&>span]:print:!font-regular`)}
            >
              {student.class_no!.toString()}
            </InputChip>
          ))}
        </ChipSet>
      ),
      header: t("table.thead.absentStudents"),
    }),

    // Homeroom Content
    columnHelper.accessor("homeroom_content", {
      cell: (info) => (
        <Markdown
          className={cn(`[&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc
            [&_ul]:pl-6`)}
        >
          {info.getValue()}
        </Markdown>
      ),
      header: t("table.thead.homeroom"),
    }),
  ];

  const data = attendances;

  const { getHeaderGroups, getRowModel } = useReactTable({
    columns,
    data,
    state: { columnFilters, sorting },
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    sortingFns: {
      summarySorter: (a: any, b: any, columnID) =>
        a.getValue(columnID).presence - b.getValue(columnID).presence,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <DataTable
      style={style}
      className={cn(`[&>.skc-data-table-content]:!overflow-auto`, className)}
    >
      <DataTableFilters className="print:!hidden">
        <ChipSet>
          {list(1, 6).map((grade) => (
            <FilterChip
              key={grade}
              selected={columnFilters.some(
                (filter) =>
                  filter.id === "classroom" &&
                  (filter.value as [number, number])[0] === grade * 100,
              )}
              onClick={(state) => {
                if (!state) setColumnFilters([]);
                else
                  setColumnFilters([
                    { id: "classroom", value: [grade * 100, grade * 100 + 99] },
                  ]);
              }}
            >
              {tx("class", { number: grade })}
            </FilterChip>
          ))}
        </ChipSet>
      </DataTableFilters>
      <DataTableContent contentWidth={920}>
        <DataTableHead
          headerGroups={getHeaderGroups()}
          locale={locale}
          className={cn(`[&>tr>:first-child]:w-2/12 [&>tr>:nth-child(2)]:w-2/12
            [&>tr>:nth-child(3)]:w-4/12 [&>tr>:nth-child(4)]:w-4/12`)}
        />
        <DataTableBody rowModel={getRowModel()} />
      </DataTableContent>
      <style jsx global>{`
        .skc-table-cell--header:nth-child(2) .skc-table-cell__sort-indicator {
          display: none !important;
        }

        @media print {
          .skc-data-table {
            border-radius: 0 !important;
          }
          .skc-data-table,
          .skc-data-table > * {
            background-color: transparent !important;
          }
          .skc-table-cell__sort-indicator {
            display: none !important;
          }
          .skc-data-table-content__content {
            min-width: 0 !important;
          }
          .skc-table-cell__content {
            padding: 0.25rem 0.5rem !important;
            font-family: var(--font-print) !important;
            break-inside: avoid;
          }
          .skc-data-table,
          .skc-table-cell {
            border-color: var(--black) !important;
          }
        }
      `}</style>
    </DataTable>
  );
};

export default SchoolWideAttendanceTable;
