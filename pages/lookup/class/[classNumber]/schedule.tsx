// External libraries
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { FC, useState } from "react";

// SK Components
import {
  Columns,
  ContentLayout,
  Header,
  MaterialIcon,
  Search,
  Section,
  Tab,
  TabsContainer,
} from "@suankularb-components/react";

// Internal components
import MySKPageHeader from "@/components/common/MySKPageHeader";
import Schedule from "@/components/schedule/Schedule";
import SubjectList from "@/components/subject/SubjectList";

// Backend
import {
  getAllClassNumbers,
  getClassIDFromNumber,
} from "@/utils/backend/classroom/classroom";
import { getSchedule } from "@/utils/backend/schedule/schedule";
import { getSubjectList } from "@/utils/backend/subject/roomSubject";

// Supabase
import { supabase } from "@/utils/supabase-backend";

// Types
import { CustomPage, LangCode } from "@/utils/types/common";
import { Schedule as ScheduleType } from "@/utils/types/schedule";
import { SubjectListItem } from "@/utils/types/subject";

// Helpers
import { createTitleStr } from "@/utils/helpers/title";

// Hooks
import { useLocale } from "@/utils/hooks/i18n";

// Types
import { ClassWNumber } from "@/utils/types/class";
import ClassTabs from "@/components/lookup/class/ClassTabs";

const SubjectListSection: FC<{ subjectList: SubjectListItem[] }> = ({
  subjectList,
}) => {
  const { t } = useTranslation("schedule");
  const locale = useLocale();

  const [query, setQuery] = useState<string>("");

  return (
    <Section>
      <Columns columns={3} className="!items-end">
        <Header className="md:col-span-2">{t("subjectList.title")}</Header>
        <Search
          alt={t("subjectList.search")}
          value={query}
          locale={locale}
          onChange={setQuery}
        />
      </Columns>
      <SubjectList {...{ subjectList, query }} />
    </Section>
  );
};

const LookupClassSchedulePage: CustomPage<{
  classItem: ClassWNumber;
  schedule: ScheduleType;
  subjectList: SubjectListItem[];
}> = ({ classItem, schedule, subjectList }) => {
  // Translation
  const { t } = useTranslation(["class", "common"]);

  const parentURL = `/lookup/class/${classItem.number}`;

  return (
    <>
      <Head>
        <title>
          {createTitleStr(t("schedule.title", { number: classItem.number }), t)}
        </title>
      </Head>
      <MySKPageHeader
        title={t("schedule.title", { number: classItem.number })}
        parentURL={parentURL}
      >
        <ClassTabs number={classItem.number} />
      </MySKPageHeader>
      <ContentLayout>
        <Schedule schedule={schedule} role="student" />
        <SubjectListSection subjectList={subjectList} />
      </ContentLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
  const classNumber = Number(params?.classNumber);
  if (!classNumber) return { notFound: true };

  const { data: classID, error } = await getClassIDFromNumber(
    supabase,
    Number(params?.classNumber)
  );
  if (error) return { notFound: true };
  const classItem = { id: classID, number: classNumber };

  const { data: schedule } = await getSchedule(
    supabase,
    "student",
    classID as number
  );
  const { data: subjectList } = await getSubjectList(
    supabase,
    classID as number
  );

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "class",
        "schedule",
      ])),
      classItem,
      schedule,
      subjectList,
    },
    revalidate: 300,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: (await getAllClassNumbers(supabase)).map((number) => ({
      params: { classNumber: number.toString() },
    })),
    fallback: "blocking",
  };
};

LookupClassSchedulePage.navType = "student";

export default LookupClassSchedulePage;
