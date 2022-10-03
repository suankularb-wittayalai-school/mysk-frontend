// External libraries
import { ReactNode } from "react";
import { flexRender, HeaderGroup } from "@tanstack/react-table";

// Types
import { ColumnDefWClasses } from "@utils/types/common";

const DataTableHeader = ({
  headerGroups,
  end,
}: {
  headerGroups: HeaderGroup<object>[];
  end?: ReactNode;
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
        </tr>
      ))}
      {end}
    </thead>
  );
};

export default DataTableHeader;
