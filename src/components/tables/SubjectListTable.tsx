// Modules
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";

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
import BrandIcon from "@components/icons/BrandIcon";

// Types
import { LangCode } from "@utils/types/common";
import { SubjectListItem } from "@utils/types/subject";

// Helpers
import { nameJoiner } from "@utils/helpers/name";

const SubjectListTable = ({
  subjectList,
}: {
  subjectList: SubjectListItem[];
}): JSX.Element => {
  const { t } = useTranslation("schedule");
  const locale = useRouter().locale as LangCode;
  const [filterredList, setFilterredList] =
    useState<SubjectListItem[]>(subjectList);
  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    setFilterredList(
      query
        ? // Filter Subject List by code, name, and teacher
          subjectList.filter(
            (subjectListItem) =>
              subjectListItem.subject.code[locale]
                .toLowerCase()
                .includes(query) ||
              (
                subjectListItem.subject.name[locale] ||
                subjectListItem.subject.name.th
              ).name
                .toLowerCase()
                .includes(query) ||
              nameJoiner(locale, subjectListItem.teachers[0].name)
                .toLowerCase()
                .includes(query)
          )
        : // If the query is empty, show the normal unfilterred Subject List
          subjectList
    );
  }, [query]);

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
          onChange={(e: string) => setQuery(e.toLowerCase())}
        />
      </LayoutGridCols>
      <div>
        <Table width={720}>
          <thead>
            <tr>
              <th className="w-1/12">{t("subjectList.table.code")}</th>
              <th className="w-5/12">{t("subjectList.table.name")}</th>
              <th className="w-3/12">{t("subjectList.table.teachers")}</th>
              <th className="w-2/12">{t("subjectList.table.ggcCode")}</th>
              <th className="w-1/12" />
            </tr>
          </thead>
          <tbody>
            {filterredList.map((subjectListItem) => (
              <tr key={subjectListItem.id}>
                <td>{subjectListItem.subject.code[locale]}</td>
                <td className="!text-left">
                  {subjectListItem.subject.name[locale]?.name ||
                    subjectListItem.subject.name.th.name}
                </td>
                <td className="!text-left">
                  {subjectListItem.teachers.length > 0 &&
                    nameJoiner(locale, subjectListItem.teachers[0].name)}
                </td>
                <td>{subjectListItem.ggcCode}</td>
                <td>
                  <div className="flex flex-row justify-center gap-2">
                    {subjectListItem.ggcLink && (
                      <a
                        href={subjectListItem.ggcLink}
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
                    {subjectListItem.ggMeetLink && (
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
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Section>
  );
};

export default SubjectListTable;