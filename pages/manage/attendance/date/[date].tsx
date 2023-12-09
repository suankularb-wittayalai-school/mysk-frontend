// Imports
import { SelectorType } from "@/components/attendance/AttendanceViewSelector";
import ClassAttendanceLayout from "@/components/attendance/ClassAttendanceLayout";
import PageHeader from "@/components/common/PageHeader";
import { YYYYMMDDRegex } from "@/utils/patterns";
import { CustomPage, LangCode } from "@/utils/types/common";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { isFuture, isWeekend } from "date-fns";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";

/**
 * Date Attendance Overview page displays an overview of the school’s Attendance
 * at specific date.
 *
 * @param date The date to display Attendance of, in YYYY-MM-DD format.
 */
const DateAttendanceOverviewPage: CustomPage<{ date: string }> = ({ date }) => {
  const { t } = useTranslation("attendance");
  const { t: tx } = useTranslation("common");

  return (
    <>
      <Head>
        <title>{tx("tabName", { tabName: t("title") })}</title>
      </Head>
      <PageHeader parentURL="/classes">{t("title")}</PageHeader>
      <ClassAttendanceLayout type={SelectorType.management} date={date}>
        <p>TODO</p>
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

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "attendance",
      ])),
      date,
    },
  };
};

export default DateAttendanceOverviewPage;
