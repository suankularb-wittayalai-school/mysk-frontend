// External libraries
import { flexRender, HeaderGroup } from "@tanstack/react-table";

// Types
import { DataTableColumnDef } from "@utils/types/common";

const DataTableHeader = ({
  headerGroups,
  endRow,
}: {
  headerGroups: HeaderGroup<any>[];
  endRow?: JSX.Element;
}): JSX.Element => {
  return (
    <thead>
      {headerGroups.map((headerGroup) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <th
              key={header.id}
              className={(header.column.columnDef as DataTableColumnDef).thClass}
            >
              {flexRender(header.column.columnDef.header, header.getContext())}
            </th>
          ))}
          {endRow}
        </tr>
      ))}
    </thead>
  );
};

export default DataTableHeader;
