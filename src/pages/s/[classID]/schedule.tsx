// Modules
import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { useEffect, useState } from "react";

// SK Components
import {
  Button,
  Header,
  MaterialIcon,
  RegularLayout,
  Search,
  Section,
  Table,
  Title,
} from "@suankularb-components/react";

// Components
import Schedule from "@components/schedule/Schedule";
import BrandIcon from "@components/icons/BrandIcon";

// Types
import { Role } from "@utils/types/person";
import { StudentSchedule } from "@utils/types/schedule";
import { SubjectListItem } from "@utils/types/subject";

// Helpers
import { nameJoiner } from "@utils/helpers/name";

const ScheduleSection = ({
  schedule,
}: {
  schedule: StudentSchedule;
}): JSX.Element => (
  <Section>
    <Schedule schedule={schedule} role="student" />
  </Section>
);

const SubjectListSection = ({
  subjectList,
}: {
  subjectList: Array<SubjectListItem>;
}): JSX.Element => {
  const { t } = useTranslation("schedule");
  const locale = useRouter().locale as "en-US" | "th";
  const [filterredList, setFilterredList] =
    useState<Array<SubjectListItem>>(subjectList);
  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    setFilterredList(
      query
        ? // Filter Subject List by code, name, and teacher
          subjectList.filter(
            (subjectListItem) =>
              subjectListItem.subject.code[locale].includes(query) ||
              subjectListItem.subject.name[locale].name.includes(query) ||
              nameJoiner(locale, subjectListItem.teachers[0].name).includes(
                query
              )
          )
        : // If the query is empty, show the normal unfilterred Subject List
          subjectList
    );
  }, [subjectList, locale, query]);

  return (
    <Section>
      <div className="layout-grid-cols-3--header">
        <div className="[grid-area:header]">
          <Header
            text={t("subjectList.title")}
            icon={<MaterialIcon icon="collections_bookmark" allowCustomSize />}
          />
        </div>
        <Search
          placeholder={t("subjectList.search")}
          onChange={(e: string) => setQuery(e)}
          className="[grid-area:search]"
        />
      </div>
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
                  {subjectListItem.subject.name[locale].name}
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
                          name={t("subjectList.table.action.copyCode")}
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
                          name={t("subjectList.table.action.copyCode")}
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

const StudentSchedule: NextPage<{
  role: Role;
  schedule: StudentSchedule;
  subjectList: Array<SubjectListItem>;
}> = ({ schedule, subjectList }) => {
  const { t } = useTranslation("schedule");

  return (
    <>
      <RegularLayout
        Title={
          <Title
            name={{ title: t("title.student") }}
            pageIcon={<MaterialIcon icon="dashboard" />}
            backGoesTo="/s/home"
            LinkElement={Link}
          />
        }
      >
        <ScheduleSection schedule={schedule} />
        <SubjectListSection subjectList={subjectList} />
      </RegularLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  params,
}) => {
  const schedule: StudentSchedule = {
    id: 0,
    content: [
      { day: 1, content: [] },
      { day: 2, content: [] },
      { day: 3, content: [] },
      { day: 4, content: [] },
      { day: 5, content: [] },
    ],
  };
  const subjectList: Array<SubjectListItem> = [];

  return {
    props: {
      ...(await serverSideTranslations(locale as string, [
        "common",
        "schedule",
      ])),
      schedule,
      subjectList,
    },
  };
};

export default StudentSchedule;
