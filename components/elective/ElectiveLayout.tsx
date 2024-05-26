import PageHeader from "@/components/common/PageHeader";
import LandingBlobs from "@/components/landing/LandingBlobs";
import cn from "@/utils/helpers/cn";
import getHomeURLofRole from "@/utils/helpers/person/getHomeURLofRole";
import { Breakpoint } from "@/utils/helpers/useBreakpoint";
import { StylableFC } from "@/utils/types/common";
import { UserRole } from "@/utils/types/person";
import { ContentLayout } from "@suankularb-components/react";
import { useTranslation } from "next-i18next";
import Head from "next/head";
import { ReactNode } from "react";

export const DIALOG_BREAKPOINTS = [Breakpoint.base, Breakpoint.sm];

/**
 * A Layout for Elective pages. Handles layout, background, and other
 * adjustments.
 *
 * @param children The content of the page. Should be 2 `<section>`s, the first for the list and the second for the main content.
 * @param role The role of the user: Student, Teacher, or Management.
 */
const ElectiveLayout: StylableFC<{
  children: ReactNode;
  role: UserRole;
}> = ({ children, role, style, className }) => {
  const { t } = useTranslation("elective");
  const { t: tx } = useTranslation("common");

  return (
    <>
      <Head>
        <title>
          {tx("tabName", { tabName: t("title", { context: role }) })}
        </title>
      </Head>

      {/* Background */}
      <div
        className={cn(`fixed inset-0 bottom-auto -z-10 hidden h-screen
          overflow-hidden sm:block`)}
      >
        <LandingBlobs className="inset-0" />
      </div>

      {/* Content */}
      <PageHeader parentURL={getHomeURLofRole(role)}>
        {t("title", { context: role })}
      </PageHeader>
      <ContentLayout
        style={style}
        className={cn(
          `grow *:h-full *:!gap-6 sm:*:!grid md:*:grid-cols-[5fr,7fr]
          [&>*>:last-child>*]:!rounded-xl
          [&>*>:last-child>*]:bg-surface-bright`,
          className,
        )}
      >
        {children}

        <style jsx global>{`
          body {
            background-color: var(--surface-container);
          }

          .skc-root-layout {
            display: flex;
            flex-direction: column;
            height: 100dvh;
          }

          @media only screen and (min-width: 600px) {
            .skc-nav-bar::before {
              background-color: transparent !important;
            }

            .skc-page-header__blobs {
              display: none !important;
            }
          }
        `}</style>
      </ContentLayout>
    </>
  );
};

export default ElectiveLayout;
