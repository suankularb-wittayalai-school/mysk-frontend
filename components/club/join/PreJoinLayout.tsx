// Imports
import JoinLayout from "@/components/club/join/JoinLayout";
import Head from "next/head";
import { FC, ReactNode } from "react";

/**
 * Join Layout for pages that do not involve clubs, i.e. Ready to Join, QR
 * Method, etc.
 *
 * @param children The content.
 * @param tabName The text to display on the browser tab.
 *
 * @returns A Join Layout.
 */
const PreJoinLayout: FC<{
  children: ReactNode;
  tabName?: string;
}> = ({ children, tabName }) => (
  <>
    <Head>
      <meta
        name="theme-color"
        content="#d8e7ef"
        media="(prefers-color-scheme: light)"
        key="theme-light"
      />
      <meta
        name="theme-color"
        content="#27353d"
        media="(prefers-color-scheme: dark)"
        key="theme-dark"
      />
    </Head>
    <JoinLayout
      tabName={tabName}
      className="from-surface-5 bg-gradient-to-b via-background"
    >
      {children}
    </JoinLayout>
  </>
);

export default PreJoinLayout;
