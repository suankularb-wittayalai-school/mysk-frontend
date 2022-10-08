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
                  {
                    // Check if columnDef provides a custom render function
                    (cell.column.columnDef as DataTableColumnDef).render
                      ? // Use custom render function
                        (
                          (cell.column.columnDef as DataTableColumnDef)
                            .render as Function
                        )(row.original)
                      : // Check if cell is not empty
                      cell.getValue()
                      ? // Render cell normally
                        flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )
                      : // (Cell is empty) Show no data message
                        (cell.column.columnDef as DataTableColumnDef).noDataMsg
                  }
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
