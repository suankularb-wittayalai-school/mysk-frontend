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
          <div className="flex w-full flex-row justify-center">
            <div
              className="relative aspect-video w-screen max-w-[36rem] overflow-hidden
                rounded-xl bg-surface-1"
            >
              {src?.startsWith(
                "https://ykqqepbodqjhiwfjcvxe.supabase.co/storage/v1/object/public/"
              ) && (
                <Image src={src} layout="fill" objectFit="contain" alt={alt} />
              )}
            </div>
          </div>
        ),

        table: ({ children }) => (
          <Table
            type="outlined"
            width={640}
            className={noStyles ? undefined : "not-prose my-5"}
          >
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
