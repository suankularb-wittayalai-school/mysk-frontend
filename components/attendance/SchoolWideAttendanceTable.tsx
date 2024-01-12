import PersonAvatar from "@/components/common/PersonAvatar";
import cn from "@/utils/helpers/cn";
import useLocale from "@/utils/helpers/useLocale";
import {
  ClassroomAttendance,
  ManagementAttendanceSummary,
} from "@/utils/types/attendance";
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
} from "@suankularb-components/react";
import {
  SortingState,
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useTranslation } from "next-i18next";
import { list, sum } from "radash";
import { useState } from "react";
import Markdown from "react-markdown";

/**
 * A table that displays Attendance of all Classrooms in the school.
 *
 * @param attendances Attendance of each Classroom.
 */
const SchoolWideAttendanceTable: StylableFC<{
  attendances: ClassroomAttendance[];
}> = ({ attendances, style, className }) => {
  const locale = useLocale();
  const { t: tx } = useTranslation("common");

  const [sorting, setSorting] = useState<SortingState>([
    { id: "classroom", desc: true },
  ]);

  const columnHelper = createColumnHelper<ClassroomAttendance>();
  const columns = [
    // Classroom
    columnHelper.accessor("classroom.number", {
      id: "classroom",
      cell: (info) => tx("class", { number: info.getValue() }),
      header: "Classroom",
    }),

    // Summary
    columnHelper.accessor("summary", {
      cell: (info) => {
        // Display nothing if there is no data.
        if (Object.values(info.getValue()).every((value) => value === 0))
          return null;

        /**
         * The percentage of each Attendance status.
         */
        const percentages = Object.fromEntries(
          Object.entries(info.getValue()).map(([key, value]) => [
            key,
            (value / info.row.original.expected_total) * 100,
          ]),
        ) as ManagementAttendanceSummary;

        /**
         * The percentage of missing data.
         */
        const missingPercentage = 100 - sum(Object.values(percentages));

        // Display the numbers and the mini bar chart.
        return (
          <>
            {/* Numbers */}
            <div className="absolute inset-0 grid w-full grid-cols-3 px-6 py-4 print:static print:p-0">
              {Object.entries(info.getValue()).map(([key, value]) => (
                <span key={key}>{value}</span>
              ))}
            </div>

            {/* Mini bar chart */}
            <div
              className={cn(`absolute inset-0 top-[calc(3rem+2px)] flex flex-row
                overflow-hidden bg-surface-variant *:h-1 *:ring-4
                *:ring-surface-variant print:hidden`)}
            >
              {/* Presence */}
              <div
                className="bg-primary"
                style={{ width: `${percentages.presence}%` }}
              />
              {/* Late */}
              <div
                className="bg-secondary"
                style={{ width: `${percentages.late}%` }}
              />
              {/* Absence */}
              <div className="grow" />
              {/* Missing data */}
              {missingPercentage > 0.01 && (
                <div
                  className="border-1 border-error bg-surface"
                  style={{ width: `${missingPercentage}%` }}
                />
              )}
            </div>
          </>
        );
      },
      header: "Presence • Late • Absence",
      sortingFn: "summarySorter" as any,
    }),

    // Absent Students
    columnHelper.accessor("absent_students", {
      cell: (info) => (
        <ChipSet className="!gap-1 print:!gap-y-0">
          {info.getValue().map((student) => (
            <>
              <InputChip
                key={student.id}
                avatar={<PersonAvatar profile={student.profile} />}
                className={cn(`print:!border-0 print:!p-0
                  [&>:first-child]:print:!hidden [&>span]:print:!font-print
                  [&>span]:print:!font-regular`)}
              >
                {student.class_no!.toString()}
              </InputChip>
            </>
          ))}
        </ChipSet>
      ),
      header: "Absent students",
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
      header: "Homeroom",
    }),
  ];

  const data = attendances;

  const { getHeaderGroups, getRowModel } = useReactTable({
    columns,
    data,
    state: { sorting },
    onSortingChange: setSorting,
    sortingFns: {
      summarySorter: (a: any, b: any, columnID) =>
        a.getValue(columnID).presence - b.getValue(columnID).presence,
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <DataTable style={style} className={className}>
      <DataTableFilters locale={locale} className="print:!hidden">
        <ChipSet>
          {list(1, 6).map((grade) => (
            <FilterChip key={grade}>M.{grade}</FilterChip>
          ))}
        </ChipSet>
      </DataTableFilters>
      <DataTableContent contentWidth={920}>
        <DataTableHead
          headerGroups={getHeaderGroups()}
          locale={locale}
          className={cn(`[&>tr>:first-child]:w-2/12 [&>tr>:nth-child(2)]:w-3/12
            [&>tr>:nth-child(3)]:w-3/12 [&>tr>:nth-child(4)]:w-4/12`)}
        />
        <DataTableBody rowModel={getRowModel()} />
      </DataTableContent>
      <style jsx global>{`
        @media print {
          .skc-data-table {
            border-radius: 0 !important;
          }
          .skc-data-table,
          .skc-data-table > * {
            background-color: transparent !important;
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
