// Imports
import { SearchFilters } from "@/pages/lookup/teachers/results";
import cn from "@/utils/helpers/cn";
import getLocaleString from "@/utils/helpers/getLocaleString";
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/common";
import { SubjectGroup } from "@/utils/types/subject";
import {
  ChipSet,
  InputChip,
  transition,
  useAnimationConfig,
} from "@suankularb-components/react";
import { motion } from "framer-motion";
import { useTranslation } from "next-i18next";

const ActiveSearchFiltersCard: StylableFC<{
  filters: SearchFilters;
  subjectGroups: SubjectGroup[];
}> = ({ filters, subjectGroups, style, className }) => {
  const locale = useLocale();
  const { t } = useTranslation("lookup", {
    keyPrefix: "teachers.searchFilters",
  });
  const { t: tx } = useTranslation("lookup");

  const subjectGroup = filters.subjectGroup
    ? subjectGroups.find(
        (subjectGroup) => filters.subjectGroup === subjectGroup.id,
      )
    : undefined;

  const { duration, easing } = useAnimationConfig();

  return (
    <motion.div
      layout="size"
      layoutId="search-filters"
      transition={transition(duration.long2, easing.emphasized)}
      style={{ ...style, borderRadius: 12 }}
      className={cn(
        `skc-card skc-card--outlined -mt-2 w-[calc(100dvw-2rem)] sm:mt-0
        sm:w-full`,
        className,
      )}
    >
      <motion.h2
        layout="position"
        transition={transition(duration.long2, easing.emphasized)}
        className="skc-text skc-text--title-medium px-4 pb-2 pt-3"
      >
        {tx("common.searchFilters.title")}
      </motion.h2>
      <motion.div
        layout="position"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={transition(duration.medium4, easing.standardDecelerate)}
        className="pb-3"
      >
        <ChipSet
          scrollable
          className={cn(`pb-1
            [mask-image:linear-gradient(to_left,transparent_0.5rem,black_2rem)]
            [&>div]:pl-4 [&>div]:pr-8`)}
        >
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
            <InputChip>
              {t("chip.contact", { content: filters.contact })}
            </InputChip>
          )}
        </ChipSet>
      </motion.div>
    </motion.div>
  );
};

export default ActiveSearchFiltersCard;
