import BirthdayGlance from "@/components/home/BirthdayGlance";
import HomeLayout from "@/components/home/HomeLayout";
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
  Header,
  Search,
  Section,
  transition,
  useAnimationConfig,
} from "@suankularb-components/react";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { LayoutGroup, motion } from "framer-motion";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
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
  const { t: ts } = useTranslation("schedule");
  const locale = useLocale();

  const { duration, easing } = useAnimationConfig();

  const [query, setQuery] = useState<string>("");

  return (
    <HomeLayout>
      <LayoutGroup>
        {/* Glances */}
        <Section className="!gap-2 empty:!hidden">
          {birthdayBoys.map((birthdayBoy) => (
            <BirthdayGlance key={birthdayBoy.id} person={birthdayBoy} />
          ))}
          <ScheduleGlance
            schedule={schedule}
            role={UserRole.student}
            classroom={classroom}
          />
        </Section>

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
            <Header className="md:col-span-2">{ts("subjectList.title")}</Header>
            <Search
              alt={ts("subjectList.search")}
              value={query}
              locale={locale}
              onChange={setQuery}
            />
          </Columns>
          <SubjectList subjectList={subjectList} query={query} />
        </motion.section>
      </LayoutGroup>
    </HomeLayout>
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

  const [birthdayBoys, schedule, subjectList] = await Promise.all([
    (await getBirthdayBoysOfClassroom(supabase, classroom.id)).data,
    (await getClassSchedule(supabase, classroom.id)).data,
    (await getClassroomSubjectsOfClass(supabase, classroom.id)).data,
  ]);

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
