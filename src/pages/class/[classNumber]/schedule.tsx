// Modules
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// SK Components
import {
  MaterialIcon,
  RegularLayout,
  Section,
  Title,
} from "@suankularb-components/react";

// Components
import Schedule from "@components/schedule/Schedule";

// Backend
import { getClassIDFromNumber } from "@utils/backend/classroom/classroom";
import { getSchedule } from "@utils/backend/schedule/schedule";
import { getSubjectList } from "@utils/backend/subject/roomSubject";

// Types
import { LangCode } from "@utils/types/common";
import { Schedule as ScheduleType } from "@utils/types/schedule";
import { SubjectListItem } from "@utils/types/subject";

// Helpers
import { createTitleStr } from "@utils/helpers/title";
import SubjectListTable from "@components/tables/SubjectListTable";

const StudentSchedule: NextPage<{
  classNumber: number;
  schedule: ScheduleType;
  subjectList: SubjectListItem[];
}> = ({ classNumber, schedule, subjectList }) => {
  const { t } = useTranslation(["schedule", "common"]);

  return (
    <>
      <Head>
        <title>
          {createTitleStr(
            t("title.studentWithClass", { number: classNumber }),
            t
          )}
        </title>
      </Head>
      <RegularLayout
        Title={
          <Title
            name={{
              title: t("title.student"),
              subtitle: t("class", { ns: "common", number: classNumber }),
            }}
            pageIcon={<MaterialIcon icon="dashboard" />}
            backGoesTo="/s/home"
            LinkElement={Link}
          />
        }
      >
        <Section>
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
  params,
}) => {
  const classNumber = Number(params?.classNumber);
  if (!classNumber) return { notFound: true };

  const { data: classID, error } = await getClassIDFromNumber(
    Number(params?.classNumber)
  );
  if (error) return { notFound: true };

  const schedule: ScheduleType = await getSchedule(
    "student",
    classID as number
  );
  const { data: subjectList } = await getSubjectList(classID as number);

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "schedule",
      ])),
      classNumber,
      schedule,
      subjectList,
    },
  };
};

export default StudentSchedule;
