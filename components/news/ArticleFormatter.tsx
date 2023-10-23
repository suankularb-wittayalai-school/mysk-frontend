// Imports
import cn from "@/utils/helpers/cn";
import isURL from "@/utils/helpers/isURL";
import { Card, Table, Text } from "@suankularb-components/react";
import Image from "next/image";
import { Children, FC, ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import Balancer from "react-wrap-balancer";
import gfm from "remark-gfm";

/**
 * A Markdown renderer for News Article.
 *
 * @param children The Markdown string.
 */
const ArticleFormatter: FC<{ children: string }> = ({ children }) => (
  <ReactMarkdown
    remarkPlugins={[gfm]}
    components={{
      // Shorten links
      a: ({ href, title, children }) => {
        const maxLength = 36;
        const text = children
          ? Children.toArray(children as ReactNode)[0]?.toString()
          : "";

        // Don’t modify if empty or not link
        if (!text || !isURL(text))
          return (
            <a
              href={href}
              title={title}
              target="_blank"
              rel="noreferrer"
              className="link"
            >
              {children}
            </a>
          );

        // Shorten link
        return (
          <a
            href={href}
            title={title}
            target="_blank"
            rel="noreferrer"
            className="link"
          >
            {text.length > maxLength
              ? [text.slice(0, maxLength), "…"].join("")
              : (children as ReactNode)}
          </a>
        );
      },

      // Turn blockquotes into Cards
      blockquote: ({ children }) => (
        <Card
          appearance="filled"
          element="blockquote"
          className="my-6 px-4 py-1 [&>p]:!font-display [&>p]:!font-medium"
        >
          {children as ReactNode}
        </Card>
      ),

      // Turn images into rounded Image components
      img: ({ src, alt }) => {
        // Disallow non-Supabase images
        // (Next.js only accept images from domains specified in the `next.config.js` file)
        if (
          !src?.startsWith(
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/`,
          )
        )
          return null;
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
      },

      // Turn tables into Tables
      table: ({ children }) => (
        <Table contentWidth={640} className="not-prose my-5">
          {children as ReactNode}
        </Table>
      ),

      // Format headers with Text typography and spacing
      h1: ({ children }) => (
        <Text type="headline-medium" element="h1" className="mb-4 mt-8">
          <Balancer>{children as ReactNode}</Balancer>
        </Text>
      ),
      h2: ({ children }) => (
        <Text type="headline-small" element="h2" className="mb-2 mt-6">
          <Balancer>{children as ReactNode}</Balancer>
        </Text>
      ),
      h3: ({ children }) => (
        <Text type="title-large" element="h3" className="mt-6">
          <Balancer>{children as ReactNode}</Balancer>
        </Text>
      ),
      h4: ({ children }) => (
        <Text
          type="title-large"
          element="h4"
          className="mt-4 !font-bold italic text-on-surface-variant"
        >
          <Balancer>{children as ReactNode}</Balancer>
        </Text>
      ),
      h5: ({ children }) => (
        <Text
          type="title-medium"
          element="h5"
          className="-mb-1 mt-4 !font-bold"
        >
          <Balancer>{children as ReactNode}</Balancer>
        </Text>
      ),
      h6: ({ children }) => (
        <Text
          type="title-medium"
          element="h6"
          className="-mb-1 mt-4 !font-bold italic text-on-surface-variant"
        >
          <Balancer>{children as ReactNode}</Balancer>
        </Text>
      ),
      p: ({ children }) => (
        <Text type="body-large" element="p" className="my-2 !leading-relaxed">
          {children as ReactNode}
        </Text>
      ),

      // Format list spacing and markers
      ol: ({ children }) => (
        <Text
          type="body-large"
          element="ol"
          className={cn(`my-3 ml-8 list-decimal space-y-1.5 !leading-relaxed
            marker:font-display marker:text-on-surface-variant`)}
        >
          {children as ReactNode}
        </Text>
      ),
      ul: ({ children }) => (
        <Text
          type="body-large"
          element="ul"
          className={cn(`my-3 ml-8 list-disc space-y-1.5 !leading-relaxed
            marker:text-on-surface-variant`)}
        >
          {children as ReactNode}
        </Text>
      ),
    }}
    // Remove margin from first child
    className="[&>:first-child]:mt-0"
  >
    {children}
  </ReactMarkdown>
);

export default ArticleFormatter;
