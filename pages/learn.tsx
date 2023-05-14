// External libraries
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

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
  Section,
} from "@suankularb-components/react";

// Internal components
import MySKPageHeader from "@/components/common/MySKPageHeader";
import Schedule from "@/components/schedule/Schedule";
import SubjectList from "@/components/subject/SubjectList";

// Backend
import {
  getClassIDFromNumber,
  getClassFromUser,
} from "@/utils/backend/classroom/classroom";
import { getSchedule } from "@/utils/backend/schedule/schedule";
import { getSubjectList } from "@/utils/backend/subject/roomSubject";

// Types
import { CustomPage, LangCode } from "@/utils/types/common";
import { Schedule as ScheduleType } from "@/utils/types/schedule";
import { SubjectListItem } from "@/utils/types/subject";

// Helpers
import { createTitleStr } from "@/utils/helpers/title";

// Hooks
import { useLocale } from "@/utils/hooks/i18n";

const ScheduleSection: FC<{ schedule: ScheduleType }> = ({ schedule }) => {
  const { t } = useTranslation("learn");

  return (
    <Section>
      <Header>{t("schedule")}</Header>
      <Schedule schedule={schedule} role="student" />
    </Section>
  );
};

const SubjectListSection: FC<{ subjectList: SubjectListItem[] }> = ({
  subjectList,
}) => {
  const { t } = useTranslation("schedule");
  const locale = useLocale();

  const [query, setQuery] = useState<string>("");

  return (
    <Section>
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
    </Section>
  );
};

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
      <MySKPageHeader
        title={t("title")}
        icon={<MaterialIcon icon="school" />}
      />
      <ContentLayout>
        <ScheduleSection schedule={schedule} />
        <SubjectListSection subjectList={subjectList} />
      </ContentLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  req,
  res,
}) => {
  const supabase = createServerSupabaseClient({
    req: req as NextApiRequest,
    res: res as NextApiResponse,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { data: classItem } = await getClassFromUser(supabase, session!.user);
  const { data: schedule } = await getSchedule(
    supabase,
    "student",
    classItem!.id
  );
  const { data: subjectList } = await getSubjectList(supabase, classItem!.id);

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
  };
};

LearnPage.navType = "student";

export default LearnPage;
