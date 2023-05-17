// External libraries
import { FC, ReactNode } from "react";

// SK Components
import { ContentLayout, Columns } from "@suankularb-components/react";
import Head from "next/head";

const PrintPage: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <>
      <Head>
        {/* App bar color */}
        <meta
          name="theme-color"
          content="#e7f0f6"
          media="(prefers-color-scheme: light)"
          key="theme-light"
        />
        <meta
          name="theme-color"
          content="#212a30"
          media="(prefers-color-scheme: dark)"
          key="theme-dark"
        />
      </Head>
      <ContentLayout
        className="min-h-screen supports-[height:100dvh]:min-h-[100dvh] print:-mb-20
          print:bg-white print:!py-0 sm:bg-surface-2"
      >
        <Columns columns={3}>{children}</Columns>
      </ContentLayout>
      <style jsx global>{`
        .skc-nav-bar {
          background-color: var(--surface-2) !important;
        }
      `}</style>
    </>
  );
};

export default PrintPage;
