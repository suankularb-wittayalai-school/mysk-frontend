// External libraries
import { flexRender, RowModel } from "@tanstack/react-table";

// Types
import { ColumnDefWClasses } from "@utils/types/common";

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
                    (cell.column.columnDef as ColumnDefWClasses).tdClass
                  }
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
