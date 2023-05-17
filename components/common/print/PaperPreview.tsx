import { FC, ReactNode } from "react";

const PaperPreview: FC<{ children: ReactNode }> = ({ children }) => (
  <div
    className="-mt-8 mb-96 w-screen overflow-auto border-b-1 border-outline
      print:contents sm:mt-0 sm:contents"
  >
    <article
      className="aspect-[1/1.4142] min-w-[42rem] bg-white p-8 text-black 
        print:m-0 print:!block print:w-full print:min-w-0 print:p-0
        print:shadow-none sm:mr-[26rem] sm:shadow-3 md:col-span-2 lg:mr-0"
    >
      {children}
    </article>
  </div>
);

export default PaperPreview;
