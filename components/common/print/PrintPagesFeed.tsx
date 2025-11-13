import PrintPage from "@/components/common/print/PrintPage";
import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { ReactNode } from "react";

/**
 * A feed for pages in a print job.
 *
 * @param children The {@link PrintPage Print Pages} to be printed.
 */
const PrintPagesFeed: StylableFC<{
  children: ReactNode;
}> = ({ children, style, className }) => (
  <div
    style={style}
    className={cn(
      `-mt-8 mb-96 w-screen space-y-1 overflow-auto border-b-1 border-outline
      sm:mt-0 sm:contents print:block print:break-before-page print:break-inside-avoid print:space-y-0`,
      className,
    )}
  >
    {children}
  </div>
);

export default PrintPagesFeed;
