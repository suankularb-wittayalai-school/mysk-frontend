import ActiveSearchFiltersCard from "@/components/lookup/ActiveSearchFiltersCard";
import { StudentSearchFilters } from "@/pages/search/students/results";
import { StylableFC } from "@/utils/types/common";
import { InputChip } from "@suankularb-components/react";
import useTranslation from "next-translate/useTranslation";

/**
 * Active Search Filters Card for Students.
 *
 * @param filters Active search filters.
 */
const StudentActiveFiltersCard: StylableFC<{
  filters: StudentSearchFilters;
}> = ({ filters, style, className }) => {
  const { t } = useTranslation("search/students/list");

  return (
    <ActiveSearchFiltersCard style={style} className={className}>
      {filters.fullName && (
        <InputChip>
          {t("filter.fullName", { content: filters.fullName })}
        </InputChip>
      )}
      {filters.nickname && (
        <InputChip>
          {t("filter.nickname", { content: filters.nickname })}
        </InputChip>
      )}
      {filters.contact && (
        <InputChip>
          {t("filter.contact", { content: filters.contact })}
        </InputChip>
      )}
    </ActiveSearchFiltersCard>
  );
};

export default StudentActiveFiltersCard;
