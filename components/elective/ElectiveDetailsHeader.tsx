import cn from "@/utils/helpers/cn";
import getLocaleString from "@/utils/helpers/getLocaleString";
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/common";
import { ElectiveSubject } from "@/utils/types/elective";
import {
  AssistChip,
  ChipSet,
  DURATION,
  EASING,
  MaterialIcon,
  Text,
  transition,
} from "@suankularb-components/react";
import { motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import Balancer from "react-wrap-balancer";

/**
 * The header of an Elective Details Card, including the name and syllabus of
 * the Elective Subject.
 *
 * @param electiveSubject The Elective Subject to display.
 */
const ElectiveDetailsHeader: StylableFC<{
  electiveSubject: ElectiveSubject;
}> = ({ electiveSubject, style, className }) => {
  const locale = useLocale();
  const { t } = useTranslation("elective", { keyPrefix: "detail.information" });

  const [syllabusOpen, setSyllabusOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={transition(DURATION.medium2, EASING.standard)}
      style={style}
      className={cn(
        `flex flex-col gap-1 p-4 sm:flex-row sm:items-center sm:px-6 sm:py-3`,
        className,
      )}
    >
      <Text type="headline-small" element="h2" className="sm:grow sm:pt-1.5">
        <Balancer>{getLocaleString(electiveSubject.name, locale)}</Balancer>
      </Text>
      <AssistChip icon={<MaterialIcon icon="book" />}>
        {t("action.seeSyllabus")}
      </AssistChip>
    </motion.div>
  );
};

export default ElectiveDetailsHeader;
