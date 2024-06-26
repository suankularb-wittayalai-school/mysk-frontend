import PrintOptions from "@/components/common/print/PrintOptions";
import PrintPagesFeed from "@/components/common/print/PrintPagesFeed";
import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { Columns, ContentLayout } from "@suankularb-components/react";
import Head from "next/head";
import { ReactNode } from "react";

/**
 * A page for previewing a print job, which allows the user to review options
 * before printing.
 *
 * @param children A {@link PrintPagesFeed Print Pages Feed} and a {@link PrintOptions Print Options}.
 */
const PrintPreviewLayout: StylableFC<{
  children: ReactNode;
}> = ({ children, style, className }) => (
  <>
    <Head>
      {/* App bar color */}
      <meta
        name="theme-color"
        content="#ebeef3" // surface-container
        media="(prefers-color-scheme: light)"
        key="theme-light"
      />
      <meta
        name="theme-color"
        content="#1c2024" // surface-container
        media="(prefers-color-scheme: dark)"
        key="theme-dark"
      />
    </Head>

    <ContentLayout
      style={style}
      className={cn(
        `min-h-dvh sm:bg-surface-container print:-mb-20 print:contents
        print:bg-white print:!py-0`,
        className,
      )}
    >
      <Columns columns={3}>{children}</Columns>
    </ContentLayout>

    <style jsx global>{`
      body {
        background-color: var(--surface-container);
      }

      @media only screen and (min-width: 600px) {
        .skc-nav-bar::before {
          background-color: transparent !important;
        }
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

export default PrintPreviewLayout;
