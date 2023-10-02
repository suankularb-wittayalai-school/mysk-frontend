// Imports
import PageHeader from "@/components/common/PageHeader";
import Schedule from "@/components/schedule/Schedule";
import ScheduleAtAGlance from "@/components/schedule/ScheduleAtAGlance";
import TeachingSubjectCard from "@/components/subject/TeachingSubjectCard";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import getLoggedInPerson from "@/utils/backend/account/getLoggedInPerson";
import getTeacherSchedule from "@/utils/backend/schedule/getTeacherSchedule";
import getTeachingSubjects from "@/utils/backend/subject/getTeachingSubjects";
import { getLocalePath } from "@/utils/helpers/string";
import { useLocale } from "@/utils/hooks/i18n";
import { CustomPage, LangCode } from "@/utils/types/common";
import { Schedule as ScheduleType } from "@/utils/types/schedule";
import { Subject, SubjectClassrooms } from "@/utils/types/subject";
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
 * The Teacher’s counterpart to Learn, where the user can see their Schedule
 * and their Subjects.
 *
 * @param schedule Data for displaying Schedule.
 * @param subjectsInCharge The Subjects assigned to this teacher. Used in editing the Schedule.
 * @param teachingSubjects An array of Teacher Subject Items, an abstraction of Room Subjects connected to this Teacher.
 * @param teacherID The Teacher’s database ID. Used in validating edits in the Schedule.
 */
const TeachPage: CustomPage<{
  schedule: ScheduleType;
  subjectsInCharge: Pick<Subject, "id" | "name" | "code" | "short_name">[];
  teachingSubjects: SubjectClassrooms[];
  teacherID: string;
}> = ({ schedule, subjectsInCharge, teachingSubjects, teacherID }) => {
  const locale = useLocale();
  const { t } = useTranslation("teach");
  const { t: tx } = useTranslation("common");

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
          <ScheduleAtAGlance schedule={schedule} role="teacher" />

          {/* Schedule */}
          <motion.section
            className="skc-section"
            layout="position"
            transition={transition(duration.medium4, easing.standard)}
          >
            <Header>{t("schedule.title")}</Header>
            <Schedule
              {...{ schedule, subjectsInCharge, teacherID }}
              view="teacher"
              editable
            />
          </motion.section>

          {/* Subjects */}
          <motion.section
            className="skc-section !gap-y-3"
            layout="position"
            transition={transition(duration.medium4, easing.standard)}
          >
            <Columns columns={3} className="!items-end">
              <Header className="md:col-span-2">{t("subjects.title")}</Header>
              <Search
                alt="Search subjects"
                value={query}
                locale={locale}
                onChange={setQuery}
              />
            </Columns>
            <Columns columns={3}>
              {teachingSubjects
                .filter(
                  (subject) =>
                    subject.subject.name.th.includes(query) ||
                    subject.subject.name["en-US"]?.includes(query) ||
                    subject.subject.code["en-US"]?.includes(query) ||
                    subject.subject.code["en-US"]?.includes(query),
                )
                .map((subject) => (
                  <TeachingSubjectCard key={subject.id} subject={subject} />
                ))}
            </Columns>
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

  const { data: user, error } = await getLoggedInPerson(
    supabase,
    authOptions,
    req,
    res,
    { includeContacts: true, detailed: true },
  );

  if (error) return { notFound: true };
  if (user.role !== "teacher")
    return {
      redirect: {
        destination: getLocalePath("/learn", locale as LangCode),
        permanent: false,
      },
    };

  const { data: schedule } = await getTeacherSchedule(supabase, user.id);
  const { data: teachingSubjects } = await getTeachingSubjects(
    supabase,
    user.id,
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
      subjectsInCharge: user.subjects_in_charge,
      teachingSubjects,
      teacherID: user.id,
    },
  };
};

TeachPage.navType = "teacher";

export default TeachPage;
