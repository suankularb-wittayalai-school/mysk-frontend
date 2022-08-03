// Modules
import {
  GetServerSideProps,
  GetStaticPaths,
  GetStaticProps,
  NextPage,
} from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { useEffect, useState } from "react";

// SK Components
import {
  Button,
  Header,
  LayoutGridCols,
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

// Backend
import {
  getAllClassNumbers,
  getClassIDFromNumber,
} from "@utils/backend/classroom/classroom";
import { getSchedule } from "@utils/backend/schedule/schedule";
import { getSubjectList } from "@utils/backend/subject/roomSubject";

// Types
import { LangCode } from "@utils/types/common";
import { Schedule as ScheduleType } from "@utils/types/schedule";
import { SubjectListItem } from "@utils/types/subject";

// Helpers
import { nameJoiner } from "@utils/helpers/name";
import { createTitleStr } from "@utils/helpers/title";

const ScheduleSection = ({
  schedule,
}: {
  schedule: ScheduleType;
}): JSX.Element => (
  <Section>
    <Schedule schedule={schedule} role="student" />
  </Section>
);

const SubjectListSection = ({
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

const StudentSchedule: NextPage<{
  classNumber: number;
  schedule: ScheduleType;
  subjectList: SubjectListItem[];
}> = ({ classNumber, schedule, subjectList }) => {
  const { t } = useTranslation(["schedule", "common"]);

  return (
    <>
      <Head>
        <title>
          {createTitleStr(
            t("title.studentWithClass", { number: classNumber }),
            t
          )}
        </title>
      </Head>
      <RegularLayout
        Title={
          <Title
            name={{
              title: t("title.student"),
              subtitle: t("class", { ns: "common", number: classNumber }),
            }}
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

// // export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
// export const getServerSideProps: GetServerSideProps = async ({
//   locale,
//   params,
// }) => {
//   const classID = await getClassIDFromNumber(Number(params?.classNumber));
//   if (!classID) return { notFound: true };

//   const schedule: ScheduleType = await getSchedule("student", classID);
//   const { data: subjectList } = await getSubjectList(classID);

//   // const schedule: ScheduleType = { content: [] };
//   // const { data: subjectList } = await getSubjectList(classID);

//   return {
//     props: {
//       ...(await serverSideTranslations(locale as LangCode, [
//         "common",
//         "schedule",
//       ])),
//       classNumber: params?.classNumber,
//       schedule,
//       subjectList,
//     },
//     // revalidate: 300,
//   };
// };

// export const getStaticPaths: GetStaticPaths = async () => {
//   return {
//     paths: (await getAllClassNumbers()).map((number) => ({
//       params: { classNumber: number.toString() },
//     })),
//     fallback: "blocking",
//   };
// };

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
  const classNumber = Number(params?.classNumber);
  if (!classNumber) return { notFound: true }

  const { data: classID, error } = await getClassIDFromNumber(
    Number(params?.classNumber)
  );
  if (error) return { notFound: true };

  const schedule: ScheduleType = await getSchedule("student", classID as number);
  const { data: subjectList } = await getSubjectList(classID as number);

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "schedule",
      ])),
      classNumber,
      schedule,
      subjectList,
    },
    revalidate: 300,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: (await getAllClassNumbers()).map((number) => ({
      params: { classNumber: number.toString() },
    })),
    fallback: "blocking",
  };
};

export default StudentSchedule;
