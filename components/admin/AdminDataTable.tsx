// External libraries
import { HeaderGroup, RowModel } from "@tanstack/react-table";
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
import { motion } from "framer-motion";

const AdminDataTable: FC<{
  headerGroups: HeaderGroup<any>[];
  rowModel: RowModel<any>;
  globalFilter: string;
  onGlobalFilterChange: (value: string) => void;
  totalRows: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  loading: boolean;
}> = ({
  headerGroups,
  rowModel,
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
        <DataTableBody rowModel={rowModel} />
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
