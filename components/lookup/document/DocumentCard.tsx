// External libraries
import { isThisYear } from "date-fns";
import { useRouter } from "next/router";
import { Trans, useTranslation } from "next-i18next";
import { FC } from "react";

// SK Components
import { Card, CardHeader, useBreakpoint } from "@suankularb-components/react";

// Helpers
import { cn } from "@/utils/helpers/className";
import { getLocaleYear } from "@/utils/helpers/date";

// Hooks
import { useLocale } from "@/utils/hooks/i18n";

// Types
import { SchoolDocument } from "@/utils/types/news";

const DocumentCard: FC<{
  document: SchoolDocument;
  selected?: SchoolDocument;
  setSelected?: (value: SchoolDocument) => void;
}> = ({ document, selected, setSelected }) => {
  // Translation
  const locale = useLocale();
  const { t } = useTranslation("lookup", { keyPrefix: "documents.list" });

  // Router
  const router = useRouter();

  // Responsive
  const { atBreakpoint } = useBreakpoint();

  // Cast the signed date
  const documentDate = new Date(document.date);

  return (
    <Card
      appearance="filled"
      direction="row"
      stateLayerEffect
      className={cn([
        "text-left",
        // A different style for the selected Order
        selected?.id === document.id
          ? "!bg-primary-container"
          : "!border-transparent !bg-transparent",
      ])}
      {...(atBreakpoint === "base"
        ? // If the user is on mobile, take then straight to the Google
          // Drive file
          {
            href: document.documentLink,
            aAttr: { target: "_blank", rel: "noreferrer" },
          }
        : // If the user is on tablet/desktop, show the selected Order in
          // an iframe in the detail section
          {
            onClick: () => {
              if (selected?.id === document.id) return;
              if (setSelected) setSelected(document);
              router.replace(
                `/lookup/document?id=${document.id}&type=${document.type}`,
                undefined,
                {
                  shallow: true,
                }
              );
            },
          })}
    >
      {/* Subject line, code, and signed date */}
      <CardHeader
        // Subject line
        title={document.subject}
        // {code}/{year in BE} • {date}
        subtitle={t(`metadata.${document.type}`, {
          code: document.code,
          year: getLocaleYear("th", documentDate.getFullYear()),
          date: documentDate.toLocaleDateString(locale, {
            year: !isThisYear(documentDate)
              ? locale === "en-US"
                ? "numeric"
                : "2-digit"
              : undefined,
            month: "short",
            day: "numeric",
          }),
        })}
      />
    </Card>
  );
};

export default DocumentCard;
