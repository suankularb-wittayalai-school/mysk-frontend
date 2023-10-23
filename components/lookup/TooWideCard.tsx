// Imports
import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import {
  transition,
  CardHeader,
  MaterialIcon,
  useAnimationConfig,
} from "@suankularb-components/react";
import { motion } from "framer-motion";
import { useTranslation } from "next-i18next";

/**
 * The maximum number of results the fetch can produce.
 */
const MAXIMUM_RESULTS_LENGTH = 100;

/**
 * This Card displays when the given Search Filters are too wide and some
 * results have to be omitted.
 * 
 * @param length The length of the fetched results.
 */
const TooWideCard: StylableFC<{
  length: number;
}> = ({ length, style, className }) => {
  const { t } = useTranslation("lookup", { keyPrefix: "common.list.tooWide" });

  const { duration, easing } = useAnimationConfig();

  return (
    // If the cap is reached, there are likely omitted results
    length === MAXIMUM_RESULTS_LENGTH ? (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: [0, 1, 1], scale: [0.8, 1.05, 1] }}
        transition={{
          ...transition(duration.medium4, easing.standardDecelerate),
          delay: duration.long4,
        }}
        style={style}
        className={cn(
          `mt-2 rounded-sm bg-error-container
        text-on-error-container`,
          className,
        )}
      >
        <CardHeader
          icon={
            <MaterialIcon icon="warning" className="!text-on-error-container" />
          }
          title={t("title")}
          subtitle={t("subtitle")}
        />
      </motion.div>
    ) : null
  );
};

export default TooWideCard;
