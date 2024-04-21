import PrintPage from "@/components/common/print/PrintPage";
import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { ReactNode } from "react";

/**
 * A simulation of an A4 paper. The first child of
 * {@link PrintPage Print Page} and the only element visible to printers.
 *
 * @param children The contents of the print preview.
 */
const PaperPreview: StylableFC<{
  children: ReactNode;
}> = ({ children, style, className }) => (
  <div
    style={style}
    className={cn(
      `-mt-8 mb-96 w-screen overflow-auto border-b-1 border-outline sm:mt-0
      sm:contents print:contents`,
      className,
    )}
  >
    {/* Paper */}
    <article
      className={cn(`aspect-[1/1.4142] min-w-[42rem] bg-white p-8 font-print
        text-black sm:mr-[26rem] sm:shadow-3 md:col-span-2 lg:mr-0
        print:m-0 print:!block print:aspect-auto print:w-full print:min-w-0
        print:p-0 print:!shadow-none`)}
    >
      {children}
    </article>
  </div>
);

export default PaperPreview;
