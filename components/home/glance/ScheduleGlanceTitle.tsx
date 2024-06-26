import cn from "@/utils/helpers/cn";
import getLocaleString from "@/utils/helpers/getLocaleString";
import { ScheduleGlanceType } from "@/utils/helpers/schedule/useScheduleGlance";
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/common";
import { SchedulePeriod } from "@/utils/types/schedule";
import { MaterialIcon, Text } from "@suankularb-components/react";
import useTranslation from "next-translate/useTranslation";
import { camel } from "radash";
import Balancer from "react-wrap-balancer";

/**
 * The title of the Schedule Glance.
 *
 * @param displayType The type of Schedule Glance.
 * @param displayPeriod The Schedule Period that is referenced in the title.
 */
const ScheduleGlanceTitle: StylableFC<{
  displayType: ScheduleGlanceType;
  displayPeriod?: SchedulePeriod;
}> = ({ displayType, displayPeriod, style, className }) => {
  const locale = useLocale();
  const { t } = useTranslation("home/glance/schedule");

  /**
   * Value to pass to the translation function for the title.
   */
  const value = (() => {
    // If the display type is `teachTravel`, return the room number.
    if (displayType === ScheduleGlanceType.teachTravel)
      return displayPeriod?.content[0]?.rooms?.join(", ");
    // If the display period has a subject, return the subject name.
    else if (displayPeriod?.content.length)
      return getLocaleString(displayPeriod.content[0].subject.name, locale);
    else return null;
  })();

  return (
    <div style={style} className={cn(`space-y-0.5`, className)}>
      <div
        className={cn(`flex flex-row items-start gap-2 [&_.skc-icon]:my-1
          [&_.skc-icon]:text-on-surface-variant`)}
      >
        {/* Icon */}
        {(() => {
          switch (displayType) {
            case ScheduleGlanceType.lunch:
              return <MaterialIcon icon="lunch_dining" />;
            case ScheduleGlanceType.assembly:
              return <MaterialIcon icon="flag" />;
            case ScheduleGlanceType.homeroom:
              return <MaterialIcon icon="meeting_room" />;
          }
        })()}

        {/* Text */}
        <Text type="headline-small" element="h2">
          <Balancer>
            {t(`title.${camel(displayType)}`, {
              value,
              count: displayPeriod?.content.length,
            })}
          </Balancer>
        </Text>
      </div>

      {/* Subject code */}
      {displayPeriod?.content.length === 1 && (
        <Text
          type="title-medium"
          element="p"
          className="text-on-surface-variant"
        >
          {getLocaleString(displayPeriod.content[0].subject.code, locale)}
        </Text>
      )}
    </div>
  );
};

export default ScheduleGlanceTitle;
