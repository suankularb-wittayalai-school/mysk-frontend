import HoverList from "@/components/person/HoverList";
import ScheduleContext from "@/contexts/ScheduleContext";
import getLocaleString from "@/utils/helpers/getLocaleString";
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
import { useTranslation } from "next-i18next";
import { FC, useContext } from "react";

/**
 * Text in Subject Period.
 * 
 * @param period The Period Content Item to display.
 */
const SubjectPeriodText: FC<{ period: PeriodContentItem }> = ({ period }) => {
  const locale = useLocale();
  const { t } = useTranslation("schedule");

  const { view, editable } = useContext(ScheduleContext);

  return (
    <>
      {view === UserRole.teacher ? (
        <motion.span
          layoutId={editable ? `period-${period.id}-class` : undefined}
          transition={transition(DURATION.short2, EASING.standardDecelerate)}
          className="skc-text skc-text--title-medium !w-fit"
        >
          {t("class", {
            ns: "common",
            number: period.classrooms?.map(({ number }) => number).join(),
          })}
        </motion.span>
      ) : (
        <Text
          type="title-medium"
          element={(props) => (
            <span
              {...props}
              title={
                view === UserRole.student
                  ? getLocaleString(period.subject.name, locale)
                  : undefined
              }
            />
          )}
        >
          {formatSubjectPeriodName(period.duration, period.subject, locale)}
        </Text>
      )}

      {/* Teacher / subject name */}
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
