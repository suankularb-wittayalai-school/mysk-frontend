// Modules
import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";

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
import Schedule from "@components/Schedule";

// Types
import { Schedule as ScheduleType } from "@utils/types/schedule";
import { useRouter } from "next/router";
import { Trans } from "next-i18next";

const ScheduleSection = ({
  schedule,
}: {
  schedule: ScheduleType;
}): JSX.Element => {
  const locale = useRouter().locale == "en-US" ? "en-US" : "th";

  return (
    <Section>
      <Header
        icon={<MaterialIcon icon="subdirectory_arrow_right" allowCustomSize />}
        text={schedule.class.name[locale] || schedule.class.name.th}
      />
      <Schedule schedule={schedule} role="student" />
    </Section>
  );
};

const SchedulesThisGrade: NextPage<{
  grade: number;
  schedulesThisGrade: Array<ScheduleType>;
}> = ({ grade, schedulesThisGrade }) => (
  <RegularLayout
    Title={<Title
      name={{
        title: "Schedule list",
        // TODO: Uncomment this when `subtitle` accepts Element
        // subtitle: (
        //   <Trans i18nKey="schedule.gradeItem" ns="admin">
        //     M.{{ grade }}
        //   </Trans>
        // ),
      }}
      pageIcon={<MaterialIcon icon="dashboard" />}
      backGoesTo="/t/admin"
      LinkElement={Link} />}
  >
    {schedulesThisGrade.map((schedule) => (
      <ScheduleSection key={schedule.class.id} schedule={schedule} />
    ))}
  </RegularLayout>
);

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  params,
}) => {
  const grade = params?.grade;
  const schedulesThisGrade: Array<ScheduleType> = [
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
