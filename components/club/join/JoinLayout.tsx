// Imports
import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { ContentLayout } from "@suankularb-components/react";
import Head from "next/head";
import { ReactNode } from "react";

const JoinLayout: StylableFC<{
  children: ReactNode;
  tabName?: string;
}> = ({ children, tabName, className, style }) => (
  <>
    <Head>{tabName && <title>{tabName}</title>}</Head>
    <ContentLayout
      className={cn(
        `flex h-screen !p-10 supports-[height:100dvh]:h-[100dvh] [&>*:not(.skc-scrim)]:max-w-lg [&>*]:mx-auto [&>*]:w-full mb-[-80px]`,
        className,
      )}
      style={style}
    >
      {children}
    </ContentLayout>
  </>
);

export default JoinLayout;
