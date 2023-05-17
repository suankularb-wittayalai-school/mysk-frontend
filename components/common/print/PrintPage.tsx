import { ContentLayout, Columns } from "@suankularb-components/react";
import { FC, ReactNode } from "react";

const PrintPage: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <>
      <ContentLayout
        className="min-h-screen sm:bg-surface-2
          supports-[height:100dvh]:min-h-[100dvh] print:-mb-20 print:!py-0"
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
