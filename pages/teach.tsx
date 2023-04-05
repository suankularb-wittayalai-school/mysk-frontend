// External libraries
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import Head from "next/head";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

// SK Components
import {
  ContentLayout,
  Header,
  MaterialIcon,
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

// Types
import { CustomPage, LangCode } from "@/utils/types/common";
import { Schedule as ScheduleType } from "@/utils/types/schedule";
import { SubjectWNameAndCode, TeacherSubjectItem } from "@/utils/types/subject";

// Page
const TeachPage: CustomPage<{
  schedule: ScheduleType;
  subjectsInCharge: SubjectWNameAndCode[];
  teachingSubjects: TeacherSubjectItem[];
  teacherID: number;
}> = ({ schedule, subjectsInCharge, teachingSubjects, teacherID }) => {
  const { t } = useTranslation("teach");

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
        <Section>
          <Header>{t("schedule.title")}</Header>
          <Schedule
            {...{ schedule, subjectsInCharge, teacherID }}
            role="teacher"
          />
        </Section>
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
      subjects: teachingSubjects,
      teacherID,
    },
  };
};

TeachPage.pageRole = "teacher";

export default TeachPage;
