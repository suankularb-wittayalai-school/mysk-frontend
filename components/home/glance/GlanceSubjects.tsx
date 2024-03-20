// Imports
import InformationCard from "@/components/lookup/people/InformationCard";
import getLocaleName from "@/utils/helpers/getLocaleName";
import getLocaleString from "@/utils/helpers/getLocaleString";
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/common";
import { PeriodContentItem } from "@/utils/types/schedule";
import { transition, useAnimationConfig } from "@suankularb-components/react";
import { motion } from "framer-motion";
import { useTranslation } from "next-i18next";

/**
 * Subject details for Home Glance.
 *
 * @param periods The content of the most relevant Schedule Period.
 */
const GlancePeriods: StylableFC<{
  periods: PeriodContentItem[];
}> = ({ periods }) => {
  const locale = useLocale();
  const { t } = useTranslation("schedule", { keyPrefix: "atAGlance" });

  const { duration, easing } = useAnimationConfig();

  return (
    <motion.ul layout="position" role="list" className="contents">
      {periods.map((period) => (
        <motion.li
          key={period.id}
          layout="position"
          layoutId={`subject-${period.id}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={transition(duration.medium4, easing.standard)}
          className="grid grid-cols-2 gap-2"
        >
          {/* Teachers */}
          <InformationCard title={t("details.teachers.title")}>
            {t("details.teachers.content", {
              teachers: period.teachers.map((teacher) =>
                getLocaleName(locale, teacher, { prefix: "teacher" }),
              ),
            })}
          </InformationCard>

          {/* Room */}
          {periods.find((period) => period.rooms?.find((room) => room)) && (
            <InformationCard title={t("details.room.title")}>
              {t("details.room.content", { rooms: period.rooms })}
            </InformationCard>
          )}
        </motion.li>
      ))}
    </motion.ul>
  );
};

export default GlancePeriods;
