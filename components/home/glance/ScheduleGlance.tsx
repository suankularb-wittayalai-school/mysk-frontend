import Glance from "@/components/home/glance/Glance";
import GlanceAttendance from "@/components/home/glance/GlanceAttendance";
import GlanceCountdown from "@/components/home/glance/GlanceCountdown";
import GlancePeriods from "@/components/home/glance/GlanceSubjects";
import cn from "@/utils/helpers/cn";
import getLocaleString from "@/utils/helpers/getLocaleString";
import useScheduleGlance, {
  ScheduleGlanceType,
} from "@/utils/helpers/schedule/useScheduleGlance";
import useLocale from "@/utils/helpers/useLocale";
import { Classroom } from "@/utils/types/classroom";
import { StylableFC } from "@/utils/types/common";
import { UserRole } from "@/utils/types/person";
import { Schedule, SchedulePeriod } from "@/utils/types/schedule";
import {
  MaterialIcon,
  transition,
  useAnimationConfig,
} from "@suankularb-components/react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { Trans, useTranslation } from "next-i18next";
import { camel } from "radash";

/**
 * A Glance dynamically updated by the current and upcoming schedule items,
 * display the most relevant information to the user.
 *
 * @param schedule Data for displaying Schedule Glance.
 * @param role The user’s role. Used in determining the Schedule Glance view.
 * @param classroom The Classroom the user is in. Used for Attendance.
 */
const ScheduleGlance: StylableFC<{
  schedule: Schedule;
  role: UserRole;
  classroom?: Pick<Classroom, "number">;
}> = ({ schedule, role, classroom, style, className }) => {
  const locale = useLocale();
  const { t } = useTranslation("schedule", { keyPrefix: "atAGlance" });

  const { duration, easing } = useAnimationConfig();

  const { displayType, displayPeriod, classProgress, countdownMinutes } =
    useScheduleGlance(schedule, role);

  /**
   * The string to show in the Home Glance title representing the subject(s) of
   * the Schedule Period.
   *
   * @param period The Schedule Period to get the subject string from.
   *
   * @returns A string.
   */
  function getSubjectStringFromPeriod(period?: SchedulePeriod) {
    switch (period?.content.length) {
      case undefined:
      case 0:
        return null;
      case 1:
        return getLocaleString(period.content[0].subject.name, locale);
      default:
        return t("title.electiveSegment");
    }
  }

  return (
    <Glance
      // Display the banner if the display type is not `none`
      visible={displayType !== ScheduleGlanceType.none}
      style={style}
      className={cn(
        `relative isolate flex flex-col gap-3 bg-surface-5 p-4`,
        className,
      )}
    >
      {/* Class Progress Indicator */}
      <motion.div
        className={cn(`pointer-events-none absolute inset-0 right-auto
          -z-10 bg-surface-2`)}
        initial={{ width: `${classProgress}%` }}
        animate={{ width: `${classProgress}%` }}
        transition={transition(duration.medium2, easing.standard)}
      />

      {/* Lunch icon */}
      {displayType === "lunch" && (
        <MaterialIcon
          icon="fastfood"
          size={48}
          className="text-on-surface-variant"
        />
      )}

      <AnimatePresence initial={false} mode="popLayout">
        {/* Countdown */}
        <GlanceCountdown minutesLeft={countdownMinutes || 0} />

        {/* Title */}
        <motion.h2
          key={displayType}
          layout="position"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={transition(duration.medium4, easing.standard)}
          className="skc-text skc-text--headline-medium"
        >
          <Trans
            i18nKey={`atAGlance.title.${camel(displayType)}`}
            ns="schedule"
            values={{
              value:
                displayType === ScheduleGlanceType.teachTravel
                  ? displayPeriod?.content[0]?.rooms?.join(", ")
                  : getSubjectStringFromPeriod(displayPeriod),
            }}
          />
        </motion.h2>
      </AnimatePresence>

      {/* Subjects details */}
      <LayoutGroup>
        <AnimatePresence initial={false}>
          {["assembly", "homeroom"].includes(displayType) && classroom ? (
            <GlanceAttendance role={role} classroom={classroom} />
          ) : (
            displayPeriod && <GlancePeriods periods={displayPeriod.content} />
          )}
        </AnimatePresence>
      </LayoutGroup>
    </Glance>
  );
};

export default ScheduleGlance;
