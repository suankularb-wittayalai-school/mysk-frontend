// Imports
import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { ContentLayout } from "@suankularb-components/react";
import Head from "next/head";
import { ReactNode } from "react";

/**
 * A full-screen Layout for the Club Join flow, centered and constrained to
 * mobile width.
 *
 * @param children The content.
 * @param tabName The text to display on the browser tab.
 *
 * @returns A Layout.
 */
const JoinLayout: StylableFC<{
  children: ReactNode;
  tabName?: string;
}> = ({ children, tabName, className, style }) => (
  <>
    <Head>{tabName && <title>{tabName}</title>}</Head>
    <ContentLayout
      className={cn(
        `mb-[-80px] flex h-screen !p-10 supports-[height:100dvh]:h-[100dvh] [&>*:not(.skc-scrim)]:max-w-lg [&>*]:mx-auto [&>*]:w-full`,
        className,
      )}
      style={style}
    >
      {children}
    </ContentLayout>
  </>
);

export default JoinLayout;
