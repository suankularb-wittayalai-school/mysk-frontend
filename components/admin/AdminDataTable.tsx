// External libraries
import { HeaderGroup, RowModel } from "@tanstack/react-table";
import { motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import { FC } from "react";

// SK Components
import {
  DataTable,
  DataTableBody,
  DataTableContent,
  DataTableHead,
  DataTablePagination,
  DataTableSearch,
  Progress,
} from "@suankularb-components/react";

// Hooks
import { useLocale } from "@/utils/hooks/i18n";

/**
 * Data Table for admin pages.
 *
 * @param headerGroups The return of `getHeaderGroups`, one of the functions of the Tanstack Table instance.
 * @param rowModel The return of getRowModel, one of the functions of the Tanstack Table instance.
 * @param rowActions Actions related to a row, shown on hover.
 * @param globalFilter The value inside Data Table Search.
 * @param onGlobalFilterChange This function triggers when the user make changes to Data Table Search.
 * @param totalRows The total number of rows of data, including both those currently shown and not shown on the Data Table.
 * @param rowsPerPage The maximum number of rows shown on the Data Table at a time.
 * @param onPageChange Triggers when the user changes the page.
 * @param loading Displays a linear Progress if true.
 *
 * @returns A Data Table.
 */
const AdminDataTable: FC<{
  headerGroups: HeaderGroup<any>[];
  rowModel: RowModel<any>;
  rowActions?: (row: any) => JSX.Element;
  globalFilter: string;
  onGlobalFilterChange: (value: string) => void;
  totalRows: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  loading: boolean;
}> = ({
  headerGroups,
  rowModel,
  rowActions,
  globalFilter,
  onGlobalFilterChange,
  totalRows,
  rowsPerPage,
  onPageChange,
  loading,
}) => {
  const locale = useLocale();
  const { t } = useTranslation("admin");

  return (
    <DataTable layout>
      <DataTableSearch
        value={globalFilter}
        locale={locale}
        onChange={onGlobalFilterChange}
      />
      <motion.div layout className="-mt-1 h-1">
        <Progress appearance="linear" alt="Loading table…" visible={loading} />
      </motion.div>
      <DataTableContent contentWidth={800}>
        <DataTableHead headerGroups={headerGroups} locale={locale} />
        <DataTableBody rowModel={rowModel} rowActions={rowActions} />
      </DataTableContent>
      <DataTablePagination
        rowsPerPage={rowsPerPage}
        totalRows={totalRows}
        locale={locale}
        onChange={onPageChange}
        className="sticky bottom-20 sm:bottom-0"
      />
    </DataTable>
  );
};

export default AdminDataTable;
