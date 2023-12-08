// Imports
import ActiveSearchFiltersCard from "@/components/lookup/ActiveSearchFiltersCard";
import { DocumentSearchFilters } from "@/pages/search/documents/results";
import { StylableFC } from "@/utils/types/common";
import { InputChip } from "@suankularb-components/react";
import { useTranslation } from "next-i18next";
import { camel } from "radash";

/**
 * Active Search Filters Card for Documents.
 *
 * @param filters Active search filters.
 */
const DocumentActiveFiltersCard: StylableFC<{
  filters: DocumentSearchFilters;
}> = ({ filters, style, className }) => {
  const { t } = useTranslation("lookup", {
    keyPrefix: "documents.searchFilters",
  });

  return (
    <ActiveSearchFiltersCard style={style} className={className}>
      {filters.types && (
        <InputChip>
          {t("chip.types", {
            context: filters.types.length === 5 ? "all" : undefined,
            content: filters.types.map((type) =>
              t(`form.type.${camel(type)}`).toLocaleLowerCase(),
            ),
          })}
        </InputChip>
      )}
      {filters.subject && (
        <InputChip>{t("chip.subject", { content: filters.subject })}</InputChip>
      )}
      {filters.attendTo && (
        <InputChip>
          {t("chip.attendTo", { content: filters.attendTo })}
        </InputChip>
      )}
      {filters.month && (
        <InputChip>
          {t("chip.month", { content: new Date(`${filters.month}-01`) })}
        </InputChip>
      )}
      {filters.code && (
        <InputChip>{t("chip.code", { content: filters.code })}</InputChip>
      )}
    </ActiveSearchFiltersCard>
  );
};

export default DocumentActiveFiltersCard;
