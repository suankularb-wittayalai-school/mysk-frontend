// External libraries
import Head from "next/head";
import { FC, ReactNode } from "react";

// SK Components
import { Columns, ContentLayout } from "@suankularb-components/react";

// Internal components
import PaperPreview from "@/components/common/print/PaperPreview";
import PrintOptions from "@/components/common/print/PrintOptions";

/**
 * A page for previewing a print job, which allows the user to review options
 * before printing.
 *
 * @param children A {@link PaperPreview Paper Preview} and a {@link PrintOptions Print Options}.
 *
 * @returns A Content Layout.
 */
const PrintPage: FC<{ children: ReactNode }> = ({ children }) => (
  <>
    <Head>
      {/* App bar color */}
      <meta
        name="theme-color"
        content="#e7f0f6" // surface-3
        media="(prefers-color-scheme: light)"
        key="theme-light"
      />
      <meta
        name="theme-color"
        content="#212a30" // surface-3
        media="(prefers-color-scheme: dark)"
        key="theme-dark"
      />
    </Head>

    <ContentLayout
      className="min-h-screen supports-[height:100dvh]:min-h-[100dvh]
        print:-mb-20 print:contents print:bg-white print:!py-0
        sm:bg-surface-2"
    >
      <Columns columns={3}>{children}</Columns>
    </ContentLayout>

    <style jsx global>{`
      body,
      .skc-nav-bar {
        background-color: var(--surface-2) !important;
      }

      @media print {
        body {
          background-color: var(--white);
        }

        .skc-root-layout {
          padding-bottom: 0;
        }
      }
    `}</style>
  </>
);

export default PrintPage;
