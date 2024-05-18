import AttendanceButton from "@/components/home/glance/AttendanceButton";
import ElectiveGrid from "@/components/home/glance/ElectiveGrid";
import Glance from "@/components/home/glance/Glance";
import ScheduleGlanceCountdown from "@/components/home/glance/ScheduleGlanceCountdown";
import ScheduleGlanceInterval from "@/components/home/glance/ScheduleGlanceInterval";
import ScheduleGlanceTitle from "@/components/home/glance/ScheduleGlanceTitle";
import SingleSubjectDetails from "@/components/home/glance/SingleSubjectDetails";
import cn from "@/utils/helpers/cn";
import useScheduleGlance, {
  ScheduleGlanceType,
} from "@/utils/helpers/schedule/useScheduleGlance";
import { AttendanceEvent } from "@/utils/types/attendance";
import { Classroom } from "@/utils/types/classroom";
import { StylableFC } from "@/utils/types/common";
import { UserRole } from "@/utils/types/person";
import { Schedule } from "@/utils/types/schedule";
import {
  DURATION,
  EASING,
  Progress,
  Text,
  transition,
} from "@suankularb-components/react";
import { AnimatePresence, motion } from "framer-motion";
import useTranslation from "next-translate/useTranslation";

/**
 * A Glance dynamically updated by the current and upcoming schedule items,
 * display the most relevant information to the user.
 *
 * @param schedule Data for displaying Schedule Glance.
 * @param role The user’s role. Used in determining the Schedule Glance view.
 * @param studentID The Student’s database ID. Used in fetching Attendance.
 * @param classroom The Classroom the user is in. Used for linking Attendance.
 */
const ScheduleGlance: StylableFC<{
  schedule: Schedule;
  role: UserRole;
  studentID?: string;
  classroom?: Pick<Classroom, "number">;
}> = ({ schedule, role, studentID, classroom, style, className }) => {
  const { t } = useTranslation("glance/schedule");

  const {
    displayType,
    displayPeriod,
    classProgress,
    countdownMinutes,
    interval,
  } = useScheduleGlance(schedule, role);

  const isAttendanceButtonShown =
    [ScheduleGlanceType.assembly, ScheduleGlanceType.homeroom].includes(
      displayType,
    ) && classroom !== undefined;

  return (
    <Glance
      // Display the banner if the display type is not `none`
      visible={displayType !== ScheduleGlanceType.none}
      style={style}
      className={cn(`flex flex-col gap-3 p-4 pt-3`, className)}
    >
      <motion.div
        key={
          displayPeriod?.id
            ? displayPeriod.id + displayPeriod.content.length
            : displayType
        }
        layout="position"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={transition(DURATION.medium4, EASING.standard)}
        className={
          displayPeriod?.content.length === 1
            ? `grid-cols-2 items-start gap-2 space-y-3 md:grid md:space-y-0`
            : undefined
        }
      >
        {/* Title */}
        <ScheduleGlanceTitle
          displayType={displayType}
          displayPeriod={displayPeriod}
        />

        {/* Subject details (singular) */}
        {displayPeriod && displayPeriod.content.length === 1 && (
          <SingleSubjectDetails period={displayPeriod.content[0]} />
        )}
      </motion.div>

      {displayPeriod && displayPeriod.content.length > 1 && (
        <ElectiveGrid period={displayPeriod} />
      )}

      <motion.div
        layout="position"
        layoutId="glance-footer"
        transition={transition(DURATION.medium4, EASING.standard)}
        className="space-y-1.5"
      >
        <Text
          type="title-small"
          element="div"
          className="flex flex-row items-end justify-between"
        >
          {/* Interval */}
          <AnimatePresence initial={false}>
            {interval && <ScheduleGlanceInterval interval={interval} />}
          </AnimatePresence>

          {isAttendanceButtonShown ? (
            // Attendance Button
            <AttendanceButton
              role={role}
              attendanceEvent={displayType as AttendanceEvent}
              studentID={studentID}
              classroom={classroom}
              className="!mb-0.5 md:!-mt-6"
            />
          ) : (
            // Countdown
            <ScheduleGlanceCountdown minutesLeft={countdownMinutes || 0} />
          )}
        </Text>

        {/* Class Progress Indicator */}
        <Progress
          appearance="linear"
          alt={t("progressAlt")}
          value={classProgress}
          visible
        />
      </motion.div>
    </Glance>
  );
};

export default ScheduleGlance;
