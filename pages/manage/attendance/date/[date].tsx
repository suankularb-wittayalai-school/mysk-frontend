// Imports
import { SelectorType } from "@/components/attendance/AttendanceViewSelector";
import ClassAttendanceLayout from "@/components/attendance/ClassAttendanceLayout";
import WeekChart from "@/components/attendance/WeekChart";
import PageHeader from "@/components/common/PageHeader";
import AttendanceClassesList from "@/components/manage/AttendanceClassesList";
import AttendanceClassesListItem from "@/components/manage/AttendanceClassesListItem";
import MySKLogo from "@/public/images/brand/mysk-light.svg";
import getClassroomAttendances from "@/utils/backend/attendance/getClassroomAttendances";
import getWeekAttendance from "@/utils/backend/attendance/getWeekAttendance";
import cn from "@/utils/helpers/cn";
import { YYYYMMDDRegex } from "@/utils/patterns";
import {
  ClassroomAttendance,
  ManagementAttendanceSummary,
} from "@/utils/types/attendance";
import { CustomPage, LangCode } from "@/utils/types/common";
import { Card, Columns, Text } from "@suankularb-components/react";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { isFuture, isWeekend, setDay } from "date-fns";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import Image from "next/image";
import { mapValues } from "radash";

/**
 * Date Attendance Overview page displays an overview of the school’s Attendance
 * at specific date.
 *
 * @param date The date to display Attendance of, in YYYY-MM-DD format.
 * @param week Attendance summary of the week that the date is in.
 * @param attendances Attendance of each Classroom.
 */
const DateAttendanceOverviewPage: CustomPage<{
  date: string;
  week: ManagementAttendanceSummary[];
  attendances: ClassroomAttendance[];
}> = ({ date, week, attendances }) => {
  const { t } = useTranslation("manage", { keyPrefix: "attendance" });
  const { t: tx } = useTranslation("common");

  /**
   * The total number of students in each Attendance status.
   */
  const totals = attendances.reduce(
    (accumulate, { summary }) =>
      mapValues(
        accumulate,
        (value, key) => value + summary[key],
      ) as ManagementAttendanceSummary,
    { presence: 0, late: 0, absence: 0 },
  );

  return (
    <>
      <Head>
        <title>{tx("tabName", { tabName: t("title") })}</title>
      </Head>
      <PageHeader parentURL="/manage" className="print:!hidden">
        {t("title")}
      </PageHeader>
      <ClassAttendanceLayout type={SelectorType.management} date={date}>
        {/* Print header */}
        <div
          className={cn(`hidden flex-row items-center justify-between print:mx-4
            print:flex`)}
        >
          <div className="space-y-1">
            <Text type="headline-medium" element="h1">
              {t("print.title", { date: new Date(date) })}
            </Text>
            <Text
              type="title-medium"
              element="p"
              className="text-on-surface-variant"
            >
              {t("print.subtitle")}
            </Text>
          </div>
          <Image src={MySKLogo} width={96} height={96} priority alt="" />
        </div>

        {/* Summary */}
        <Columns
          columns={2}
          className="!mb-10 !gap-y-6 print:!mx-4 print:!grid-cols-5 md:!grid-cols-5"
        >
          {/* Chart */}
          <Card
            appearance="outlined"
            className={cn(`light aspect-[2] px-3 py-2 print:col-span-3
              print:!bg-white md:col-span-3`)}
          >
            <WeekChart week={week} className="rounded-md" />
          </Card>

          {/* Text */}
          <Text
            type="headline-medium"
            element="p"
            className="grid print:col-span-2 md:col-span-2"
          >
            {Object.entries(totals).map(([key, count]) => (
              <span key={key}>{t(`chart.summary.${key}`, { count })}</span>
            ))}
          </Text>
        </Columns>

        {/* Classes breakdown */}
        <AttendanceClassesList>
          {attendances.map((attendance) => (
            <AttendanceClassesListItem
              key={attendance.classroom.id}
              attendance={attendance}
            />
          ))}
        </AttendanceClassesList>
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
  const { date } = params as { date: string };
  if (
    !YYYYMMDDRegex.test(date) ||
    isFuture(new Date(date)) ||
    isWeekend(new Date(date))
  )
    return { notFound: true };

  const supabase = createPagesServerClient({
    req: req as NextApiRequest,
    res: res as NextApiResponse,
  });

  const [week, attendances] = await Promise.all([
    (await getWeekAttendance(supabase, setDay(new Date(date), 1))).data,
    (await getClassroomAttendances(supabase, date)).data,
  ]);

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "attendance",
        "manage",
      ])),
      date,
      week,
      attendances,
    },
  };
};

export default DateAttendanceOverviewPage;
