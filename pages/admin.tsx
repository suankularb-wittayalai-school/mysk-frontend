// Imports
import PageHeader from "@/components/common/PageHeader";
import cn from "@/utils/helpers/cn";
import getCurrentAcademicYear from "@/utils/helpers/getCurrentAcademicYear";
import useLocale from "@/utils/helpers/useLocale";
import { supabase } from "@/utils/supabase-backend";
import { CustomPage, LangCode } from "@/utils/types/common";
import {
  Actions,
  Button,
  Card,
  CardContent,
  Columns,
  ContentLayout,
  MaterialIcon,
  Progress,
  Section,
  Text,
} from "@suankularb-components/react";
import va from "@vercel/analytics";
import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { FC, forwardRef } from "react";

type AdminPanelStatistics = {
  students: { all: number; onboarded: number };
  teachers: { all: number; onboarded: number };
  classes: { all: number; thisYear: number };
  news: { all: number; thisYear: number };
  lastUpdated: number;
};

/**
 * A Card displaying a main and a related statistic of a table. Only used by
 * {@link StatisticsSection Statistics Section}.
 *
 * @param title The main statistic.
 * @param subtitle A related statistic.
 *
 * @returns A Card.
 */
const StatisticsCard: FC<{
  title: string;
  subtitle: string;
  progressAlt?: string;
  progressValue?: number;
}> = ({ title, subtitle, progressAlt, progressValue }) => (
  <Card
    appearance="filled"
    className="overflow-hidden border-1 border-outline-variant"
  >
    <CardContent className="grow !gap-0.5 !px-4 !py-3">
      <Text type="headline-small" element="p">
        {title}
      </Text>
      <Text type="body-medium" className="text-on-surface-variant" element="p">
        {subtitle}
      </Text>
    </CardContent>
    {progressAlt && progressValue && (
      <div title={`${progressValue.toFixed(2)}%`}>
        <Progress
          appearance="linear"
          alt={progressAlt}
          value={progressValue}
          visible
        />
      </div>
    )}
  </Card>
);

/**
 * A landing page for admins. Displays statistics (including the number of
 * students, teachers, classes, news articles, and other information related to
 * those, grouped into Cards) and a link to Supabase.
 *
 * @param count A number of statistics passed in from `getStaticProps`.
 */
const AdminPanelPage: CustomPage<{
  count: AdminPanelStatistics;
}> = ({ count }) => {
  // Translation
  const locale = useLocale();
  const { t } = useTranslation("admin");
  const { t: tx } = useTranslation("common");

  return (
    <>
      <Head>
        <title>{tx("tabName", { tabName: t("title") })}</title>
      </Head>
      <PageHeader parentURL="/account">{t("title")}</PageHeader>
      <ContentLayout>
        {/* Statistics */}
        <Section>
          <Columns columns={4} className="!items-stretch">
            <StatisticsCard
              title={t("statistics.student.all", { count: count.students.all })}
              subtitle={t("statistics.student.onboarded", {
                count: count.students.onboarded,
              })}
              progressAlt="Students onboarded"
              progressValue={
                (count.students.onboarded / count.students.all) * 100
              }
            />
            <StatisticsCard
              title={t("statistics.teacher.all", { count: count.teachers.all })}
              subtitle={t("statistics.teacher.onboarded", {
                count: count.teachers.onboarded,
              })}
              progressAlt="Teachers onboarded"
              progressValue={
                (count.teachers.onboarded / count.teachers.all) * 100
              }
            />
            <StatisticsCard
              title={t("statistics.class.thisYear", {
                count: count.classes.thisYear,
              })}
              subtitle={t("statistics.class.all", { count: count.classes.all })}
            />
            <StatisticsCard
              title={t("statistics.news.thisYear", {
                count: count.news.thisYear,
              })}
              subtitle={t("statistics.news.all", { count: count.news.all })}
            />
          </Columns>
          <Text
            type="body-medium"
            element="p"
            className="text-on-surface-variant"
          >
            {t("statistics.lastUpdated", {
              date: new Date(count.lastUpdated).toLocaleString(locale, {
                dateStyle: "medium",
                timeStyle: "medium",
              }),
            })}
          </Text>
        </Section>

        <Card
          appearance="filled"
          className={cn(`mx-4 gap-4 !rounded-xl !bg-primary-container p-4 
            sm:mx-0 md:!flex-row md:!rounded-full`)}
        >
          <Text
            type="headline-medium"
            element="h2"
            className="mx-2 grow md:mr-0"
          >
            {t("supabase.title")}
          </Text>
          <Actions align="full">
            <Button
              appearance="filled"
              icon={<MaterialIcon icon="bolt" />}
              href={`https://supabase.com/dashboard/project/${
                // Find the subdomain inside the Supabase URL
                // (The subdomain is the project Reference ID, which is used in
                // this URL)
                new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname.split(
                  ".",
                )[0]
              }/editor`}
              // eslint-disable-next-line react/display-name
              element={forwardRef((props, ref) => (
                <a
                  {...props}
                  ref={ref}
                  onClick={() => va.track("Open Supabase Table Editor")}
                  target="_blank"
                  rel="noreferrer"
                />
              ))}
            >
              {t("supabase.action.open")}
            </Button>
          </Actions>
        </Card>
      </ContentLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  // Statistics

  // Students
  const { count: allStudents } = await supabase
    .from("students")
    .select("id", { count: "exact", head: true });

  // Teachers
  const { count: allTeachers } = await supabase
    .from("teachers")
    .select("id", { count: "exact", head: true });

  // Onboarded
  const { count: onboardedStudents } = await supabase
    .from("users")
    .select("id", { count: "exact", head: true })
    .match({ role: "student", onboarded: true });
  const { count: onboardedTeachers } = await supabase
    .from("users")
    .select("id", { count: "exact", head: true })
    .match({ role: "teacher", onboarded: true });

  // Classes
  const { count: allClasses } = await supabase
    .from("classrooms")
    .select("id", { count: "exact", head: true });
  const { count: classesThisYear } = await supabase
    .from("classrooms")
    .select("id", { count: "exact", head: true })
    .match({ year: getCurrentAcademicYear() });

  // News
  const { count: allNews } = await supabase
    .from("news")
    .select("id", { count: "exact", head: true });
  const { count: newsThisYear } = await supabase
    .from("news")
    .select("id", { count: "exact", head: true })
    .gte("created_at", `${new Date().getFullYear()}-01-01`);

  // Put the statistics in 1 constant to pass
  const count = {
    students: { all: allStudents, onboarded: onboardedStudents },
    teachers: { all: allTeachers, onboarded: onboardedTeachers },
    classes: { all: allClasses, thisYear: classesThisYear },
    news: { all: allNews, thisYear: newsThisYear },
    lastUpdated: new Date().getTime(),
  };

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "admin",
      ])),
      count,
    },
    revalidate: 10,
  };
};

export default AdminPanelPage;
