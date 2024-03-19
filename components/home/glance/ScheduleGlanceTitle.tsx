import cn from "@/utils/helpers/cn";
import getLocaleString from "@/utils/helpers/getLocaleString";
import { ScheduleGlanceType } from "@/utils/helpers/schedule/useScheduleGlance";
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/common";
import { SchedulePeriod } from "@/utils/types/schedule";
import {
  MaterialIcon,
  Text,
  transition,
  useAnimationConfig,
} from "@suankularb-components/react";
import { motion } from "framer-motion";
import { Trans } from "next-i18next";
import { camel } from "radash";

/**
 * The title of the Schedule Glance.
 *
 * @param displayType The type of Schedule Glance.
 * @param displayPeriod The Schedule Period that is referenced in the title.
 */
const ScheduleGlanceTitle: StylableFC<{
  displayType: ScheduleGlanceType;
  displayPeriod?: SchedulePeriod;
}> = ({ displayType, displayPeriod }) => {
  const locale = useLocale();

  const { duration, easing } = useAnimationConfig();

  return (
    <motion.div
      key={displayType}
      layout="position"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={transition(duration.medium4, easing.standard)}
      className={cn(`flex flex-row items-start gap-1
        [&_.skc-icon]:my-1 [&_.skc-icon]:text-on-surface-variant`)}
    >
      {/* Icon */}
      {
        (
          {
            [ScheduleGlanceType.lunch]: <MaterialIcon icon="lunch_dining" />,
            [ScheduleGlanceType.assembly]: <MaterialIcon icon="flag" />,
            [ScheduleGlanceType.homeroom]: <MaterialIcon icon="meeting_room" />,
          } as { [key in ScheduleGlanceType]: JSX.Element }
        )[displayType]
      }

      {/* Text */}
      <Text type="headline-small" element="h2">
        <Trans
          i18nKey={`atAGlance.title.${camel(displayType)}`}
          ns="schedule"
          values={{
            value: (() => {
              if (displayType === ScheduleGlanceType.teachTravel)
                return displayPeriod?.content[0]?.rooms?.join(", ");
              else if (displayPeriod?.content.length)
                return getLocaleString(
                  displayPeriod.content[0].subject.name,
                  locale,
                );
              else return null;
            })(),
          }}
        />
      </Text>
    </motion.div>
  );
};

export default ScheduleGlanceTitle;
