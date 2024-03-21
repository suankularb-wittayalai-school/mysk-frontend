import Glance from "@/components/home/glance/Glance";
import GlanceAttendance from "@/components/home/glance/GlanceAttendance";
import SingleSubjectDetails from "@/components/home/glance/SingleSubjectDetails";
import ScheduleGlanceCountdown from "@/components/home/glance/ScheduleGlanceCountdown";
import ScheduleGlanceInterval from "@/components/home/glance/ScheduleGlanceInterval";
import ScheduleGlanceTitle from "@/components/home/glance/ScheduleGlanceTitle";
import cn from "@/utils/helpers/cn";
import useScheduleGlance, {
  ScheduleGlanceType,
} from "@/utils/helpers/schedule/useScheduleGlance";
import { Classroom } from "@/utils/types/classroom";
import { StylableFC } from "@/utils/types/common";
import { UserRole } from "@/utils/types/person";
import { Schedule } from "@/utils/types/schedule";
import { Progress, Text } from "@suankularb-components/react";
import { AnimatePresence, LayoutGroup } from "framer-motion";
import { useTranslation } from "next-i18next";

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
  const { t } = useTranslation("schedule", { keyPrefix: "atAGlance" });

  const {
    displayType,
    displayPeriod,
    classProgress,
    countdownMinutes,
    interval,
  } = useScheduleGlance(schedule, role);

  return (
    <Glance
      // Display the banner if the display type is not `none`
      visible={displayType !== ScheduleGlanceType.none}
      style={style}
      className={cn(`flex flex-col gap-3 p-4`, className)}
    >
      <div className="contents grid-cols-2 gap-2 md:grid">
        {/* Title */}
        <ScheduleGlanceTitle
          displayType={displayType}
          displayPeriod={displayPeriod}
        />

        {/* Subject details (singular) */}
        {displayPeriod && displayPeriod.content.length === 1 && (
          <SingleSubjectDetails period={displayPeriod.content[0]} />
        )}
      </div>

      <Text
        type="title-small"
        element="div"
        className="-mb-1.5 flex flex-row justify-between"
      >
        {/* Interval */}
        <AnimatePresence initial={false}>
          {interval && <ScheduleGlanceInterval interval={interval} />}
        </AnimatePresence>

        {/* Countdown */}
        <ScheduleGlanceCountdown minutesLeft={countdownMinutes || 0} />
      </Text>

      {/* Class Progress Indicator */}
      <Progress
        appearance="linear"
        alt={t("progressAlt")}
        value={classProgress}
        visible
      />
    </Glance>
  );
};

export default ScheduleGlance;
