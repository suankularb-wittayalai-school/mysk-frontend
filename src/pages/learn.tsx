// External libraries
import { GetServerSideProps, NextPage } from "next";
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
import Schedule from "@components/schedule/Schedule";
import SubjectListTable from "@components/tables/SubjectListTable";

// Backend
import { getClassIDFromReq } from "@utils/backend/classroom/classroom";
import { getSchedule } from "@utils/backend/schedule/schedule";
import { getSubjectList } from "@utils/backend/subject/roomSubject";

// Types
import { LangCode } from "@utils/types/common";
import { Schedule as ScheduleType } from "@utils/types/schedule";
import { SubjectListItem } from "@utils/types/subject";

// Helpers
import { createTitleStr } from "@utils/helpers/title";

const Learn: NextPage<{
  schedule: ScheduleType;
  subjectList: SubjectListItem[];
}> = ({ schedule, subjectList }) => {
  const { t } = useTranslation(["learn", "common"]);

  return (
    <>
      <Head>
        <title>{createTitleStr(t("title"), t)}</title>
      </Head>
      <RegularLayout
        Title={
          <Title
            name={{ title: t("title") }}
            pageIcon={<MaterialIcon icon="school" />}
            backGoesTo="/s/home"
            LinkElement={Link}
          />
        }
      >
        <Section>
          <Header
            icon={<MaterialIcon icon="dashboard" allowCustomSize />}
            text={t("schedule")}
          />
          <Schedule schedule={schedule} role="student" />
        </Section>
        <Section>
          <SubjectListTable subjectList={subjectList} />
        </Section>
      </RegularLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  req,
}) => {
  const { data: classID } = await getClassIDFromReq(req);
  const schedule: ScheduleType = await getSchedule(
    "student",
    classID as number
  );
  const { data: subjectList } = await getSubjectList(classID as number);

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "learn",
        "schedule",
      ])),
      schedule,
      subjectList,
    },
  };
};

export default Learn;
