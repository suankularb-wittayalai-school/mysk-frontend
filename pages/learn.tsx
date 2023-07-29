// External libraries
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

import { LayoutGroup, motion } from "framer-motion";

import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import Head from "next/head";

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
  transition,
  useAnimationConfig,
} from "@suankularb-components/react";

// Internal components
import MySKPageHeader from "@/components/common/MySKPageHeader";
import Schedule from "@/components/schedule/Schedule";
import ScheduleAtAGlance from "@/components/schedule/ScheduleAtAGlance";
import SubjectList from "@/components/subject/SubjectList";

// Backend
// import { getClassFromUser } from "@/utils/backend/classroom/classroom";
// import { getSchedule } from "@/utils/backend/schedule/schedule";
// import { getSubjectList } from "@/utils/backend/subject/roomSubject";

// Types
import { CustomPage, LangCode } from "@/utils/types/common";
// import { Schedule as ScheduleType } from "@/utils/types/schedule";
// import { SubjectListItem } from "@/utils/types/subject";

// Helpers
import { createTitleStr } from "@/utils/helpers/title";

// Hooks
import getLoggedInPerson from "@/utils/backend/account/getLoggedInPerson";
import getClassSchedule from "@/utils/backend/schedule/getClassSchedule";
import { useLocale } from "@/utils/hooks/i18n";
import { Student } from "@/utils/types/person";
import { Schedule as ScheduleType } from "@/utils/types/schedule";
import { authOptions } from "./api/auth/[...nextauth]";
import { createEmptySchedule } from "@/utils/helpers/schedule";

// const ScheduleSection: FC<{ schedule: ScheduleType }> = ({ schedule }) => {
const ScheduleSection: FC<{ schedule: any }> = ({ schedule }) => {
  const { t } = useTranslation("learn");

  const { duration, easing } = useAnimationConfig();

  return (
    <motion.section
      className="skc-section"
      layout="position"
      transition={transition(duration.medium4, easing.standard)}
    >
      <Header>{t("schedule")}</Header>
      <Schedule schedule={schedule} role="student" />
    </motion.section>
  );
};

// const SubjectListSection: FC<{ subjectList: SubjectListItem[] }> = ({
const SubjectListSection: FC<{ subjectList: any[] }> = ({ subjectList }) => {
  const { t } = useTranslation("schedule");
  const locale = useLocale();

  const { duration, easing } = useAnimationConfig();

  const [query, setQuery] = useState<string>("");

  return (
    <motion.section
      className="skc-section"
      layout="position"
      transition={transition(duration.medium4, easing.standard)}
    >
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
    </motion.section>
  );
};

const LearnPage: CustomPage<{
  schedule: ScheduleType;
  // subjectList: SubjectListItem[];
  subjectList: any[];
}> = ({ schedule, subjectList }) => {
  const { t } = useTranslation("learn");

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
        <LayoutGroup>
          <ScheduleAtAGlance schedule={schedule} role="student" />
          <ScheduleSection schedule={schedule} />
          {/* <SubjectListSection subjectList={subjectList} /> */}
        </LayoutGroup>
      </ContentLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  req,
  res,
}) => {
  const supabase = createPagesServerClient({
    req: req as NextApiRequest,
    res: res as NextApiResponse,
  });

  const { data: user } = await getLoggedInPerson(
    supabase,
    authOptions,
    req,
    res,
  );
  const { data: schedule } = await getClassSchedule(
    supabase,
    (user as Student).classroom!.id,
  );
  // const { data: subjectList } = await getSubjectList(supabase, classItem!.id);

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common", 
        "account",
        "learn",
        "schedule",
      ])),
      schedule: schedule || createEmptySchedule(1, 5),
      // subjectList,
    },
  };
};

LearnPage.navType = "student";

export default LearnPage;
