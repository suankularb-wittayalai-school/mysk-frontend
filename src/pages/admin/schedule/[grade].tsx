// External libraries
import {
  GetServerSideProps,
  NextApiRequest,
  NextApiResponse,
  NextPage,
} from "next";
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

// Component
import Schedule from "@components/schedule/Schedule";

// Backend
import { getSchedulesOfGrade } from "@utils/backend/schedule/schedule";

// Types
import { ClassWNumber } from "@utils/types/class";
import { LangCode } from "@utils/types/common";
import { Schedule as ScheduleType } from "@utils/types/schedule";

// Helpers
import { createTitleStr } from "@utils/helpers/title";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

const ScheduleSection = ({
  schedule,
}: {
  schedule: ScheduleType;
}): JSX.Element => {
  const { t } = useTranslation("common");

  return (
    <Section>
      <Header
        icon={<MaterialIcon icon="subdirectory_arrow_right" allowCustomSize />}
        text={t("class", { number: (schedule.class as ClassWNumber).number })}
      />
      <Schedule schedule={schedule} role="student" />
    </Section>
  );
};

const SchedulesThisGrade: NextPage<{
  grade: number;
  schedulesThisGrade: ScheduleType[];
}> = ({ grade, schedulesThisGrade }) => {
  const { t } = useTranslation(["admin", "common"]);

  return (
    <>
      <Head>
        <title>
          {createTitleStr(t("schedule.grade.tabTitle", { grade }), t)}
        </title>
      </Head>
      <RegularLayout
        Title={
          <Title
            name={{
              title: t("schedule.grade.pageTitle"),
              subtitle: t("schedule.gradeItem", { grade }),
            }}
            pageIcon={<MaterialIcon icon="dashboard" />}
            backGoesTo="/admin"
            LinkElement={Link}
          />
        }
      >
        {schedulesThisGrade.map((schedule) => (
          <ScheduleSection key={schedule.class?.id} schedule={schedule} />
        ))}
      </RegularLayout>
    </>
  );
};
export const getServerSideProps: GetServerSideProps = async ({
  locale,
  params,
  req,
  res,
}) => {
  const supabase = createServerSupabaseClient({
    req: req as NextApiRequest,
    res: res as NextApiResponse,
  });

  const grade = Number(params?.grade);

  const { data: schedulesThisGrade, error } = await getSchedulesOfGrade(
    supabase,
    grade
  );
  if (error) return { notFound: true };

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "admin",
        "schedule",
      ])),
      grade,
      schedulesThisGrade,
    },
  };
};

export default SchedulesThisGrade;
