// Imports
import JoinLayout from "@/components/club/join/JoinLayout";
import { Club } from "@/utils/types/club";
import Head from "next/head";
import { FC, ReactNode } from "react";

/**
 * Join Layout for pages that involve clubs, i.e. Club Join Request, Waiting
 * Approval, etc.
 *
 * @param children The content.
 * @param club A Club instance, used for background and accent color.
 * @param pageScheme The color scheme appropriate for the background, should be calculated on the server and passed in.
 * @param tabName The text to display on the browser tab.
 *
 * @returns A Join Layout.
 */
const ClubJoinLayout: FC<{
  children: ReactNode;
  club: Club;
  pageScheme?: "light" | "dark";
  tabName?: string;
}> = ({ children, club, pageScheme, tabName }) => (
  <>
    <Head>
      <meta
        name="theme-color"
        content={club.background_color || "#fbfcff"}
        media="(prefers-color-scheme: light)"
        key="theme-light"
      />
      <meta
        name="theme-color"
        content={club.background_color || "#191c1e"}
        media="(prefers-color-scheme: dark)"
        key="theme-dark"
      />
    </Head>
    <JoinLayout tabName={tabName} className={pageScheme}>
      {children}
      {club.background_color && club.accent_color && (
        <style jsx global>{`
          :root,
          main {
            --background: ${club.background_color} !important;
            --surface-variant: ${club.background_color} !important;
            --primary: ${club.accent_color} !important;
            --on-primary: var(--on-surface) !important;
          }
        `}</style>
      )}
    </JoinLayout>
  </>
);

export default ClubJoinLayout;
