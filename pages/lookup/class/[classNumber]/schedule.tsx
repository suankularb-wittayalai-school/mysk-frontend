// Imports
import PageHeader from "@/components/common/PageHeader";
import ClassTabs from "@/components/lookup/class/ClassTabs";
import Schedule from "@/components/schedule/Schedule";
import SubjectList from "@/components/subject/SubjectList";
import getClassSchedule from "@/utils/backend/schedule/getClassSchedule";
import getClassroomSubjectsOfClass from "@/utils/backend/subject/getClassroomSubjectsOfClass";
import getCurrentAcademicYear from "@/utils/helpers/getCurrentAcademicYear";
import { createTitleStr } from "@/utils/helpers/title";
import useLocale from "@/utils/helpers/useLocale";
import { supabase } from "@/utils/supabase-backend";
import { Classroom } from "@/utils/types/classroom";
import { CustomPage, LangCode } from "@/utils/types/common";
import { Schedule as ScheduleType } from "@/utils/types/schedule";
import { ClassroomSubject } from "@/utils/types/subject";
import {
  Columns,
  ContentLayout,
  Header,
  Search,
  Section,
} from "@suankularb-components/react";
import { GetStaticPaths, GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { FC, useState } from "react";

const SubjectListSection: FC<{
  subjectList: ClassroomSubject[];
}> = ({ subjectList }) => {
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
  classroom: Pick<Classroom, "id" | "number">;
  schedule: ScheduleType;
  subjectList: ClassroomSubject[];
}> = ({ classroom, schedule, subjectList }) => {
  // Translation
  const { t } = useTranslation("class");
  const { t: tx } = useTranslation("common");

  const parentURL = `/lookup/class/${classroom.number}`;

  return (
    <>
      <Head>
        <title>
          {createTitleStr(
            t("schedule.title", { number: classroom.number }),
            tx,
          )}
        </title>
      </Head>
      <PageHeader
        title={t("schedule.title", { number: classroom.number })}
        parentURL={parentURL}
      >
        <ClassTabs number={classroom.number} type="lookup" />
      </PageHeader>
      <ContentLayout>
        <Schedule schedule={schedule} view="student" />
        <SubjectListSection subjectList={subjectList} />
      </ContentLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
  const classNumber = Number(params?.classNumber);
  if (Number.isNaN(classNumber)) return { notFound: true };

  const { data, error } = await supabase
    .from("classrooms")
    .select("id")
    .eq("number", classNumber)
    .eq("year", getCurrentAcademicYear())
    .single();

  if (error) return { notFound: true };

  const classID = data?.id;
  if (!classID) return { notFound: true };

  const classroom = { id: classID, number: classNumber };

  const { data: schedule } = await getClassSchedule(supabase, classID);
  const { data: subjectList } = await getClassroomSubjectsOfClass(
    supabase,
    classID,
  );

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "class",
        "schedule",
      ])),
      classroom,
      schedule,
      subjectList,
    },
    revalidate: 300,
  };
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: "blocking",
});

LookupClassSchedulePage.navType = "student";

export default LookupClassSchedulePage;
