import PageHeader from "@/components/common/PageHeader";
import ParticipationMetric from "@/components/manage/ParticipationMetric";
import getParticipationMetrics from "@/utils/backend/manage/getParticipationMetrics";
import { supabase } from "@/utils/supabase-backend";
import { CustomPage, LangCode } from "@/utils/types/common";
import { ParticipationMetrics } from "@/utils/types/management";
import { ContentLayout, Section } from "@suankularb-components/react";
import { GetStaticProps } from "next";
import useTranslation from "next-translate/useTranslation";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";

/**
 * Metrics on MySK participation.
 *
 * @param metrics The Participation Metrics.
 */
const ParticipationPage: CustomPage<{
  metrics: ParticipationMetrics;
}> = ({ metrics }) => {
  const { t } = useTranslation("manage/participation");
  const { t: tx } = useTranslation("common");

  return (
    <>
      <Head>
        <title>{tx("tabName", { tabName: t("title") })}</title>
      </Head>
      <PageHeader parentURL="/manage">{t("title")}</PageHeader>
      <ContentLayout className="*:!grid *:grid-cols-6 *:gap-6">
        <Section className="col-span-4 col-start-2 !gap-y-2">
          <ParticipationMetric
            id="awareness"
            count={metrics.onboarded_users}
            total={metrics.total_users}
          />
          <ParticipationMetric
            id="teacherParticipation"
            count={metrics.teachers_with_schedule}
            total={metrics.teachers_with_assigned_subjects}
          />
          <ParticipationMetric
            id="studentParticipation"
            count={metrics.students_with_additional_account_data}
            total={metrics.students_with_classroom}
          />
        </Section>
      </ContentLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const { data: metrics } = await getParticipationMetrics(supabase);

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "manage",
      ])),
      metrics,
    },
    revalidate: 10,
  };
};

export default ParticipationPage;
