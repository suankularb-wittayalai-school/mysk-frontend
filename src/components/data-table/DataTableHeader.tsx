// External libraries
import { flexRender, HeaderGroup } from "@tanstack/react-table";

// Types
import { ColumnDefWClasses } from "@utils/types/common";

const DataTableHeader = ({
  headerGroups,
  endRow,
}: {
  headerGroups: HeaderGroup<object>[];
  endRow?: JSX.Element;
}): JSX.Element => {
  return (
    <thead>
      {headerGroups.map((headerGroup) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <th
              key={header.id}
              className={(header.column.columnDef as ColumnDefWClasses).thClass}
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
