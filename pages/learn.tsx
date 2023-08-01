/**
 * `/learn` TABLE OF CONTENTS
 *
 * Note: `Ctrl` + click to jump to a component.
 *
 * **Sections**
 * - {@link ScheduleSection}
 * - {@link SubjectListSection}
 *
 * **Page**
 * - {@link LearnPage}
 */

// Imports
import MySKPageHeader from "@/components/common/MySKPageHeader";
import Schedule from "@/components/schedule/Schedule";
import ScheduleAtAGlance from "@/components/schedule/ScheduleAtAGlance";
import SubjectList from "@/components/subject/SubjectList";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import getLoggedInPerson from "@/utils/backend/account/getLoggedInPerson";
import getClassSchedule from "@/utils/backend/schedule/getClassSchedule";
import getClassroomSubjectsOfClass from "@/utils/backend/subject/getClassroomSubjectsOfClass";
import { createEmptySchedule } from "@/utils/helpers/schedule";
import { createTitleStr } from "@/utils/helpers/title";
import { useLocale } from "@/utils/hooks/i18n";
import { CustomPage, LangCode } from "@/utils/types/common";
import { Student } from "@/utils/types/person";
import { Schedule as ScheduleType } from "@/utils/types/schedule";
import { ClassroomSubject } from "@/utils/types/subject";
import {
  Columns,
  ContentLayout,
  Header,
  MaterialIcon,
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
import { FC, useState } from "react";

/**
 * Displays the Student’s Schedule and relevant related information.
 *
 * @param schedule Data for displaying Schedule.
 *
 * @returns A Section.
 */
const ScheduleSection: FC<{ schedule: ScheduleType }> = ({ schedule }) => {
  const { t } = useTranslation("learn");

  const { duration, easing } = useAnimationConfig();

  return (
    <motion.section
      className="skc-section"
      layout="position"
      transition={transition(duration.medium4, easing.standard)}
    >
      <Header>{t("schedule")}</Header>
      <Schedule schedule={schedule} view="student" />
    </motion.section>
  );
};

const SubjectListSection: FC<{
  subjectList: ClassroomSubject[];
}> = ({ subjectList }) => {
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
  subjectList: ClassroomSubject[];
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
          <SubjectListSection subjectList={subjectList} />
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

  // console.log({ user, schedule, subjectList })

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
