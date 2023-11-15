// Imports
import cn from "@/utils/helpers/cn";
import getLocaleYear from "@/utils/helpers/getLocaleYear";
import useLocale from "@/utils/helpers/useLocale";
import { SchoolDocument } from "@/utils/types/news";
import { Card, CardHeader } from "@suankularb-components/react";
import { isThisYear } from "date-fns";
import { useTranslation } from "next-i18next";
import { camel } from "radash";
import { FC } from "react";

/**
 * A card that displays a Document in the list of Documents.
 *
 * @param document The Document to display.
 * @param selected The currently selected Document.
 * @param onClick The function to set the selected Document.
 */
const LookupDocumentCard: FC<{
  document: SchoolDocument;
  selected?: SchoolDocument;
  onClick: (value: SchoolDocument) => void;
}> = ({ document, selected, onClick }) => {
  // Translation
  const locale = useLocale();
  const { t } = useTranslation("lookup", { keyPrefix: "documents.list" });

  // Cast the signed date
  const documentDate = new Date(document.date);

  return (
    <Card
      appearance="outlined"
      direction="row"
      stateLayerEffect
      onClick={() => onClick(document)}
      className={cn(
        `w-full items-center !rounded-none !border-transparent pr-3 text-left
        sm:!rounded-md`,
        selected?.id === document.id &&
          `sm:!border-outline-variant sm:!bg-primary-container
          sm:focus:!border-primary`,
      )}
    >
      {/* Subject line, code, and signed date */}
      <CardHeader
        // Subject line
        title={document.subject}
        // {code}/{year in BE} • {date}
        subtitle={t(`metadata.${camel(document.type)}`, {
          code: document.code,
          year: getLocaleYear("th", documentDate.getFullYear(), "AD"),
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

export default LookupDocumentCard;
