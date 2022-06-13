// Modules
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

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

// Types
import { Schedule as ScheduleType } from "@utils/types/schedule";

const ScheduleSection = ({
  schedule,
}: {
  schedule: ScheduleType;
}): JSX.Element => {
  const { t } = useTranslation("common");
  const locale = useRouter().locale as "en-US" | "th";

  return (
    <Section>
      <Header
        icon={<MaterialIcon icon="subdirectory_arrow_right" allowCustomSize />}
        text={t("grade", { number: schedule.class?.number || 100 })}
      />
      <Schedule schedule={schedule} role="student" />
    </Section>
  );
};

const SchedulesThisGrade: NextPage<{
  grade: number;
  schedulesThisGrade: Array<ScheduleType>;
}> = ({ grade, schedulesThisGrade }) => {
  const { t } = useTranslation(["admin", "common"]);

  return (
    <>
      <Head>
        <title>
          {t("schedule.grade.tabTitle", { grade })}
          {" - "}
          {t("brand.name", { ns: "common" })}
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
            backGoesTo="/t/admin"
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
}) => {
  const grade = params?.grade;
  const schedulesThisGrade: Array<ScheduleType> = [];

  return {
    props: {
      ...(await serverSideTranslations(locale as string, ["common", "admin"])),
      grade,
      schedulesThisGrade,
    },
  };
};

export default SchedulesThisGrade;
