import AttendanceDatePickerDialog from "@/components/attendance/AttendanceDatePickerDialog";
import {
  AttendanceView,
  SelectorType,
} from "@/components/attendance/AttendanceViewSelector";
import GradesBreakdownChart from "@/components/attendance/GradesBreakdownChart";
import SchoolWideAttendanceTable from "@/components/attendance/SchoolWideAttendanceTable";
import PageHeader from "@/components/common/PageHeader";
import MySKLogo from "@/public/icons/petals-light.svg";
import getClassroomAttendances from "@/utils/backend/attendance/getClassroomAttendances";
import isValidAttendanceDate from "@/utils/helpers/attendance/isValidAttendanceDate";
import cn from "@/utils/helpers/cn";
import { supabase } from "@/utils/supabase-backend";
import {
  AttendanceEvent,
  ClassroomAttendance,
  ManagementAttendanceSummary,
} from "@/utils/types/attendance";
import { CustomPage, LangCode } from "@/utils/types/common";
import {
  Actions,
  Button,
  Card,
  CardContent,
  Columns,
  ContentLayout,
  MaterialIcon,
  Section,
  Text,
} from "@suankularb-components/react";
import { GetStaticPaths, GetStaticProps } from "next";
import { Trans, useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import Image from "next/image";
import router from "next/router";
import { mapValues } from "radash";
import { useState } from "react";

/**
 * The Attendance Overview page displays the Attendance of all Classrooms in the
 * school on a specific date.
 *
 * @param date The date to display Attendance of, in YYYY-MM-DD format.
 * @param attendances The Attendance of all Classrooms in the school, by grade and by Classroom.
 */
const AttendanceOverviewPage: CustomPage<{
  date: string;
  attendances: {
    grades: { [key in AttendanceEvent]: ManagementAttendanceSummary }[];
    classrooms: ClassroomAttendance[];
  };
}> = ({ date, attendances: { grades, classrooms } }) => {
  const { t } = useTranslation("manage", { keyPrefix: "attendance" });
  const { t: ta } = useTranslation("attendance");
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

  const [datePickerOpen, setDatePickerOpen] = useState(false);

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
            className={cn(`!contents !rounded-lg sm:!flex print:!contents
              sm:print:!contents`)}
          >
            <CardContent className="print:!contents">
              <GradesBreakdownChart grades={grades} />
            </CardContent>
          </Card>

          <Section className="print:!hidden">
            <Actions>
              {/* Date picker */}
              <Button
                appearance="tonal"
                icon={<MaterialIcon icon="event" />}
                onClick={() => setDatePickerOpen(true)}
              >
                {ta("viewSelector.action.date.date", { date: new Date(date) })}
              </Button>
              <AttendanceDatePickerDialog
                open={datePickerOpen}
                view={AttendanceView.date}
                type={SelectorType.management}
                onClose={() => setDatePickerOpen(false)}
                onSubmit={({ date }) => {
                  setDatePickerOpen(false);
                  router.push(`/manage/attendance/${date}`);
                }}
              />
            </Actions>

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
                className="!gap-2 !rounded-lg !bg-surface-container !p-3 !pt-2"
              >
                <Text type="headline-medium">
                  {t("chart.summary.presence", {
                    count: totals.presence + totals.late,
                  })}
                </Text>

                <div className="flex flex-row gap-1">
                  <Text type="title-small" className="grow">
                    {t("chart.summary.onTime", { count: totals.presence })}
                  </Text>
                  <Text type="title-small">
                    {t("chart.summary.late", { count: totals.late })}
                  </Text>
                </div>
                <div className="flex h-1 flex-row gap-1 overflow-hidden rounded-full *:rounded-full">
                  <div className="grow bg-primary" />
                  <div
                    style={{
                      width: `${(totals.late / (totals.presence + totals.late)) * 100}%`,
                    }}
                    className="bg-tertiary"
                  />
                </div>
              </Card>
              <Card
                appearance="outlined"
                className="!rounded-lg !bg-surface-container !px-3 !py-2"
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

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
  const { date } = params as { date: string };
  if (!isValidAttendanceDate(date)) return { notFound: true };

  const { data: attendances } = await getClassroomAttendances(supabase, date);

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "attendance",
        "manage",
      ])),
      date,
      attendances,
    },
    revalidate: 10,
  };
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: "blocking",
});

export default AttendanceOverviewPage;
