/**
 * `/admin` TABLE OF CONTENTS
 *
 * Note: `Ctrl` + click to jump to a component.
 *
 * **Reusables**
 * - {@link AdminPanelCard}
 * - {@link AdminCardAction}
 *
 * **Sections**
 * - {@link NewYearNewDataCard}
 * - {@link ManageDataCard}
 *
 * **Page**
 * - {@link AdminPanelPage}
 */

// External libraries
import Head from "next/head";
import Link from "next/link";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { FC, ReactNode } from "react";

// SK Components
import {
  Card,
  ContentLayout,
  MaterialIcon,
  Section,
} from "@suankularb-components/react";

// Internal components
import MySKPageHeader from "@/components/common/MySKPageHeader";

// Helpers
import { cn } from "@/utils/helpers/className";
import { createTitleStr } from "@/utils/helpers/title";

// Types
import { CustomPage, LangCode } from "@/utils/types/common";

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
}> = ({ children, accentColor, icon, className }) => {
  return (
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
      <div className={cn(["col-span-3 py-3 pr-3", className])}>{children}</div>
    </Card>
  );
};

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
      onClick={onClick}
      href={href}
      element={Link}
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
          "grow",
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
 * Informs the user as to why some tables appear empty (the academic year
 * changed). Should only be shown when at least 1 year-dependent table has 0
 * entries marked for the current academic year.
 *
 * @returns A Card.
 */
const NewYearNewDataCard: FC = () => {
  return (
    <AdminPanelCard
      accentColor="tertiary"
      icon={<MaterialIcon icon="temp_preferences_custom" size={48} />}
      className="flex flex-col gap-1 pb-4"
    >
      <h2 className="skc-headline-small">New year, new data</h2>
      <p>
        We noticed that some tables for 2023 is empty. Why not get started by
        importing and adding data for this year?
      </p>
      <p>
        <a href="mailto:itsolutions@sk.ac.th" className="link">
          Contact support for more details
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
  return (
    <AdminPanelCard
      accentColor="surface-1"
      icon={<MaterialIcon icon="database" size={48} />}
      className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr,6fr]"
    >
      <div className="flex flex-col gap-1">
        <h2 className="skc-headline-small">View and edit the school’s data</h2>
        <p>
          You have access to the entirety of the school’s data. You can add,
          edit, view, and delete entries.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-x-3 gap-y-2 sm:grid-cols-2">
        <AdminCardAction
          href="/admin/table/student"
          size="large"
          color="primary"
          icon={<MaterialIcon icon="face" size={40} />}
        >
          Students
        </AdminCardAction>
        <AdminCardAction
          href="/admin/table/teacher"
          size="large"
          color="primary"
          icon={<MaterialIcon icon="support_agent" size={40} />}
        >
          Teachers
        </AdminCardAction>
        <AdminCardAction
          href="/admin/table/subject"
          size="large"
          color="primary"
          icon={<MaterialIcon icon="book" size={40} />}
        >
          Subjects
        </AdminCardAction>
        <AdminCardAction
          href="/admin/table/class"
          size="large"
          color="primary"
          icon={<MaterialIcon icon="groups" size={40} />}
        >
          Classes
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
const ImportDataCard: FC = () => {
  return (
    <AdminPanelCard
      accentColor="surface-1"
      icon={<MaterialIcon icon="upload" size={48} />}
      className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr,6fr]"
    >
      <div className="flex flex-col gap-1">
        <h2 className="skc-headline-small">Quickly import data with CSV</h2>
        <p>
          Create a CSV file in the proper format with spreadsheet software like
          Google Sheets or Microsoft Excel, and import it here.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-x-3 gap-y-2 sm:grid-cols-2">
        <AdminCardAction
          href="/admin/table/student"
          color="secondary"
          icon={<MaterialIcon icon="face" />}
        >
          Import students
        </AdminCardAction>
        <AdminCardAction
          href="/admin/table/teacher"
          color="secondary"
          icon={<MaterialIcon icon="support_agent" />}
        >
          Import teachers
        </AdminCardAction>
        <AdminCardAction
          href="/admin/table/subject"
          color="secondary"
          icon={<MaterialIcon icon="book" />}
        >
          Import subjects
        </AdminCardAction>
        <AdminCardAction
          href="/admin/table/class"
          color="secondary"
          icon={<MaterialIcon icon="groups" />}
        >
          Import classes
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
const AdminPanelPage: CustomPage = () => {
  // Translation
  const { t } = useTranslation(["admin", "common"]);

  return (
    <>
      <Head>
        <title>{createTitleStr("Admin panel", t)}</title>
      </Head>
      <MySKPageHeader
        title="Admin panel"
        icon={<MaterialIcon icon="shield_person" />}
      />
      <ContentLayout>
        <Section>
          <NewYearNewDataCard />
        </Section>
        <Section>
          <ManageDataCard />
          <ImportDataCard />
        </Section>
      </ContentLayout>
    </>
  );
};

export const getStaticProps = async ({ locale }: { locale: LangCode }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "admin"])),
  },
});

export default AdminPanelPage;
