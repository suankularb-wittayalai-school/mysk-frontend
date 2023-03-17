// External libraries
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// SK Components
import {
  ContentLayout,
  Header,
  MaterialIcon,
  Section,
} from "@suankularb-components/react";

// Internal components
import Schedule from "@/components/schedule/Schedule";

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

const LearnPage: CustomPage<{
  schedule: ScheduleType;
  subjectList: SubjectListItem[];
}> = ({ schedule, subjectList }) => {
  const { t } = useTranslation("learn");

  return (
    <>
      <Head>
        <title>{createTitleStr(t("title"), t)}</title>
      </Head>
      <ContentLayout>
        <Section>
          <Header>{t("schedule")}</Header>
          <Schedule schedule={schedule} role="student" />
        </Section>
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
        "account",
        "learn",
        "schedule",
      ])),
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

LearnPage.pageHeader = {
  title: { key: "title", ns: "learn" },
  icon: <MaterialIcon icon="school" />,
  parentURL: "/account/logout",
};

LearnPage.pageRole = "student";

export default LearnPage;
