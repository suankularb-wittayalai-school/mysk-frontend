// Imports
import ActiveSearchFiltersCard from "@/components/lookup/ActiveSearchFiltersCard";
import { TeacherSearchFilters } from "@/pages/search/teachers/results";
import getLocaleString from "@/utils/helpers/getLocaleString";
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/common";
import { SubjectGroup } from "@/utils/types/subject";
import { InputChip } from "@suankularb-components/react";
import { useTranslation } from "next-i18next";

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
  const { t } = useTranslation("lookup", {
    keyPrefix: "teachers.searchFilters",
  });

  const subjectGroup = filters.subjectGroup
    ? subjectGroups.find((item) => filters.subjectGroup === item.id)
    : undefined;

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
      {subjectGroup && (
        <InputChip>
          {t("chip.subjectGroup", {
            content: getLocaleString(subjectGroup.name, locale),
          })}
        </InputChip>
      )}
      {filters.classroom && (
        <InputChip>
          {t("chip.classroom", { content: filters.classroom })}
        </InputChip>
      )}
      {filters.contact && (
        <InputChip>{t("chip.contact", { content: filters.contact })}</InputChip>
      )}
    </ActiveSearchFiltersCard>
  );
};

export default TeacherActiveFiltersCard;

