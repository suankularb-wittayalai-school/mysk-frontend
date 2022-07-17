// Modules
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";

// SK Components
import { Table } from "@suankularb-components/react";
import { motion } from "framer-motion";

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
          <motion.div
            className="flex w-full flex-row justify-center"
            layoutId={src}
          >
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
          </motion.div>
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
