// External libraries
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import Head from "next/head";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { FC } from "react";

// SK Components
import {
  Columns,
  ContentLayout,
  Header,
  MaterialIcon,
  Search,
  Section,
} from "@suankularb-components/react";

// Internal components
import MySKPageHeader from "@/components/common/MySKPageHeader";
import Schedule from "@/components/schedule/Schedule";

// Backend
import { getUserMetadata } from "@/utils/backend/account";
import { getSchedule } from "@/utils/backend/schedule/schedule";
import {
  getSubjectsInCharge,
  getTeachingSubjects,
} from "@/utils/backend/subject/subject";

// Helpers
import { getLocalePath } from "@/utils/helpers/i18n";
import { createTitleStr } from "@/utils/helpers/title";

// Hooks
import { useLocale } from "@/utils/hooks/i18n";

// Types
import { CustomPage, LangCode } from "@/utils/types/common";
import { Schedule as ScheduleType } from "@/utils/types/schedule";
import { SubjectWNameAndCode, TeacherSubjectItem } from "@/utils/types/subject";
import TeachingSubjectCard from "@/components/subject/TeachingSubjectCard";

const ScheduleSection: FC<{
  schedule: ScheduleType;
  subjectsInCharge: SubjectWNameAndCode[];
  teacherID: number;
}> = ({ schedule, subjectsInCharge, teacherID }) => {
  const { t } = useTranslation("teach");

  return (
    <Section>
      <Header>{t("schedule.title")}</Header>
      <Schedule {...{ schedule, subjectsInCharge, teacherID }} role="teacher" />
    </Section>
  );
};

const SubjectsSection: FC<{
  subjects: TeacherSubjectItem[];
}> = ({ subjects }) => {
  const locale = useLocale();
  const { t } = useTranslation("teach");

  return (
    <Section>
      <Columns columns={3}>
        <Header className="md:col-span-2">{t("subjects.title")}</Header>
        <Search alt="Search subjects" locale={locale} />
      </Columns>
      <Columns columns={3}>
        {subjects.map((subject) => (
          <TeachingSubjectCard key={subject.id} subject={subject} />
        ))}
      </Columns>
    </Section>
  );
};

/**
 *
 */
const TeachPage: CustomPage<{
  schedule: ScheduleType;
  subjectsInCharge: SubjectWNameAndCode[];
  teachingSubjects: TeacherSubjectItem[];
  teacherID: number;
}> = ({ schedule, subjectsInCharge, teachingSubjects, teacherID }) => {
  const { t } = useTranslation(["teach", "common"]);

  return (
    <>
      <Head>
        <title>{createTitleStr(t("title"), t)}</title>
      </Head>
      <MySKPageHeader
        title={t("title")}
        icon={<MaterialIcon icon="school" />}
      />
      <ContentLayout>
        <ScheduleSection {...{ schedule, subjectsInCharge, teacherID }} />
        <SubjectsSection subjects={teachingSubjects} />
      </ContentLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  req,
  res,
}) => {
  const supabase = createServerSupabaseClient({
    req: req as NextApiRequest,
    res: res as NextApiResponse,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { data: metadata, error: metadataError } = await getUserMetadata(
    supabase,
    session!.user.id
  );
  if (metadataError) console.error(metadataError);

  if (!metadata?.onboarded)
    return {
      redirect: {
        destination: getLocalePath("/account/welcome", locale as LangCode),
        permanent: false,
      },
    };

  const teacherID = metadata.teacher!;
  const { data: schedule } = await getSchedule(supabase, "teacher", teacherID);
  const { data: subjectsInCharge } = await getSubjectsInCharge(
    supabase,
    teacherID
  );
  const { data: teachingSubjects } = await getTeachingSubjects(
    supabase,
    teacherID
  );

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "account",
        "teach",
        "schedule",
      ])),
      schedule,
      subjectsInCharge,
      teachingSubjects,
      teacherID,
    },
  };
};

TeachPage.navType = "teacher";

export default TeachPage;
