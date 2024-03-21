import InformationCard from "@/components/lookup/people/InformationCard";
import getLocaleName from "@/utils/helpers/getLocaleName";
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/common";
import { PeriodContentItem } from "@/utils/types/schedule";
import { transition, useAnimationConfig } from "@suankularb-components/react";
import { motion } from "framer-motion";
import { useTranslation } from "next-i18next";

/**
 * The details of a single Subject in a Schedule Period.
 *
 * @param period The Period Content Item to display the details of.
 */
const SingleSubjectDetails: StylableFC<{
  period: PeriodContentItem;
}> = ({ period }) => {
  const locale = useLocale();
  const { t } = useTranslation("schedule", { keyPrefix: "atAGlance" });

  const { duration, easing } = useAnimationConfig();

  return (
    <motion.div
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
      <InformationCard title={t("details.room.title")}>
        {t("details.room.content", { rooms: period.rooms })}
      </InformationCard>
    </motion.div>
  );
};

export default SingleSubjectDetails;
