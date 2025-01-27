import HomeLayout from "@/components/home/HomeLayout";
import TeachElectiveEntryCard from "@/components/home/TeachElectiveEntryCard";
import TeachReportEntryCard from "@/components/home/TeachReportEntryCard";
import TeachingSubjectCard from "@/components/home/TeachingSubjectCard";
import ScheduleGlance from "@/components/home/glance/ScheduleGlance";
import Schedule from "@/components/schedule/Schedule";
import getLoggedInPerson from "@/utils/backend/account/getLoggedInPerson";
import createMySKClient from "@/utils/backend/mysk/createMySKClient";
import getTeacherSchedule from "@/utils/backend/schedule/getTeacherSchedule";
import getTeachingSubjects from "@/utils/backend/subject/getTeachingSubjects";
import getLocalePath from "@/utils/helpers/getLocalePath";
import useLocale from "@/utils/helpers/useLocale";
import useRefreshProps from "@/utils/helpers/useRefreshProps";
import { BackendReturn } from "@/utils/types/backend";
import { CustomPage, LangCode } from "@/utils/types/common";
import { Teacher, UserRole } from "@/utils/types/person";
import { Schedule as ScheduleType } from "@/utils/types/schedule";
import { SubjectClassrooms } from "@/utils/types/subject";
import {
  Columns,
  DURATION,
  EASING,
  Header,
  Search,
  transition,
} from "@suankularb-components/react";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { LayoutGroup, motion } from "framer-motion";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import useTranslation from "next-translate/useTranslation";
import { useState } from "react";

/**
 * The Teacher’s counterpart to Learn, where the user can see their Schedule
 * and their Subjects.
 *
 * @param schedule Data for displaying Schedule.
 * @param teacher The Teacher viewing this page.
 * @param teachingSubjects An array of Teacher Subject Items, an abstraction of Classroom Subjects connected to this Teacher.
 */
const TeachPage: CustomPage<{
  schedule: ScheduleType;
  teacher: Teacher;
  teachingSubjects: SubjectClassrooms[];
}> = ({ schedule, teacher, teachingSubjects }) => {
  const locale = useLocale();
  const { t } = useTranslation();

  const [query, setQuery] = useState("");

  const refreshProps = useRefreshProps();

  console.warn(teacher);

  return (
    <HomeLayout>
      <LayoutGroup>
        {/* Home Glance */}
        <ScheduleGlance
          schedule={schedule}
          role={UserRole.teacher}
          classroom={teacher.class_advisor_at || undefined}
        />

        {/* Schedule */}
        <motion.section
          className="skc-section"
          layout="position"
          transition={transition(DURATION.medium4, EASING.standard)}
        >
          <Header>{t("schedule/common:title.teacher")}</Header>
          <Schedule
            schedule={schedule}
            subjectsInCharge={teacher.subjects_in_charge}
            teacherID={teacher.id}
            view={UserRole.teacher}
            editable
            onEdit={refreshProps}
          />
        </motion.section>

        {/* Subjects */}
        <motion.section
          className="skc-section !gap-y-3"
          layout="position"
          transition={transition(DURATION.medium4, EASING.standard)}
        >
          <Columns columns={3} className="!items-end">
            <Header className="md:col-span-2">
              {t("home/subjectList:title")}
            </Header>
            <Search
              alt={t("home/subjectList:searchAlt")}
              value={query}
              locale={locale}
              onChange={setQuery}
            />
          </Columns>
          <Columns columns={3} className="!items-stretch">
            {teacher.subjects_in_charge.length > 0 && (
              <TeachReportEntryCard />
            )}
            {teacher.electives_in_charge.length > 0 && (
              <TeachElectiveEntryCard
                electivesInCharge={teacher.electives_in_charge}
              />
            )}
            {teachingSubjects
              .filter(
                (subject) =>
                  subject.subject.name.th.includes(query) ||
                  subject.subject.name["en-US"]?.includes(query) ||
                  subject.subject.code.th.includes(query) ||
                  subject.subject.code["en-US"]?.includes(query),
              )
              .map((subject) => (
                <TeachingSubjectCard key={subject.id} subject={subject} />
              ))}
          </Columns>
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
  const mysk = await createMySKClient(req);
  const supabase = createPagesServerClient({
    req: req as NextApiRequest,
    res: res as NextApiResponse,
  });

  const { data: teacher, error } = (await getLoggedInPerson(supabase, mysk, {
    includeContacts: true,
    detailed: true,
  })) as BackendReturn<Teacher>;
  if (error) return { notFound: true };

  if (teacher.role !== UserRole.teacher)
    return {
      redirect: {
        destination: getLocalePath("/learn", locale as LangCode),
        permanent: false,
      },
    };

  const [schedule, teachingSubjects] = await Promise.all([
    (await getTeacherSchedule(supabase, teacher.id)).data,
    (await getTeachingSubjects(supabase, teacher.id)).data,
  ]);

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "account",
        "home",
        "classes",
      ])),
      schedule,
      teacher,
      teachingSubjects,
    },
  };
};

TeachPage.navType = "teacher";

export default TeachPage;
