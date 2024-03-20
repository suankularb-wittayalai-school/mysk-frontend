import Glance from "@/components/home/glance/Glance";
import GlanceAttendance from "@/components/home/glance/GlanceAttendance";
import ScheduleGlanceCountdown from "@/components/home/glance/ScheduleGlanceCountdown";
import GlancePeriods from "@/components/home/glance/GlanceSubjects";
import ScheduleGlanceTitle from "@/components/home/glance/ScheduleGlanceTitle";
import cn from "@/utils/helpers/cn";
import useScheduleGlance, {
  ScheduleGlanceType,
} from "@/utils/helpers/schedule/useScheduleGlance";
import { Classroom } from "@/utils/types/classroom";
import { StylableFC } from "@/utils/types/common";
import { UserRole } from "@/utils/types/person";
import { Schedule } from "@/utils/types/schedule";
import {
  Progress,
  Text,
  transition,
  useAnimationConfig,
} from "@suankularb-components/react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";

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
  const { duration, easing } = useAnimationConfig();

  const { displayType, displayPeriod, classProgress, countdownMinutes } =
    useScheduleGlance(schedule, role);

  return (
    <Glance
      // Display the banner if the display type is not `none`
      visible={displayType !== ScheduleGlanceType.none}
      style={style}
      className={cn(`flex flex-col gap-3 p-4`, className)}
    >
      {/* Title */}
      <ScheduleGlanceTitle
        displayType={displayType}
        displayPeriod={displayPeriod}
      />

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

      <Text
        type="title-small"
        element="div"
        className="-mb-1 flex flex-row justify-between"
      >
        {/* Countdown */}
        <ScheduleGlanceCountdown minutesLeft={countdownMinutes || 0} />
      </Text>

      {/* Class Progress Indicator */}
      <Progress
        appearance="linear"
        alt="Class progress"
        value={classProgress}
        visible
      />
    </Glance>
  );
};

export default ScheduleGlance;
