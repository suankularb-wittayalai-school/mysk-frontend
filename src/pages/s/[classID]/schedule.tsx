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
import Schedule from "@components/Schedule";
import BrandIcon from "@components/icons/BrandIcon";

// Types
import { Role } from "@utils/types/person";
import { Schedule as ScheduleType } from "@utils/types/schedule";

// Backend
import { SubjectListItem } from "@utils/types/subject";
import { nameJoiner } from "@utils/helpers/name";

const ScheduleSection = ({
  schedule,
}: {
  schedule: ScheduleType;
}): JSX.Element => {
  const { t } = useTranslation("schedule");

  return (
    <Section>
      <Schedule schedule={schedule} role="teacher" />
    </Section>
  );
};

const SubjectListSection = ({
  subjectList,
}: {
  subjectList: Array<SubjectListItem>;
}): JSX.Element => {
  const { t } = useTranslation("schedule");
  const locale = useRouter().locale == "en-US" ? "en-US" : "th";
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
  schedule: ScheduleType;
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
  const schedule: ScheduleType = {
    content: [
      {
        day: 1,
        content: [
          { periodStart: 1, duration: 1 },
          {
            periodStart: 2,
            duration: 1,
            subject: {
              name: {
                "en-US": {
                  name: "Chemistry",
                  shortName: "Chem",
                },
                th: {
                  name: "เคมี",
                  shortName: "เคมี",
                },
              },
              teachers: [
                {
                  name: {
                    "en-US": {
                      firstName: "Thanthapatra",
                      lastName: "Bunchuay",
                    },
                    th: {
                      firstName: "ธันฐภัทร",
                      lastName: "บุญช่วย",
                    },
                  },
                },
              ],
            },
          },
        ],
      },
      {
        day: 2,
        content: [],
      },
      {
        day: 3,
        content: [],
      },
      {
        day: 4,
        content: [],
      },
      {
        day: 5,
        content: [],
      },
    ],
  };
  const subjectList: Array<SubjectListItem> = [
    {
      id: 8,
      subject: {
        code: { "en-US": "MA31152", th: "ค31152" },
        name: {
          "en-US": { name: "Fundamental Mathematics 2" },
          th: { name: "คณิตศาสตร์พื้นฐาน 2 (EP)" },
        },
      },
      teachers: [
        {
          id: 9,
          role: "teacher",
          prefix: "mister",
          name: {
            "en-US": { firstName: "Kritchapon", lastName: "Boonpoonmee" },
            th: { firstName: "กฤชพล", lastName: "บุญพูลมี" },
          },
          subjectsInCharge: [
            {
              id: 8,
              code: { "en-US": "MA31152", th: "ค31152" },
              name: {
                "en-US": { name: "Fundamental Mathematics 2" },
                th: { name: "คณิตศาสตร์พื้นฐาน 2 (EP)" },
              },
              subjectSubgroup: {
                name: {
                  "en-US": "Mathematics",
                  th: "คณิตศาสตร์",
                },
                subjectGroup: {
                  name: {
                    "en-US": "Mathematics",
                    th: "คณิตศาสตร์",
                  },
                },
              },
            },
          ],
        },
      ],
      ggcCode: "y53ezt7",
      ggcLink: "https://classroom.google.com/c/NDIyMTc0ODc5NzQw",
    },
    {
      id: 17,
      subject: {
        code: { "en-US": "SCI31205", th: "ว31205" },
        name: {
          "en-US": { name: "Physics 2" },
          th: { name: "ฟิสิกส์ 2 (EP)" },
        },
      },
      teachers: [
        {
          id: 6,
          role: "teacher",
          prefix: "mister",
          name: {
            "en-US": { firstName: "Niruth", lastName: "Prombutr" },
            th: { firstName: "นิรุทธ์", lastName: "พรมบุตร" },
          },
          subjectsInCharge: [
            {
              id: 8,
              code: { "en-US": "SCI31205", th: "ว31205" },
              name: {
                "en-US": { name: "Physics 2" },
                th: { name: "ฟิสิกส์ 2 (EP)" },
              },
              subjectSubgroup: {
                name: {
                  "en-US": "Science",
                  th: "วิทยาศาสตร์",
                },
                subjectGroup: {
                  name: {
                    "en-US": "Science and Technology",
                    th: "วิทยาศาสตร์และเทคโนโลยี",
                  },
                },
              },
            },
          ],
        },
      ],
      ggcLink: "https://classroom.google.com/c/MzQ4MTUyOTI4NjE0",
      ggMeetLink: "https://meet.google.com/xoe-dkpg-gjr",
    },
  ];

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
