// Imports
import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import Head from "next/head";
import { ReactNode } from "react";

const JoinLayout: StylableFC<{
  children: ReactNode;
  tabName?: string;
}> = ({ children, tabName, className, style }) => (
  <>
    <Head>{tabName && <title>{tabName}</title>}</Head>
    <main
      className={cn(
        `relative flex h-screen flex-col justify-between gap-3 overflow-x-hidden p-10 text-on-background supports-[height:100dvh]:h-[100dvh] [&>*:not(.skc-scrim)]:max-w-lg [&>*]:mx-auto [&>*]:w-full`,
        className,
      )}
      style={style}
    >
      {children}
    </main>
  </>
);

export default JoinLayout;
