import { FC, ReactNode } from "react";

const PaperPreview: FC<{ children: ReactNode }> = ({ children }) => (
  <article
    className="print aspect-[1/1.4142] min-w-[42rem] bg-white p-8
      text-black shadow-3 print:!block print:w-full print:min-w-0 print:p-0
      print:shadow-none md:col-span-2"
  >
    {children}
  </article>
);

export default PaperPreview;
