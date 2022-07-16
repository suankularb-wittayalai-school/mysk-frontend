// Modules
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";

// SK Components
import { Table } from "@suankularb-components/react";

const Markdown = ({
  noStyles,
  children,
}: {
  noStyles?: boolean;
  children: string;
}) => {
  return (
    <ReactMarkdown
      remarkPlugins={[gfm]}
      components={{
        img: ({ src, alt }) => (
          <div className="flex flex-row justify-center w-full">
            <div className="relative aspect-video w-full max-w-[36rem] overflow-hidden rounded-xl bg-surface-1">
              {src && (
                <Image src={src} layout="fill" objectFit="contain" alt={alt} />
              )}
            </div>
          </div>
        ),
        table: ({ children }) => (
          <Table type="outlined" width={640} className="not-prose">
            {children}
          </Table>
        ),
      }}
      className={noStyles ? undefined : "markdown"}
    >
      {children}
    </ReactMarkdown>
  );
};

export default Markdown;
