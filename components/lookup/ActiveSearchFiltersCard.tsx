import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import {
  ChipSet,
  DURATION,
  EASING,
  transition,
} from "@suankularb-components/react";
import { motion } from "framer-motion";
import useTranslation from "next-translate/useTranslation";
import { ReactNode } from "react";

/**
 * A small Card displaying the active search filters in the Results page when
 * performing a search.
 *
 * @param children Chips representing the active search filters.
 */
const ActiveSearchFiltersCard: StylableFC<{
  children: ReactNode;
}> = ({ children, style, className }) => {
  const { t } = useTranslation("search/common");

  return (
    <motion.div
      layout="size"
      layoutId="search-filters"
      transition={transition(DURATION.long2, EASING.emphasized)}
      style={{ ...style, borderRadius: 12 }}
      className={cn(
        `skc-card skc-card--outlined -mt-2 w-[calc(100dvw-2rem)] sm:mt-0
        sm:w-full`,
        className,
      )}
    >
      <motion.h2
        layout="position"
        transition={transition(DURATION.long2, EASING.emphasized)}
        className="skc-text skc-text--title-medium px-4 pb-2 pt-3"
      >
        {t("activeFilters.title")}
      </motion.h2>
      <motion.div
        layout="position"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={transition(DURATION.medium4, EASING.standardDecelerate)}
        className="pb-3"
      >
        <ChipSet
          scrollable
          className={cn(`pb-1
            [mask-image:linear-gradient(to_left,transparent_0.5rem,black_2rem)]
            [&>div]:pl-4 [&>div]:pr-8`)}
        >
          {children}
        </ChipSet>
      </motion.div>
    </motion.div>
  );
};

export default ActiveSearchFiltersCard;
