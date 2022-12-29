// External libraries
import Image from "next/future/image";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";

// SK Components
import { Table } from "@suankularb-components/react";
import { FC } from "react";

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
        a: ({ href, title, children }) => {
          const maxLength = 36;
          const text = children ? children[0]?.toString() : "";

          const AWithProps: FC = ({ children }) => (
            <a {...{ href, title }} target="_blank" rel="noreferrer">
              {children}
            </a>
          );

          // Don’t modify if empty or not link
          if (!text) return <AWithProps>{children}</AWithProps>;

          try {
            new URL(text);
          } catch (_) {
            return <AWithProps>{children}</AWithProps>;
          }

          // Shorten link
          return (
            <AWithProps>
              {text.length > maxLength
                ? [children[0]?.toString().slice(0, maxLength), "…"].join("")
                : children}
            </AWithProps>
          );
        },
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
