import cn from "@/utils/helpers/cn";
import getLocaleYear from "@/utils/helpers/getLocaleYear";
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/common";
import { SchoolDocument } from "@/utils/types/news";
import { Card, CardHeader } from "@suankularb-components/react";
import { isThisYear } from "date-fns";
import useTranslation from "next-translate/useTranslation";
import { camel } from "radash";

/**
 * A card that displays a Document in the list of Documents.
 *
 * @param document The Document to display.
 * @param selected If this Document is currently selected.
 * @param onClick The function to set the selected Document.
 */
const LookupDocumentCard: StylableFC<{
  document: SchoolDocument;
  selected?: boolean;
  onClick: (id: string) => void;
}> = ({ document, selected, onClick, style, className }) => {
  // Translation
  const locale = useLocale();
  const { t } = useTranslation("search/documents/list");

  // Cast the signed date
  const documentDate = new Date(document.date);

  return (
    <Card
      appearance="outlined"
      direction="row"
      stateLayerEffect
      onClick={() => onClick(document.id)}
      style={style}
      className={cn(
        `w-full items-center !rounded-none !border-transparent pr-3 text-left
        sm:!rounded-md`,
        selected &&
          `sm:!border-outline-variant sm:!bg-primary-container
          sm:focus:!border-primary`,
        className,
      )}
    >
      <CardHeader
        // Subject line
        title={document.subject}
        // Metadata
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
        className="[&_h3]:line-clamp-3"
      />
    </Card>
  );
};

export default LookupDocumentCard;
