// External libraries
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// SK Components
import {
  Header,
  MaterialIcon,
  RegularLayout,
  Section,
  Title,
} from "@suankularb-components/react";

// Components
import LogOutDialog from "@components/dialogs/LogOut";
import Schedule from "@components/schedule/Schedule";
import SubjectListTable from "@components/tables/SubjectListTable";

// Backend
import {
  getAllClassNumbers,
  getClassIDFromNumber,
} from "@utils/backend/classroom/classroom";
import { getSchedule } from "@utils/backend/schedule/schedule";
import { getSubjectList } from "@utils/backend/subject/roomSubject";

// Supabase
import { supabase } from "@utils/supabase-backend";

// Types
import { LangCode } from "@utils/types/common";
import { Schedule as ScheduleType } from "@utils/types/schedule";
import { SubjectListItem } from "@utils/types/subject";

// Helpers
import { createTitleStr } from "@utils/helpers/title";

// Hooks
import { useToggle } from "@utils/hooks/toggle";

const StudentSchedule: NextPage<{
  schedule: ScheduleType;
  subjectList: SubjectListItem[];
}> = ({ schedule, subjectList }) => {
  const { t } = useTranslation("learn");

  // Dialog control
  const [showLogOut, toggleShowLogOut] = useToggle();

  return (
    <>
      <Head>
        <title>{createTitleStr(t("title"), t)}</title>
      </Head>
      <RegularLayout
        Title={
          <Title
            name={{
              title: t("title"),
            }}
            pageIcon={<MaterialIcon icon="school" />}
            backGoesTo={toggleShowLogOut}
            LinkElement={Link}
          />
        }
      >
        <Section className="!max-w-[81.5rem] items-center">
          <div className="w-full max-w-[70.5rem]">
            <Header
              icon={<MaterialIcon icon="dashboard" allowCustomSize />}
              text={t("schedule")}
            />
          </div>
          <Schedule schedule={schedule} role="student" />
        </Section>
        <Section>
          <SubjectListTable subjectList={subjectList} />
        </Section>
      </RegularLayout>

      {/* Dialogs */}
      <LogOutDialog show={showLogOut} onClose={toggleShowLogOut} />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
  const classNumber = Number(params?.classNumber);
  if (!classNumber) return { notFound: true };

  const { data: classID, error } = await getClassIDFromNumber(
    supabase,
    Number(params?.classNumber)
  );
  if (error) return { notFound: true };

  const { data: schedule } = await getSchedule(
    supabase,
    "student",
    classID as number
  );
  const { data: subjectList } = await getSubjectList(
    supabase,
    classID as number
  );

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
    revalidate: 300,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: (await getAllClassNumbers(supabase)).map((number) => ({
      params: { classNumber: number.toString() },
    })),
    fallback: "blocking",
  };
};

export default StudentSchedule;
