// Imports
import AttendanceSummary from "@/components/attendance/AttendanceSummary";
import PageHeader from "@/components/common/PageHeader";
import ParticipationMetric from "@/components/manage/ParticipationMetric";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import getUserByEmail from "@/utils/backend/account/getUserByEmail";
import permitted from "@/utils/helpers/permitted";
import { ManagementAttendanceSummary } from "@/utils/types/attendance";
import { CustomPage, LangCode } from "@/utils/types/common";
import { ParticipationMetrics } from "@/utils/types/management";
import { UserPermissionKey, UserRole } from "@/utils/types/person";
import {
  Columns,
  ContentLayout,
  Header,
  Section,
  Text,
} from "@suankularb-components/react";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";

/**
 * Management’s counterpart to Learn, where the user can view statistics about
 * the school. This page is only accessible to users with the
 * `can_see_management` permission.
 *
 * Management users see this page as their Home. Other users with the permission
 * can access this page from their Account page.
 * 
 * @param attendance The attendance statistics for today and this week.
 * @param participationMetrics Metrics on MySK participation.
 */
const ManagePage: CustomPage<{
  attendance: { [key in "today" | "this_week"]: ManagementAttendanceSummary };
  participationMetrics: ParticipationMetrics;
}> = ({ attendance, participationMetrics }) => {
  const { t } = useTranslation("manage");
  const { t: tx } = useTranslation("common");

  return (
    <>
      <Head>
        <title>{tx("tabName", { tabName: "Manage" })}</title>
      </Head>
      <PageHeader>{tx("appName")}</PageHeader>
      <ContentLayout>
        {/* Attendance */}
        <Section>
          <Header>{t("attendance.title")}</Header>
          <Text type="body-medium" className="!-mt-1">
            {t("attendance.description")}
          </Text>
          <Columns columns={2} className="!grid-cols-1 md:!grid-cols-2">
            <AttendanceSummary
              title={
                <Text type="title-large" element="h3">
                  {t("attendance.summary.today.title")}
                </Text>
              }
              summary={attendance.today}
            />
            <AttendanceSummary
              title={
                <>
                  <Text type="title-large" element="h3">
                    {t("attendance.summary.thisWeek.title")}
                  </Text>
                  <Text type="title-small" className="text-on-surface-variant">
                    {t("attendance.summary.thisWeek.subtitle")}
                  </Text>
                </>
              }
              summary={attendance.this_week}
            />
          </Columns>
        </Section>

        {/* Participation */}
        <Columns columns={6}>
          <Section className="col-span-2 !gap-4 sm:col-span-4 md:col-start-2">
            <Header>{t("participation.title")}</Header>
            <Text type="body-medium" className="!-mt-2">
              {t("participation.description")}
            </Text>

            <ParticipationMetric
              id="onboarding"
              count={participationMetrics.onboarded_users}
              total={participationMetrics.total_users}
            />
            <ParticipationMetric
              id="teacherSchedule"
              count={participationMetrics.teachers_with_schedule}
              total={participationMetrics.total_teachers}
            />
            <ParticipationMetric
              id="studentData"
              count={participationMetrics.students_with_additional_account_data}
              total={participationMetrics.students_with_classroom}
            />
          </Section>
        </Columns>
      </ContentLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  req,
  res,
}) => {
  const supabase = createPagesServerClient({
    req: req as NextApiRequest,
    res: res as NextApiResponse,
  });

  // Check if the user is logged in and has the correct permissions.
  // If not, return a 404.
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user) return { notFound: true };

  const { data: user } = await getUserByEmail(supabase, session.user.email!);
  if (
    !(
      // The user is a management user.
      (
        user?.role === UserRole.management ||
        // The user has the `can_see_management` permission.
        permitted(user!, UserPermissionKey.can_see_management)
      )
    )
  )
    return { notFound: true };

  const attendance = {
    today: { presence: 2436, late: 356, absence: 38 },
    this_week: { presence: 2785, late: 7, absence: 38 },
  };

  const participationMetrics = {
    onboarded_users: 1498,
    total_users: 2654,
    total_teachers: 248,
    teachers_with_schedule: 2,
    students_with_additional_account_data: 1376,
    students_with_classroom: 2408,
  };

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "manage",
      ])),
      attendance,
      participationMetrics,
    },
  };
};

export default ManagePage;
