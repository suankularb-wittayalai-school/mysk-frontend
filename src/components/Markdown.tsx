// Modules
import { Table } from "@suankularb-components/react";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";

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
