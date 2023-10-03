// Imports
import PageHeader from "@/components/common/PageHeader";
import Schedule from "@/components/schedule/Schedule";
import ScheduleAtAGlance from "@/components/schedule/ScheduleAtAGlance";
import SubjectList from "@/components/subject/SubjectList";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import getLoggedInPerson from "@/utils/backend/account/getLoggedInPerson";
import getClassSchedule from "@/utils/backend/schedule/getClassSchedule";
import getClassroomSubjectsOfClass from "@/utils/backend/subject/getClassroomSubjectsOfClass";
import createEmptySchedule from "@/utils/helpers/schedule/createEmptySchedule";
import useLocale from "@/utils/helpers/useLocale";
import { CustomPage, LangCode } from "@/utils/types/common";
import { Student } from "@/utils/types/person";
import { Schedule as ScheduleType } from "@/utils/types/schedule";
import { ClassroomSubject } from "@/utils/types/subject";
import {
  Columns,
  ContentLayout,
  Header,
  Search,
  transition,
  useAnimationConfig,
} from "@suankularb-components/react";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { LayoutGroup, motion } from "framer-motion";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useState } from "react";

/**
 * The Student’s counterpart to Teach, where the user can see their Schedule
 * and their Subjects.
 *
 * @param schedule Data for displaying Schedule.
 * @param subjectList The Subjects this Student’s Classroom is enrolled in.
 */
const LearnPage: CustomPage<{
  schedule: ScheduleType;
  subjectList: ClassroomSubject[];
}> = ({ schedule, subjectList }) => {
  const { t } = useTranslation("learn");
  const { t: tx } = useTranslation(["common", "schedule"]);
  const locale = useLocale();

  const { duration, easing } = useAnimationConfig();

  const [query, setQuery] = useState<string>("");

  return (
    <>
      <Head>
        <title>{tx("tabName", { tabName: t("title") })}</title>
      </Head>
      <PageHeader>{t("title")}</PageHeader>

      <ContentLayout>
        <LayoutGroup>
          {/* At a Glance */}
          <ScheduleAtAGlance schedule={schedule} role="student" />

          {/* Schedule */}
          <motion.section
            className="skc-section"
            layout="position"
            transition={transition(duration.medium4, easing.standard)}
          >
            <Header>{t("schedule")}</Header>
            <Schedule schedule={schedule} view="student" />
          </motion.section>

          {/* Subject list */}
          <motion.section
            className="skc-section"
            layout="position"
            transition={transition(duration.medium4, easing.standard)}
          >
            <Columns columns={3} className="!items-end">
              <Header className="md:col-span-2">
                {tx("subjectList.title", { ns: "schedule" })}
              </Header>
              <Search
                alt={tx("subjectList.search", { ns: "schedule" })}
                value={query}
                locale={locale}
                onChange={setQuery}
              />
            </Columns>
            <SubjectList subjectList={subjectList} query={query} />
          </motion.section>
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
  const { data: subjectList } = await getClassroomSubjectsOfClass(
    supabase,
    (user as Student).classroom!.id,
  );

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "account",
        "learn",
        "schedule",
      ])),
      schedule: schedule || createEmptySchedule(1, 5),
      subjectList,
    },
  };
};

LearnPage.navType = "student";

export default LearnPage;
