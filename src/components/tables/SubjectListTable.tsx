// External libraries
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useMemo, useState } from "react";
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

// SK Components
import {
  Button,
  Header,
  LayoutGridCols,
  MaterialIcon,
  Search,
  Section,
  Table,
} from "@suankularb-components/react";

// Components
import DataTableBody from "@components/data-table/DataTableBody";
import DataTableHeader from "@components/data-table/DataTableHeader";
import BrandIcon from "@components/icons/BrandIcon";

// Types
import { LangCode } from "@utils/types/common";
import { SubjectListItem } from "@utils/types/subject";

// Helpers
import { nameJoiner } from "@utils/helpers/name";
import { getLocaleObj, getLocaleString } from "@utils/helpers/i18n";

const SubjectListTable = ({
  subjectList,
}: {
  subjectList: SubjectListItem[];
}): JSX.Element => {
  const { t } = useTranslation("schedule");
  const locale = useRouter().locale as LangCode;

  const [globalFilter, setGlobalFilter] = useState<string>("");
  const data = useMemo(
    () =>
      subjectList.map((subjectListItem) => ({
        code: getLocaleString(subjectListItem.subject.code, locale),
        name: (
          getLocaleObj(subjectListItem.subject.name, locale) as { name: string }
        ).name,
        teachers:
          subjectListItem.teachers.length > 0 &&
          nameJoiner(locale, subjectListItem.teachers[0].name),
        ggcCode: subjectListItem.ggcCode,
      })),
    []
  );
  const columns = useMemo<ColumnDef<object>[]>(
    () => [
      {
        accessorKey: "code",
        header: t("subjectList.table.code"),
        thClass: "w-1/12",
      },
      {
        accessorKey: "name",
        header: t("subjectList.table.name"),
        thClass: "w-5/12",
      },
      {
        accessorKey: "teachers",
        header: t("subjectList.table.teachers"),
        thClass: "w-3/12",
      },
      {
        accessorKey: "ggcCode",
        header: t("subjectList.table.ggcCode"),
        thClass: "w-2/12",
      },
    ],
    []
  );
  const { getHeaderGroups, getRowModel } = useReactTable({
    data,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <Section>
      <LayoutGridCols cols={3}>
        <div className="md:col-span-2">
          <Header
            text={t("subjectList.title")}
            icon={<MaterialIcon icon="collections_bookmark" allowCustomSize />}
          />
        </div>
        <Search
          placeholder={t("subjectList.search")}
          onChange={(e: string) => setGlobalFilter(e)}
        />
      </LayoutGridCols>
      <div>
        <Table width={720}>
          <DataTableHeader
            headerGroups={getHeaderGroups()}
            endRow={<th className="w-1/12" />}
          />
          <DataTableBody
            rowModel={getRowModel()}
            endRow={(row) => {
              const subjectListItem = subjectList.find(
                (item) => (row as { id: number }).id == item.id
              );
              return (
                <td>
                  <div className="flex flex-row justify-center gap-2">
                    {subjectListItem?.ggcLink && (
                      <a
                        href={subjectListItem?.ggcLink}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Button
                          name={t("subjectList.table.action.ggcLink")}
                          type="text"
                          iconOnly
                          icon={<BrandIcon icon="gg-classroom" />}
                        />
                      </a>
                    )}
                    {subjectListItem?.ggMeetLink && (
                      <a
                        href={subjectListItem.ggMeetLink}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Button
                          name={t("subjectList.table.action.ggMeetLink")}
                          type="text"
                          iconOnly
                          icon={<BrandIcon icon="gg-meet" />}
                        />
                      </a>
                    )}
                  </div>
                </td>
              );
            }}
          />
        </Table>
      </div>
    </Section>
  );
};

export default SubjectListTable;
