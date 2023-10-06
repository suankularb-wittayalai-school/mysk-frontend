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

const ActiveSearchFiltersCard: StylableFC<{
  filters: SearchFilters;
  subjectGroups: SubjectGroup[];
}> = ({ filters, subjectGroups, style, className }) => {
  const locale = useLocale();

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
        Search filters
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
            <InputChip>{`Full name: “${filters.fullName}”`}</InputChip>
          )}
          {filters.nickname && (
            <InputChip>{`Nickname: “${filters.nickname}”`}</InputChip>
          )}
          {filters.subjectGroup && (
            <InputChip>
              {filters.subjectGroup === "any"
                ? "Any subject group"
                : `Subject group: “${getLocaleString(
                    subjectGroups.find(
                      (subjectGroup) =>
                        filters.subjectGroup === subjectGroup.id,
                    )!.name,
                    locale,
                  )}”`}
            </InputChip>
          )}
          {filters.classroom && (
            <InputChip>{`Classroom: “${filters.classroom}”`}</InputChip>
          )}
          {filters.contact && (
            <InputChip>{`Contact: “${filters.contact}”`}</InputChip>
          )}
        </ChipSet>
      </motion.div>
    </motion.div>
  );
};

export default ActiveSearchFiltersCard;
