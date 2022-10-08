// External libraries
import { flexRender, RowModel } from "@tanstack/react-table";

// Types
import { DataTableColumnDef } from "@utils/types/common";

const DataTableBody = ({
  rowModel,
  endRow,
}: {
  rowModel: RowModel<any>;
  endRow?: JSX.Element | ((row: any) => JSX.Element);
}): JSX.Element => {
  return (
    <tbody>
      {rowModel.rows.map((row) => {
        return (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => {
              return (
                <td
                  key={cell.id}
                  className={
                    (cell.column.columnDef as DataTableColumnDef).tdClass
                  }
                >
                  {cell.getValue()
                    ? flexRender(cell.column.columnDef.cell, cell.getContext())
                    : (cell.column.columnDef as DataTableColumnDef).noDataMsg}
                </td>
              );
            })}
            {endRow instanceof Function ? endRow(row.original) : endRow}
          </tr>
        );
      })}
    </tbody>
  );
};

export default DataTableBody;
