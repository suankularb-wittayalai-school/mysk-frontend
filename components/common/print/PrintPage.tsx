import PrintPreviewLayout from "@/components/common/print/PrintPreviewLayout";
import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { ReactNode } from "react";

/**
 * A simulation of an A4 paper. The first child of
 * {@link PrintPreviewLayout Print Preview Layout} and the only element visible to printers.
 *
 * @param children The contents of the print preview.
 */
const PrintPage: StylableFC<{
  children: ReactNode;
}> = ({ children, style, className }) => (
  <>
    <article
      style={style}
      className={cn(
        `aspect-[1/sqrt(2)] min-w-[42rem] bg-white p-8 font-print text-black
        sm:mr-[26rem] sm:shadow-3 md:col-span-2 lg:mr-0 print:m-0 print:!block
        print:aspect-auto print:w-full print:min-w-0 print:p-0
        print:!shadow-none`,
        className,
      )}
    >
      {children}
    </article>
    <div aria-hidden className="hidden break-after-page print:block" />
  </>
);

export default PrintPage;
