// External libraries
import { FC, ReactNode } from "react";

// Internal components
import PrintPage from "@/components/common/print/PrintPage";

/**
 * A simulation of an A4 paper. The first child of
 * {@link PrintPage Print Page} and the only element visible to printers.
 *
 * @param children The contents of the print preview.
 *
 * @returns A JSX Element representation of an A4 paper.
 */
const PaperPreview: FC<{ children: ReactNode }> = ({ children }) => (
  <div
    className="-mt-8 mb-96 w-screen overflow-auto border-b-1 border-outline
      print:contents sm:mt-0 sm:contents"
  >
    <article
      className="aspect-[1/1.4142] min-w-[42rem] bg-white p-8 font-print
        text-black print:m-0 print:!block print:aspect-auto print:w-full
        print:min-w-0 print:p-0 print:!shadow-none sm:mr-[26rem] sm:shadow-3
        md:col-span-2 lg:mr-0"
    >
      {children}
    </article>
  </div>
);

export default PaperPreview;
