import ActiveSearchFiltersCard from "@/components/lookup/ActiveSearchFiltersCard";
import { TeacherSearchFilters } from "@/pages/search/teachers/results";
import getLocaleString from "@/utils/helpers/getLocaleString";
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/common";
import { SubjectGroup } from "@/utils/types/subject";
import { InputChip } from "@suankularb-components/react";
import useTranslation from "next-translate/useTranslation";

/**
 * Active Search Filters Card for Teachers.
 *
 * @param filters Active search filters.
 * @param subjectGroups The list of all Subject Groups.
 */
const TeacherActiveFiltersCard: StylableFC<{
  filters: TeacherSearchFilters;
  subjectGroups: SubjectGroup[];
}> = ({ filters, subjectGroups, style, className }) => {
  const locale = useLocale();
  const { t } = useTranslation("search/teachers/list");

  const subjectGroup = filters.subjectGroup
    ? subjectGroups.find((item) => filters.subjectGroup === item.id)
    : undefined;

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
      {subjectGroup && (
        <InputChip>
          {t("filter.subjectGroup", {
            content: getLocaleString(subjectGroup.name, locale),
          })}
        </InputChip>
      )}
      {filters.classroom && (
        <InputChip>
          {t("filter.classroom", { content: filters.classroom })}
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

export default TeacherActiveFiltersCard;
