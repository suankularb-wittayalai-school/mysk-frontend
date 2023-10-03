/**
 * `/admin` TABLE OF CONTENTS
 *
 * Note: `Ctrl` + click to jump to a component.
 *
 * **Reusables**
 * - {@link AdminPanelCard}
 * - {@link AdminCardAction}
 * - {@link StatisticsCard}
 *
 * **Sections**
 * - {@link NewYearNewDataCard}
 * - {@link StatisticsSection}
 * - {@link ManageDataCard}
 * - {@link ImportDataCard}
 * - {@link ManageNewsCard}
 *
 * **Page**
 * - {@link AdminPanelPage}
 */

// External libraries
import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { FC, ReactNode } from "react";

// SK Components
import {
  Card,
  CardContent,
  Columns,
  ContentLayout,
  MaterialIcon,
  Progress,
  Section,
} from "@suankularb-components/react";

// Internal components
// import GenerateClassesDialog from "@/components/admin/GenerateClassesDialog";
// import ImportStudentsDialog from "@/components/admin/ImportStudentsDialog";
// import ImportSubjectsDialog from "@/components/admin/ImportSubjectsDialog";
// import ImportTeachersDialog from "@/components/admin/ImportTeachersDialog";
import PageHeader from "@/components/common/PageHeader";

// Supabase
import { supabase } from "@/utils/supabase-backend";

// Helpers
import { cn } from "@/utils/helpers/className";
import { getCurrentAcademicYear, getLocaleYear } from "@/utils/helpers/date";
import { createTitleStr } from "@/utils/helpers/title";

// Hooks
import useLocale from "@/utils/helpers/useLocale";

// Types
// import { AdminPanelStatistics } from "@/utils/types/admin";
import { CustomPage, LangCode } from "@/utils/types/common";

type AdminPanelStatistics = {
  students: { all: number; onboarded: number };
  teachers: { all: number; onboarded: number };
  classes: { all: number; thisYear: number };
  news: { all: number; thisYear: number };
  lastUpdated: number;
};

/**
 * This page groups content into Cards. This is a template for those Cards.
 *
 * @param children The Card’s content
 * @param accentColor An accent color to denote importance or relation to other Cards.
 * @param icon An large icon to help admins find content quickly.
 * @param className `className` on the content container.
 *
 * @returns A Card.
 */
const AdminPanelCard: FC<{
  children: ReactNode;
  accentColor: "surface-1" | "primary" | "secondary" | "tertiary";
  icon: JSX.Element;
  className?: string;
}> = ({ children, accentColor, icon, className }) => (
  <Card
    appearance="outlined"
    direction="row"
    className="!grid grid-cols-4 gap-4 overflow-hidden sm:!flex sm:gap-6"
  >
    <div
      className={cn([
        {
          "surface-1": "bg-surface-1 text-on-surface",
          primary: "bg-primary-container text-on-primary-container",
          secondary: "bg-secondary-container text-on-secondary-container",
          tertiary: "bg-tertiary-container text-on-tertiary-container",
        }[accentColor],
        "grid p-3 pt-6 sm:place-content-center sm:pt-3 [&_*]:mx-auto",
      ])}
    >
      {icon}
    </div>
    <div className={cn(["col-span-3 grow py-3 pr-3", className])}>
      {children}
    </div>
  </Card>
);

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
      <p className="skc-headline-small">{title}</p>
      <p className="skc-body-medium text-on-surface-variant">{subtitle}</p>
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
 * A small Card that links to other admin pages. Admin Card Actions are placed
 * in groups inside the Section Cards in this page. They are a Card’s CTAs, one
 * could say.
 *
 * @param children The text label.
 * @param onClick he function called when the user interacts with the Admin Card Action.
 * @param href The URL of the page this Admin Card Action Link leads to.
 * @param size `standard` or `large`. `large` should be used sparingly as it denotes importance.
 * @param color The background color.
 * @param icon An icon to help admins find the right link quickly.
 *
 * @returns A Card.
 */
const AdminCardAction: FC<{
  children: ReactNode;
  onClick?: () => any;
  href?: string;
  size?: "standard" | "large";
  color: "surface-variant" | "primary" | "secondary" | "tertiary";
  icon: JSX.Element;
}> = ({ children, onClick, href, size, color, icon }) => {
  return (
    <Card
      appearance="filled"
      direction="row"
      stateLayerEffect
      shadowEffect
      onClick={onClick}
      href={href}
      element={href ? Link : "button"}
      className={cn([
        "items-center !gap-5 !border-0 px-3 py-2",
        size !== "large" && "!rounded-sm",
        {
          "surface-variant":
            "!bg-surface-variant state-layer:!bg-on-surface-variant",
          primary: "!bg-primary-container",
          secondary:
            "!bg-secondary-container state-layer:!bg-on-secondary-container",
          tertiary:
            "!bg-tertiary-container state-layer:!bg-on-tertiary-container",
        }[color],
      ])}
    >
      <h4
        className={cn([
          "grow text-left",
          size === "large" ? "skc-title-large" : "skc-title-medium",
        ])}
      >
        {children}
      </h4>
      <div className={size === "large" ? "[&_.skc-icon]:!text-5xl" : undefined}>
        {icon}
      </div>
    </Card>
  );
};

/**
 * Displays the number of students, teachers, classes, news articles, and other
 * information related to those, grouped into Cards.
 *
 * @param count A number of statistics passed in from `getStaticProps`.
 *
 * @returns A Section.
 */
const StatisticsSection: FC<{ count: AdminPanelStatistics }> = ({ count }) => {
  const locale = useLocale();
  const { t } = useTranslation("admin", { keyPrefix: "statistics" });

  return (
    <Section>
      <Columns columns={4} className="!items-stretch">
        <StatisticsCard
          title={t("student.all", { count: count.students.all })}
          subtitle={t("student.onboarded", { count: count.students.onboarded })}
          progressAlt="Students onboarded"
          progressValue={(count.students.onboarded / count.students.all) * 100}
        />
        <StatisticsCard
          title={t("teacher.all", { count: count.teachers.all })}
          subtitle={t("teacher.onboarded", { count: count.teachers.onboarded })}
          progressAlt="Teachers onboarded"
          progressValue={(count.teachers.onboarded / count.teachers.all) * 100}
        />
        <StatisticsCard
          title={t("class.thisYear", { count: count.classes.thisYear })}
          subtitle={t("class.all", { count: count.classes.all })}
        />
        <StatisticsCard
          title={t("news.thisYear", { count: count.news.thisYear })}
          subtitle={t("news.all", { count: count.news.all })}
        />
      </Columns>
      <p className="text-on-surface-variant">
        {t("lastUpdated", {
          date: new Date(count.lastUpdated).toLocaleString(locale, {
            dateStyle: "medium",
            timeStyle: "medium",
          }),
        })}
      </p>
    </Section>
  );
};

/**
 * Informs the user as to why some tables appear empty (the academic year
 * changed). Should only be shown when at least 1 year-dependent table has 0
 * entries marked for the current academic year.
 *
 * @returns A Card.
 */
const NewYearNewDataCard: FC = () => {
  const locale = useLocale();
  const { t } = useTranslation("admin", {
    keyPrefix: "suggestions.newYearNewData",
  });

  return (
    <AdminPanelCard
      accentColor="tertiary"
      icon={<MaterialIcon icon="temp_preferences_custom" size={48} />}
      className="flex flex-col gap-1 pb-4"
    >
      <h2 className="skc-headline-small">{t("title")}</h2>
      <p>
        {t("desc", { year: getLocaleYear(locale, getCurrentAcademicYear()) })}
      </p>
      <p>
        <a href="mailto:itsolutions@sk.ac.th" className="link">
          {t("contactSupport")}
        </a>
      </p>
    </AdminPanelCard>
  );
};

/**
 * Links to pages for managing data.
 *
 * @returns A Card.
 */
const ManageDataCard: FC = () => {
  const { t } = useTranslation("admin", { keyPrefix: "data.manage" });

  return (
    <AdminPanelCard
      accentColor="surface-1"
      icon={<MaterialIcon icon="database" size={48} />}
      className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr,6fr]"
    >
      {/* Text */}
      <div className="flex flex-col gap-1">
        <h2 className="skc-headline-small">{t("title")}</h2>
        <p>{t("desc")}</p>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 gap-x-3 gap-y-2 sm:grid-cols-2">
        <AdminCardAction
          href="/admin/table/student"
          size="large"
          color="primary"
          icon={<MaterialIcon icon="face" size={40} />}
        >
          {t("action.student")}
        </AdminCardAction>
        <AdminCardAction
          href="/admin/table/teacher"
          size="large"
          color="primary"
          icon={<MaterialIcon icon="support_agent" size={40} />}
        >
          {t("action.teacher")}
        </AdminCardAction>
        <AdminCardAction
          href="/admin/table/subject"
          size="large"
          color="primary"
          icon={<MaterialIcon icon="book" size={40} />}
        >
          {t("action.subject")}
        </AdminCardAction>
        <AdminCardAction
          href="/admin/table/class"
          size="large"
          color="primary"
          icon={<MaterialIcon icon="groups" size={40} />}
        >
          {t("action.class")}
        </AdminCardAction>
      </div>
    </AdminPanelCard>
  );
};

/**
 * A place to import CSVs into the database.
 *
 * @returns A Card.
 */
// const ImportDataCard: FC = () => {
//   const { t } = useTranslation("admin", { keyPrefix: "data.import" });

//   const router = useRouter();

//   // Dialog control
//   const [studentOpen, setStudentOpen] = useState<boolean>(false);
//   const [teacherOpen, setTeacherOpen] = useState<boolean>(false);
//   const [subjectOpen, setSubjectOpen] = useState<boolean>(false);
//   const [classOpen, setClassOpen] = useState<boolean>(false);

//   return (
//     <AdminPanelCard
//       accentColor="surface-1"
//       icon={<MaterialIcon icon="upload" size={48} />}
//       className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr,6fr]"
//     >
//       {/* Text */}
//       <div className="flex flex-col gap-1">
//         <h2 className="skc-headline-small">{t("title")}</h2>
//         <p>{t("desc")}</p>
//       </div>

//       {/* Actions */}
//       <div className="grid grid-cols-1 gap-x-3 gap-y-2 sm:grid-cols-2">
//         {/* Students */}
//         <AdminCardAction
//           onClick={() => setStudentOpen(true)}
//           color="secondary"
//           icon={<MaterialIcon icon="face" />}
//         >
//           {t("action.student")}
//         </AdminCardAction>
//         <ImportStudentsDialog
//           open={studentOpen}
//           onClose={() => setStudentOpen(false)}
//           onSubmit={() => {
//             setStudentOpen(false);
//             router.push("/admin/table/student");
//           }}
//         />

//         {/* Teachers */}
//         <AdminCardAction
//           onClick={() => setTeacherOpen(true)}
//           color="secondary"
//           icon={<MaterialIcon icon="support_agent" />}
//         >
//           {t("action.teacher")}
//         </AdminCardAction>
//         <ImportTeachersDialog
//           open={teacherOpen}
//           onClose={() => setTeacherOpen(false)}
//           onSubmit={() => {
//             setTeacherOpen(false);
//             router.push("/admin/table/teacher");
//           }}
//         />

//         {/* Subjects */}
//         <AdminCardAction
//           onClick={() => setSubjectOpen(true)}
//           color="secondary"
//           icon={<MaterialIcon icon="book" />}
//         >
//           {t("action.subject")}
//         </AdminCardAction>
//         <ImportSubjectsDialog
//           open={subjectOpen}
//           onClose={() => setSubjectOpen(false)}
//           onSubmit={() => {
//             setSubjectOpen(false);
//             router.push("/admin/table/subject");
//           }}
//         />

//         {/* Classes */}
//         <AdminCardAction
//           onClick={() => setClassOpen(true)}
//           color="secondary"
//           icon={<MaterialIcon icon="groups" />}
//         >
//           {t("action.class")}
//         </AdminCardAction>
//         <GenerateClassesDialog
//           open={classOpen}
//           onClose={() => setClassOpen(false)}
//           onSubmit={() => {
//             setClassOpen(false);
//             router.push("/admin/table/class");
//           }}
//         />
//       </div>
//     </AdminPanelCard>
//   );
// };

/**
 * Links to pages for creating and editing News Articles and Forms.
 *
 * @returns A Card.
 */
const ManageNewsCard: FC = () => {
  const { t } = useTranslation("admin", { keyPrefix: "news" });

  return (
    <AdminPanelCard
      accentColor="surface-1"
      icon={<MaterialIcon icon="newspaper" size={48} />}
      className="flex flex-col gap-3"
    >
      <div className="flex flex-col gap-1">
        <h2 className="skc-headline-small">{t("title")}</h2>
        <p>{t("desc")}</p>
      </div>

      <div className="grid grid-cols-1 gap-2 md:grid-cols-3 md:gap-6">
        <AdminCardAction
          href="/admin/news/info/create"
          color="surface-variant"
          icon={<MaterialIcon icon="add_notes" />}
        >
          {t("action.createArticle")}
        </AdminCardAction>
        <AdminCardAction
          href="/admin/news/form/create"
          color="surface-variant"
          icon={<MaterialIcon icon="assignment_add" />}
        >
          {t("action.createForm")}
        </AdminCardAction>
        <AdminCardAction
          href="/admin/news"
          color="surface-variant"
          icon={<MaterialIcon icon="folder_open" />}
        >
          {t("action.manage")}
        </AdminCardAction>
      </div>
    </AdminPanelCard>
  );
};

/**
 * A landing page for admins; contains intelligent suggestions, statistics, and
 * links for managing data and news articles.
 *
 * @returns A Page.
 */
const AdminPanelPage: CustomPage<{
  count: AdminPanelStatistics;
}> = ({ count }) => {
  // Translation
  const { t } = useTranslation(["admin", "common"]);

  return (
    <>
      <Head>
        <title>{createTitleStr(t("title"), t)}</title>
      </Head>
      <PageHeader title={t("title")} parentURL="/account" />
      <ContentLayout>
        {/* Suggestions */}
        <Section className="!gap-3 empty:hidden">
          {/* Show the New Year New Data Card when a table is empty */}
          {(count.students.all === 0 ||
            count.teachers.all === 0 ||
            count.classes.thisYear === 0) && <NewYearNewDataCard />}
        </Section>

        {/* Statistics */}
        <StatisticsSection count={count} />

        {/* Data */}
        <Section className="!gap-3">
          <ManageDataCard />
          {/* <ImportDataCard /> */}
        </Section>

        {/* News */}
        <Section className="!gap-3">
          <ManageNewsCard />
        </Section>
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
