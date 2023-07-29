/**
 * `/teach` TABLE OF CONTENTS
 *
 * Note: `Ctrl` + click to jump to a component.
 *
 * **Sections**
 * - {@link ScheduleSection}
 * - {@link SubjectsSection}
 *
 * **Page**
 * - {@link TeachPage}
 */

// External libraries
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

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
import TeachingSubjectCard from "@/components/subject/TeachingSubjectCard";

// Backend
import { getUserMetadata } from "@/utils/backend/account/getUserByEmail";
import { getSchedule } from "@/utils/backend/schedule/schedule";
import { getTeachingSubjects } from "@/utils/backend/subject/roomSubject";
import { getSubjectsInCharge } from "@/utils/backend/subject/subject";

// Helpers
import { getLocalePath } from "@/utils/helpers/i18n";
import { createTitleStr } from "@/utils/helpers/title";

// Hooks
import { useLocale } from "@/utils/hooks/i18n";

// Types
import { CustomPage, LangCode } from "@/utils/types/common";
import { Schedule as ScheduleType } from "@/utils/types/schedule";
import { SubjectWNameAndCode, TeacherSubjectItem } from "@/utils/types/subject";
import { LayoutGroup, motion } from "framer-motion";

/**
 * Displays the Teacher’s Schedule and relevant related information.
 *
 * @param schedule Data for displaying Schedule.
 * @param subjectsInCharge The Subjects assigned to this teacher. Used in editing the Schedule.
 * @param teacherID The Teacher’s database ID. Used in validating edits in the Schedule.
 *
 * @returns A Section.
 */
const ScheduleSection: FC<{
  schedule: ScheduleType;
  subjectsInCharge: SubjectWNameAndCode[];
  teacherID: number;
}> = ({ schedule, subjectsInCharge, teacherID }) => {
  const { t } = useTranslation("teach");

  const { duration, easing } = useAnimationConfig();

  return (
    <motion.section
      className="skc-section"
      layout="position"
      transition={transition(duration.medium4, easing.standard)}
    >
      <Header>{t("schedule.title")}</Header>
      <Schedule {...{ schedule, subjectsInCharge, teacherID }} role="teacher" />
    </motion.section>
  );
};

/**
 * Displays the Teacher’s Subjects.
 *
 * @param subjects An array of Teacher Subject Items, an abstraction of Room Subjects connected to this Teacher.
 *
 * @returns A Section.
 */
const SubjectsSection: FC<{
  subjects: TeacherSubjectItem[];
}> = ({ subjects }) => {
  const locale = useLocale();
  const { t } = useTranslation("teach");

  const { duration, easing } = useAnimationConfig();

  const [globalFilter, setGlobalFilter] = useState<string>("");

  return (
    <motion.section
      className="skc-section !gap-y-3"
      layout="position"
      transition={transition(duration.medium4, easing.standard)}
    >
      <Columns columns={3} className="!items-end">
        <Header className="md:col-span-2">{t("subjects.title")}</Header>
        <Search
          alt="Search subjects"
          value={globalFilter}
          locale={locale}
          onChange={setGlobalFilter}
        />
      </Columns>
      <Columns columns={3}>
        {subjects
          .filter(
            (subject) =>
              subject.subject.name.th.name.includes(globalFilter) ||
              subject.subject.name["en-US"]?.name.includes(globalFilter) ||
              subject.subject.code["en-US"].includes(globalFilter) ||
              subject.subject.code["en-US"].includes(globalFilter),
          )
          .map((subject) => (
            <TeachingSubjectCard key={subject.id} subject={subject} />
          ))}
      </Columns>
    </motion.section>
  );
};

/**
 * The Teacher’s counterpart to Learn, where the user can see their Schedule
 * and their Subjects.
 *
 * @param schedule Data for displaying Schedule.
 * @param subjectsInCharge The Subjects assigned to this teacher. Used in editing the Schedule.
 * @param teachingSubjects An array of Teacher Subject Items, an abstraction of Room Subjects connected to this Teacher.
 * @param teacherID The Teacher’s database ID. Used in validating edits in the Schedule.
 *
 * @returns A Page.
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
        <LayoutGroup>
          <ScheduleAtAGlance schedule={schedule} role="teacher" />
          <ScheduleSection {...{ schedule, subjectsInCharge, teacherID }} />
          <SubjectsSection subjects={teachingSubjects} />
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

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { data: metadata, error: metadataError } = await getUserMetadata(
    supabase,
    session!.user.id,
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
    teacherID,
  );
  const { data: teachingSubjects } = await getTeachingSubjects(
    supabase,
    teacherID,
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
