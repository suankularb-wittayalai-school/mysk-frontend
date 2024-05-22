import ActiveSearchFiltersCard from "@/components/lookup/ActiveSearchFiltersCard";
import { DocumentSearchFilters } from "@/pages/search/documents/results";
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/common";
import { InputChip } from "@suankularb-components/react";
import useTranslation from "next-translate/useTranslation";
import { camel } from "radash";

/**
 * Active Search Filters Card for Documents.
 *
 * @param filters Active search filters.
 */
const DocumentActiveFiltersCard: StylableFC<{
  filters: DocumentSearchFilters;
}> = ({ filters, style, className }) => {
  const locale = useLocale();
  const { t } = useTranslation("search/documents/list");

  return (
    <ActiveSearchFiltersCard style={style} className={className}>
      {filters.types && (
        <InputChip>
          {t("filter.type" + (filters.types.length === 5 ? "_all" : ""), {
            content: filters.types.map((type) =>
              t(`common:document.${camel(type)}`).toLocaleLowerCase(),
            ),
          })}
        </InputChip>
      )}
      {filters.subject && (
        <InputChip>
          {t("filter.subject", { content: filters.subject })}
        </InputChip>
      )}
      {filters.attendTo && (
        <InputChip>
          {t("filter.attendTo", { content: filters.attendTo })}
        </InputChip>
      )}
      {filters.month && (
        <InputChip>
          {t("filter.month", {
            content: new Date(`${filters.month}-01`).toLocaleDateString(
              locale,
              { month: "long", year: "numeric" },
            ),
          })}
        </InputChip>
      )}
      {filters.code && (
        <InputChip>{t("filter.code", { content: filters.code })}</InputChip>
      )}
    </ActiveSearchFiltersCard>
  );
};

export default DocumentActiveFiltersCard;
