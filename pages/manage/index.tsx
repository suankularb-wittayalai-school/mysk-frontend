// Imports
import AttendanceSummary from "@/components/attendance/AttendanceSummary";
import PageHeader from "@/components/common/PageHeader";
import ParticipationMetric from "@/components/manage/ParticipationMetric";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import getUserByEmail from "@/utils/backend/account/getUserByEmail";
import getManagementAttendanceSummary from "@/utils/backend/attendance/getManagementAttendanceSummary";
import getParticipationMetrics from "@/utils/backend/manage/getParticipationMetrics";
import { ManagementAttendanceSummary } from "@/utils/types/attendance";
import { CustomPage, LangCode } from "@/utils/types/common";
import { ParticipationMetrics } from "@/utils/types/management";
import { User, UserRole } from "@/utils/types/person";
import {
  Actions,
  Button,
  Columns,
  ContentLayout,
  Header,
  MaterialIcon,
  Section,
  Text,
} from "@suankularb-components/react";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { isWeekend } from "date-fns";
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
 * @param user The currently logged in user.
 */
const ManagePage: CustomPage<{
  attendance: { [key in "today" | "this_week"]: ManagementAttendanceSummary };
  participationMetrics: ParticipationMetrics;
  user: User;
}> = ({ attendance, participationMetrics, user }) => {
  const { t } = useTranslation("manage");
  const { t: tx } = useTranslation("common");

  return (
    <>
      <Head>
        <title>{tx("appName")}</title>
      </Head>
      <PageHeader>
        {user.role === UserRole.management ? tx("appName") : t("title")}
      </PageHeader>
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
                <>
                  <Text type="title-large" element="h3">
                    {t("attendance.summary.today.title")}
                  </Text>
                  {isWeekend(new Date()) && (
                    <Text
                      type="title-small"
                      className="text-on-surface-variant"
                    >
                      {t("attendance.summary.today.subtitle")}
                    </Text>
                  )}
                </>
              }
              summary={attendance.today}
              total={participationMetrics.students_with_classroom}
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
              total={participationMetrics.students_with_classroom}
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
              total={participationMetrics.teachers_with_assigned_subjects}
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

  const session = await getServerSession(req, res, authOptions);
  const { data: user } = await getUserByEmail(supabase, session!.user!.email!);

  const { data: attendance } = await getManagementAttendanceSummary(supabase);
  const { data: participationMetrics } =
    await getParticipationMetrics(supabase);

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "manage",
      ])),
      attendance,
      participationMetrics,
      user,
    },
  };
};

export default ManagePage;
