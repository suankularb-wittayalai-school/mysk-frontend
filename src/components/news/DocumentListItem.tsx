// External libraries
import { Trans } from "next-i18next";
import { FC } from "react";

// SK Components
import { MaterialIcon } from "@suankularb-components/react";

// Helpers
import { getLocaleYear } from "@utils/helpers/date";

// Hooks
import { useLocale } from "@utils/hooks/i18n";

// Types
import { SchoolDocument, SchoolDocumentType } from "@utils/types/news";

const DocumentListItem: FC<{
  type: SchoolDocumentType;
  document: SchoolDocument;
}> = ({ type, document }) => {
  const locale = useLocale();

  return (
    <a
      href={document.documentLink}
      target="mysk-documents"
      rel="noreferrer"
      className="has-action flex w-full flex-row items-center gap-2 py-4
        px-4 font-display sm:px-0"
    >
      <div className="flex w-full flex-col gap-2">
        {/* Code and date */}
        <div className="divide-x divide-outline">
          <span className="pr-2">
            <Trans
              i18nKey={`schoolDocs.${type}.code`}
              ns="news"
              values={{
                code: document.code,
                year: getLocaleYear(
                  "th",
                  new Date(document.date).getFullYear()
                ),
              }}
              components={{
                span: <span className="font-black text-tertiary" />,
              }}
            />
          </span>
          <time className="pl-2 text-outline">
            {new Date(document.date).toLocaleDateString(locale, {
              year: locale == "en-US" ? "numeric" : "2-digit",
              month: "short",
              day: "numeric",
            })}
          </time>
        </div>

        {/* Title */}
        <h3 className="max-lines-5 text-3xl">{document.subject}</h3>
      </div>
      <MaterialIcon icon="open_in_new" className="text-secondary" />
    </a>
  );
};

export default DocumentListItem;
