// Imports
import AttendanceViewSelector, { AttendanceView, SelectorType } from "@/components/attendance/AttendanceViewSelector";
import GradesBreakdownChart from "@/components/attendance/GradesBreakdownChart";
import SchoolWideAttendanceTable from "@/components/attendance/SchoolWideAttendanceTable";
import PageHeader from "@/components/common/PageHeader";
import MySKLogo from "@/public/images/brand/mysk-light.svg";
import getClassroomAttendances from "@/utils/backend/attendance/getClassroomAttendances";
import getWeekAttendance from "@/utils/backend/attendance/getWeekAttendance";
import cn from "@/utils/helpers/cn";
import useLocale from "@/utils/helpers/useLocale";
import { YYYYMMDDRegex } from "@/utils/patterns";
import {
  AttendanceEvent,
  ClassroomAttendance,
  ManagementAttendanceSummary,
} from "@/utils/types/attendance";
import { CustomPage, LangCode } from "@/utils/types/common";
import {
  Card,
  CardContent,
  Columns,
  ContentLayout,
  Section,
  Text,
} from "@suankularb-components/react";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { isFuture, isWeekend, setDay } from "date-fns";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { Trans, useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import Image from "next/image";
import { mapValues } from "radash";

/**
 * The Attendance Summary for Management page displays the Attendance of all
 * Classrooms in the school on a specific date.
 *
 * @param date The date to display Attendance of, in YYYY-MM-DD format.
 * @param attendances The Attendance of all Classrooms in the school, by grade and by Classroom.
 */
const AttendanceSummaryForManagementPage: CustomPage<{
  date: string;
  attendances: {
    grades: { [key in AttendanceEvent]: ManagementAttendanceSummary }[];
    classrooms: ClassroomAttendance[];
  };
}> = ({ date, attendances: { grades, classrooms } }) => {
  const { t } = useTranslation("manage", { keyPrefix: "attendance" });
  const { t: tx } = useTranslation("common");

  /**
   * The total number of students in each Attendance status.
   */
  const totals = classrooms.reduce(
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
      <ContentLayout>
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

        <Columns columns={2} className="!items-stretch print:!grid-cols-2">
          <Card
            appearance="outlined"
            className="!contents !rounded-lg print:!contents sm:!flex sm:print:!contents"
          >
            <CardContent className="print:!contents">
              <GradesBreakdownChart grades={grades} />
            </CardContent>
          </Card>

          <Section className="print:!hidden">
            {/* TODO */}
            <div aria-hidden className="hidden grow sm:block" />
            <Text type="body-medium">
              <Trans
                i18nKey="attendance.chart.note"
                ns="manage"
                components={{ b: <strong /> }}
              />
            </Text>
            <div className="grid grid-cols-2 gap-3">
              <Card
                appearance="outlined"
                className="!gap-2 !rounded-lg !bg-surface-1 !p-3 !pt-2"
              >
                <Text type="headline-medium">
                  {t("chart.summary.presence", {
                    count: totals.presence + totals.late,
                  })}
                </Text>
                <div className="grid gap-2 *:rounded-sm *:bg-surface *:px-4 *:py-1.5 sm:grid-cols-2">
                  <Text type="button" element="div">
                    {t("chart.summary.onTime", { count: totals.presence })}
                  </Text>
                  <Text type="button" element="div">
                    {t("chart.summary.late", { count: totals.late })}
                  </Text>
                </div>
              </Card>
              <Card
                appearance="outlined"
                className="!rounded-lg !bg-surface-1 !px-3 !py-2"
              >
                <Text type="headline-medium">
                  {t("chart.summary.absence", { count: totals.absence })}
                </Text>
              </Card>
            </div>
          </Section>
        </Columns>

        {/* Classes breakdown */}
        <SchoolWideAttendanceTable
          attendances={classrooms}
          className="mx-4 -mt-2 sm:mx-0"
        />
      </ContentLayout>
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

export default AttendanceSummaryForManagementPage;
