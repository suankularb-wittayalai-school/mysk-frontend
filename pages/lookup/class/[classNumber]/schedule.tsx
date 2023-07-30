// External libraries
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { FC, useState } from "react";

// SK Components
import {
  Columns,
  ContentLayout,
  Header,
  Search,
  Section,
} from "@suankularb-components/react";

// Internal components
import MySKPageHeader from "@/components/common/MySKPageHeader";
import ClassTabs from "@/components/lookup/class/ClassTabs";
import Schedule from "@/components/schedule/Schedule";
import SubjectList from "@/components/subject/SubjectList";

// Backend

// Supabase
import { supabase } from "@/utils/supabase-backend";

// Types
import { CustomPage, LangCode } from "@/utils/types/common";
import { Schedule as ScheduleType } from "@/utils/types/schedule";
import { ClassroomSubject } from "@/utils/types/subject";

// Helpers
import { createTitleStr } from "@/utils/helpers/title";

// Hooks
import { useLocale } from "@/utils/hooks/i18n";

// Types
import { Classroom } from "@/utils/types/classroom";
import getClassSchedule from "@/utils/backend/schedule/getClassSchedule";
import getClassroomSubjectsOfClass from "@/utils/backend/subject/getClassroomSubjectsOfClass";
import { getCurrentAcademicYear } from "@/utils/helpers/date";

const SubjectListSection: FC<{ subjectList: ClassroomSubject[] }> = ({
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
  classItem: Pick<Classroom, "id" | "number">;
  schedule: ScheduleType;
  subjectList: ClassroomSubject[];
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
        <ClassTabs number={classItem.number} type="lookup" />
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
  if (Number.isNaN(classNumber)) return { notFound: true };

  const {data, error} = await supabase.from("classrooms").select("id").eq("number", classNumber).eq("year", getCurrentAcademicYear()).single();

  if (error) return { notFound: true };

  const classID = data?.id;
  if (!classID) return { notFound: true };

  const classItem = { id: classID, number: classNumber };

  const { data: schedule } = await getClassSchedule(
    supabase,
    classID
  );
  const { data: subjectList } = await getClassroomSubjectsOfClass(
    supabase,
    classID
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
  const { data: classNumbers, error } = await supabase.from("classrooms").select("number").eq("year", getCurrentAcademicYear());
  
  if (error) return { paths: [], fallback: "blocking" };

  return {
    paths: classNumbers!.map((classroom) => ({
      params: { classNumber: classroom.number.toString() },
    })),
    fallback: "blocking",
  };
};

LookupClassSchedulePage.navType = "student";

export default LookupClassSchedulePage;
