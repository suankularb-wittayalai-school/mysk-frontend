// Imports
import cn from "@/utils/helpers/cn";
import getLocaleYear from "@/utils/helpers/getLocaleYear";
import useLocale from "@/utils/helpers/useLocale";
import { SchoolDocument } from "@/utils/types/news";
import { Card, CardHeader, useBreakpoint } from "@suankularb-components/react";
import { isThisYear } from "date-fns";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { FC } from "react";

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
      appearance="outlined"
      direction="row"
      stateLayerEffect
      className={cn(
        `w-full items-center !border-transparent pr-3 text-left`,
        selected?.id === document.id &&
          `sm:!border-outline-variant sm:!bg-primary-container
          sm:focus:!border-primary`,
      )}
      {...(atBreakpoint === "base"
        ? // If the user is on mobile, take then straight to the Google
          // Drive file
          {
            href: document.document_link,
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
                { shallow: true }
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
