// Imports
import ClassAttendanceLayout from "@/components/attendance/ClassAttendanceLayout";
import PageHeader from "@/components/common/PageHeader";
import { SelectorType } from "@/utils/helpers/attendance/useAttendanceView";
import cn from "@/utils/helpers/cn";
import { Classroom } from "@/utils/types/classroom";
import { CustomPage, LangCode } from "@/utils/types/common";
import { Text } from "@suankularb-components/react";
import { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import Balancer from "react-wrap-balancer";

/**
 * Week Attendance page displays Attendance of a Classroom of a specific week.
 */
const WeekAttendancePage: CustomPage<{
  date: string;
  classroom: Pick<Classroom, "id" | "number">;
}> = ({ date, classroom }) => {
  const { t } = useTranslation("attendance");
  const { t: tx } = useTranslation("common");

  return (
    <>
      <Head>
        <title>
          {tx("tabName", {
            tabName: t("title", { classNumber: classroom.number }),
          })}
        </title>
      </Head>
      <PageHeader parentURL="/classes">
        {t("title", { classNumber: classroom.number })}
      </PageHeader>
      <ClassAttendanceLayout type={SelectorType.classroom} date={date}>
        <div className="py-20">
          <div
            className={cn(`mx-auto flex max-w-sm flex-col items-center gap-2
              text-center`)}
          >
            <Text type="title-large" className="!font-bold text-secondary">
              <Balancer>{t("thisWeek.todo.title")}</Balancer>
            </Text>
            <Text type="body-large">
              <Balancer>{t("thisWeek.todo.subtitle")}</Balancer>
            </Text>
          </div>
        </div>
      </ClassAttendanceLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  params,
  req,
  res,
}) => {
  const { classNumber, date } = params as { [key: string]: string };

  const classroom = { id: "", number: Number(classNumber) };

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "attendance",
      ])),
      date,
      classroom,
    },
  };
};

export default WeekAttendancePage;
