// Imports
import ActiveSearchFiltersCard from "@/components/lookup/ActiveSearchFiltersCard";
import { StudentSearchFilters } from "@/pages/search/students/results";
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/common";
import { InputChip } from "@suankularb-components/react";
import { useTranslation } from "next-i18next";

/**
 * Active Search Filters Card for Students.
 *
 * @param filters Active search filters.
 */
const StudentActiveFiltersCard: StylableFC<{
  filters: StudentSearchFilters;
}> = ({ filters, style, className }) => {
  const locale = useLocale();
  const { t } = useTranslation("lookup", {
    keyPrefix: "students.searchFilters",
  });

  return (
    <ActiveSearchFiltersCard style={style} className={className}>
      {filters.fullName && (
        <InputChip>
          {t("chip.fullName", { content: filters.fullName })}
        </InputChip>
      )}
      {filters.nickname && (
        <InputChip>
          {t("chip.nickname", { content: filters.nickname })}
        </InputChip>
      )}
      {filters.contact && (
        <InputChip>{t("chip.contact", { content: filters.contact })}</InputChip>
      )}
    </ActiveSearchFiltersCard>
  );
};

export default StudentActiveFiltersCard;
