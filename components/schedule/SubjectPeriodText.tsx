import HoverList from "@/components/person/HoverList";
import ScheduleContext from "@/contexts/ScheduleContext";
import { formatSubjectPeriodName } from "@/utils/helpers/schedule/formatSubjectPeriodName";
import useLocale from "@/utils/helpers/useLocale";
import { UserRole } from "@/utils/types/person";
import { PeriodContentItem } from "@/utils/types/schedule";
import {
  DURATION,
  EASING,
  Text,
  transition,
} from "@suankularb-components/react";
import { motion } from "framer-motion";
import useTranslation from "next-translate/useTranslation";
import { FC, useContext } from "react";

/**
 * Text in Subject Period.
 *
 * @param period The Period Content Item to display.
 */
const SubjectPeriodText: FC<{ period: PeriodContentItem }> = ({ period }) => {
  const locale = useLocale();
  const { t } = useTranslation("common");

  const { view, editable } = useContext(ScheduleContext);

  return (
    <>
      {/* Subject name / Classroom */}
      <motion.span
        layoutId={editable ? `period-${period.id}-class` : undefined}
        transition={transition(DURATION.short2, EASING.standardDecelerate)}
        className="skc-text skc-text--title-medium truncate"
      >
        {view === UserRole.teacher
          ? t("class", {
              number: period.classrooms
                ?.map(({ number }) => number)
                .sort((a, b) => a - b)
                .join(),
            })
          : formatSubjectPeriodName(period.duration, period.subject, locale)}
      </motion.span>

      {/* Teacher / Subject name */}
      <Text type="body-small">
        {view === UserRole.teacher ? (
          formatSubjectPeriodName(period.duration, period.subject, locale)
        ) : (
          <HoverList people={period.teachers} />
        )}
      </Text>
    </>
  );
};

export default SubjectPeriodText;
