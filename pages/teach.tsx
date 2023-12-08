// Imports
import PageHeader from "@/components/common/PageHeader";
import HomeGlance from "@/components/home/HomeGlance";
import TeachingSubjectCard from "@/components/home/TeachingSubjectCard";
import Schedule from "@/components/schedule/Schedule";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import getLoggedInPerson from "@/utils/backend/account/getLoggedInPerson";
import getTeacherSchedule from "@/utils/backend/schedule/getTeacherSchedule";
import getTeachingSubjects from "@/utils/backend/subject/getTeachingSubjects";
import getLocalePath from "@/utils/helpers/getLocalePath";
import useLocale from "@/utils/helpers/useLocale";
import { BackendReturn } from "@/utils/types/backend";
import { Classroom } from "@/utils/types/classroom";
import { CustomPage, LangCode } from "@/utils/types/common";
import { Teacher, UserRole } from "@/utils/types/person";
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
 * @param classroom The Classroom this Teacher is the Class Advisor of. Used in Attendance.
 */
const TeachPage: CustomPage<{
  schedule: ScheduleType;
  subjectsInCharge: Pick<Subject, "id" | "name" | "code" | "short_name">[];
  teachingSubjects: SubjectClassrooms[];
  teacherID: string;
  classroom: Pick<Classroom, "number">;
}> = ({
  schedule,
  subjectsInCharge,
  teachingSubjects,
  teacherID,
  classroom,
}) => {
  const locale = useLocale();
  const { t } = useTranslation("teach");
  const { t: tx } = useTranslation("common");

  const { duration, easing } = useAnimationConfig();

  const [query, setQuery] = useState<string>("");

  return (
    <>
      <Head>
        <title>{tx("appName")}</title>
      </Head>
      <PageHeader>{tx("appName")}</PageHeader>
      <ContentLayout>
        <LayoutGroup>
          {/* Home Glance */}
          <HomeGlance
            schedule={schedule}
            role={UserRole.teacher}
            classroom={classroom}
          />

          {/* Schedule */}
          <motion.section
            className="skc-section"
            layout="position"
            transition={transition(duration.medium4, easing.standard)}
          >
            <Header>{t("schedule.title")}</Header>
            <Schedule
              {...{ schedule, subjectsInCharge, teacherID }}
              view={UserRole.teacher}
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

  const { data: teacher, error } = (await getLoggedInPerson(
    supabase,
    authOptions,
    req,
    res,
    { includeContacts: true, detailed: true },
  )) as BackendReturn<Teacher>;
  if (error) return { notFound: true };

  const classroom = teacher.class_advisor_at;

  if (teacher.role !== UserRole.teacher)
    return {
      redirect: {
        destination: getLocalePath("/learn", locale as LangCode),
        permanent: false,
      },
    };

  const { data: schedule } = await getTeacherSchedule(supabase, teacher.id);
  const { data: teachingSubjects } = await getTeachingSubjects(
    supabase,
    teacher.id,
  );

  const teacherID = teacher.id;

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "account",
        "teach",
        "classes",
        "schedule",
      ])),
      schedule,
      subjectsInCharge: teacher.subjects_in_charge,
      teachingSubjects,
      teacherID,
      classroom,
    },
  };
};

TeachPage.navType = "teacher";

export default TeachPage;
