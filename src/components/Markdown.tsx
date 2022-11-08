// External libraries
import Image from "next/future/image";
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
        img: ({ src, alt }) => {
          if (
            src?.startsWith(
              `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/`
            )
          ) {
            return (
              // (@SiravitPhokeed)
              // This somehow works. I don’t know how.
              // I’d love it if someone explains this to me.
              <Image
                src={src}
                width={720} // <-- Cap the width at 720px
                height={0} // <-- This apparently doesn’t matter
                alt={alt || ""}
                className="mx-auto rounded-xl"
              />
            );
          }
          return <>Invalid image.</>;
        },
        table: ({ children }) => (
          <Table
            type="outlined"
            width={640}
            className={noStyles ? "not-prose" : "not-prose my-5"}
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
