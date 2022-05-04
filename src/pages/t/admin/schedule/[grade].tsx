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
import { StudentSchedule } from "@utils/types/schedule";

const ScheduleSection = ({
  schedule,
}: {
  schedule: StudentSchedule;
}): JSX.Element => {
  const locale = useRouter().locale as "en-US" | "th";

  return (
    <Section>
      <Header
        icon={<MaterialIcon icon="subdirectory_arrow_right" allowCustomSize />}
        text={
          // FIXME: Schedule class should be required
          // Temporary solution, awaiting response from @JimmyTempest
          schedule.class
            ? schedule.class.name[locale] || schedule.class.name.th
            : ""
        }
      />
      <Schedule schedule={schedule} role="student" />
    </Section>
  );
};

const SchedulesThisGrade: NextPage<{
  grade: number;
  schedulesThisGrade: Array<StudentSchedule>;
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
  const schedulesThisGrade: Array<StudentSchedule> = [
    {
      class: {
        id: 501,
        name: {
          "en-US": "M.501",
          th: "ม.501",
        },
      },
      content: [
        { day: 1, content: [] },
        { day: 2, content: [] },
        { day: 3, content: [] },
        { day: 4, content: [] },
        { day: 5, content: [] },
      ],
    },
    {
      class: {
        id: 502,
        name: {
          "en-US": "M.502",
          th: "ม.502",
        },
      },
      content: [
        { day: 1, content: [] },
        { day: 2, content: [] },
        { day: 3, content: [] },
        { day: 4, content: [] },
        { day: 5, content: [] },
      ],
    },
    {
      class: {
        id: 503,
        name: {
          "en-US": "M.503",
          th: "ม.503",
        },
      },
      content: [
        { day: 1, content: [] },
        { day: 2, content: [] },
        { day: 3, content: [] },
        { day: 4, content: [] },
        { day: 5, content: [] },
      ],
    },
  ];

  return {
    props: {
      ...(await serverSideTranslations(locale as string, ["common", "admin"])),
      grade,
      schedulesThisGrade,
    },
  };
};

export default SchedulesThisGrade;
