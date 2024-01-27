// Imports
import PageHeader from "@/components/common/PageHeader";
import BirthdayGlance from "@/components/home/BirthdayGlance";
import ScheduleGlance from "@/components/home/ScheduleGlance";
import SubjectList from "@/components/home/SubjectList";
import Schedule from "@/components/schedule/Schedule";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import getLoggedInPerson from "@/utils/backend/account/getLoggedInPerson";
import getBirthdayBoysOfClassroom from "@/utils/backend/classroom/getBirthdayBoysOfClassroom";
import getClassSchedule from "@/utils/backend/schedule/getClassSchedule";
import getClassroomSubjectsOfClass from "@/utils/backend/subject/getClassroomSubjectsOfClass";
import createEmptySchedule from "@/utils/helpers/schedule/createEmptySchedule";
import useLocale from "@/utils/helpers/useLocale";
import { Classroom } from "@/utils/types/classroom";
import { CustomPage, LangCode } from "@/utils/types/common";
import { Student, UserRole } from "@/utils/types/person";
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
 * @param birthdayBoys The Students in this Student’s Classroom who have a birthday today.
 * @param schedule Data for displaying Schedule.
 * @param subjectList The Subjects this Student’s Classroom is enrolled in.
 */
const LearnPage: CustomPage<{
  birthdayBoys: Pick<Student, "id" | "first_name" | "nickname" | "birthdate">[];
  schedule: ScheduleType;
  subjectList: ClassroomSubject[];
  classroom: Pick<Classroom, "number">;
}> = ({ birthdayBoys, schedule, subjectList, classroom }) => {
  const { t } = useTranslation("learn");
  const { t: tx } = useTranslation(["common", "schedule"]);
  const locale = useLocale();

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
          {/* Glances */}
          {birthdayBoys.map((birthdayBoy) => (
            <BirthdayGlance key={birthdayBoy.id} person={birthdayBoy} />
          ))}
          <ScheduleGlance
            schedule={schedule}
            role={UserRole.student}
            classroom={classroom}
          />

          {/* Schedule */}
          <motion.section
            className="skc-section"
            layout="position"
            transition={transition(duration.medium4, easing.standard)}
          >
            <Header>{t("schedule")}</Header>
            <Schedule schedule={schedule} view={UserRole.student} />
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

  const { data: student } = (await getLoggedInPerson(
    supabase,
    authOptions,
    req,
    res,
  )) as { data: Student };

  const { classroom } = student;
  if (!classroom) return { notFound: true };

  const { data: birthdayBoys } = await getBirthdayBoysOfClassroom(
    supabase,
    classroom.id,
  );
  const { data: schedule } = await getClassSchedule(supabase, classroom!.id);
  const { data: subjectList } = await getClassroomSubjectsOfClass(
    supabase,
    classroom!.id,
  );

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "account",
        "home",
        "learn",
        "classes",
        "schedule",
      ])),
      birthdayBoys: birthdayBoys || [],
      schedule: schedule || createEmptySchedule(1, 5),
      subjectList,
      classroom,
    },
  };
};

LearnPage.navType = "student";

export default LearnPage;
