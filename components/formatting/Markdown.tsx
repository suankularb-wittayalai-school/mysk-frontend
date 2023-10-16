// Imports
import isURL from "@/utils/helpers/isURL";
import { Table } from "@suankularb-components/react";
import Image from "next/image";
import { Children, FC, ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";

/**
 * A Markdown renderer.
 *
 * @param children The Markdown string.
 * @param noStyles Whether to disable the default styles.
 */
const Markdown: FC<{
  children: string;
  disableStyles?: boolean;
}> = ({ children, disableStyles }) => (
  <ReactMarkdown
    remarkPlugins={[gfm]}
    components={{
      a: ({ href, title, children }) => {
        const maxLength = 36;
        const text = children
          ? Children.toArray(children as ReactNode)[0]?.toString()
          : "";

        // Don’t modify if empty or not link
        if (!text || !isURL(text))
          return (
            <a href={href} title={title} target="_blank" rel="noreferrer">
              {children}
            </a>
          );

        // Shorten link
        return (
          <a href={href} title={title} target="_blank" rel="noreferrer">
            {text.length > maxLength
              ? [text.slice(0, maxLength), "…"].join("")
              : (children as ReactNode)}
          </a>
        );
      },
      img: ({ src, alt }) => {
        if (
          src?.startsWith(
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/`,
          )
        ) {
          return (
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
          contentWidth={640}
          className={disableStyles ? "not-prose" : "not-prose my-5"}
        >
          {children as ReactNode}
        </Table>
      ),
    }}
    className={!disableStyles ? "markdown" : undefined}
  >
    {children}
  </ReactMarkdown>
);

export default Markdown;
