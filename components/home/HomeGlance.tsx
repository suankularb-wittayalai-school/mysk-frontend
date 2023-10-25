// Imports
import AttendanceDialog from "@/components/classes/AttendanceDialog";
import GlanceAttendance from "@/components/home/GlanceAttendance";
import GlanceCountdown from "@/components/home/GlanceCountdown";
import GlancePeriods from "@/components/home/GlanceSubjects";
import cn from "@/utils/helpers/cn";
import getLocaleString from "@/utils/helpers/getLocaleString";
import getCurrentPeriod from "@/utils/helpers/schedule/getCurrentPeriod";
import getTodaySetToPeriodTime from "@/utils/helpers/schedule/getTodaySetToPeriodTime";
import useLocale from "@/utils/helpers/useLocale";
import useNow from "@/utils/helpers/useNow";
import { StylableFC } from "@/utils/types/common";
import { UserRole } from "@/utils/types/person";
import { Schedule, SchedulePeriod } from "@/utils/types/schedule";
import {
  MaterialIcon,
  transition,
  useAnimationConfig,
} from "@suankularb-components/react";
import {
  differenceInMinutes,
  differenceInSeconds,
  isFuture,
  isPast,
  isWithinInterval,
} from "date-fns";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { Trans, useTranslation } from "next-i18next";
import { camel, list } from "radash";
import { useMemo, useState } from "react";

/**
 * The start time of assembly.
 */
const ASSEMBLY_START: Parameters<Date["setHours"]> = [7, 30, 0, 0];

/**
 * The start time of homeroom.
 */
const HOMEROOM_START: Parameters<Date["setHours"]> = [8, 0, 0, 0];

/**
 * The start time of period 1.
 */
const PERIOD_START: Parameters<Date["setHours"]> = [8, 30, 0, 0];

/**
 * A glanceable banner dynamically updated by the current and upcoming schedule
 * items, display the most relevant information to the user.
 *
 * @param schedule Data for displaying Home Glance.
 * @param role The user’s role. Used in determining the Home Glance view.
 * @param classroomID The ID of the Classroom the user is in. Used for Attendance.
 * @param teacherID The Teacher ID of the user. Used for Attendance.
 */
const HomeGlance: StylableFC<{
  schedule: Schedule;
  role: UserRole;
  classroomID?: string;
  teacherID?: string;
}> = ({ schedule, role, classroomID, teacherID, style, className }) => {
  const locale = useLocale();
  const { t } = useTranslation("schedule", { keyPrefix: "atAGlance" });

  const { duration, easing } = useAnimationConfig();

  const now = useNow();

  // Determine relevant periods every second
  const periodNumber = useMemo(getCurrentPeriod, [now]);
  const todayRow = useMemo(
    () =>
      list(1, 5).includes(now.getDay())
        ? schedule.content[now.getDay() - 1].content
        : [],
    [schedule, now.getDay()],
  );

  const currentPeriod = useMemo(
    () =>
      todayRow.find(
        (period) =>
          // The period starts before or at the current period
          period.start_time <= periodNumber &&
          // The period ends at or after the end of the current period (current
          // period number + 1)
          period.start_time + period.duration > periodNumber,
      ),
    [todayRow],
  );

  const immediateNextPeriod = useMemo(
    () =>
      todayRow.find(
        // The period starts at the next period
        (period) => periodNumber + 1 === period.start_time,
      ),
    [todayRow],
  );
  const todayNextPeriod = useMemo(
    () =>
      todayRow.filter(
        // The period starts at any period after the current
        (period) => period.content.length && period.start_time > periodNumber,
      )[0],
    [todayRow],
  );

  // Note: `differenceInSeconds` and `differenceInMinutes` operate by
  // [first param] - [second param]

  // The edges of periods relative to current time, used in calculating the
  // display type
  const secondsSinceStart = isFuture(new Date().setHours(...PERIOD_START))
    ? differenceInSeconds(
        now,
        isPast(new Date().setHours(...HOMEROOM_START))
          ? new Date().setHours(...HOMEROOM_START)
          : new Date().setHours(...ASSEMBLY_START),
      )
    : currentPeriod?.content.length
    ? differenceInSeconds(
        now,
        getTodaySetToPeriodTime(currentPeriod.start_time),
      )
    : 0;
  const minutesTilEnd = currentPeriod
    ? differenceInMinutes(
        getTodaySetToPeriodTime(
          currentPeriod.start_time + currentPeriod.duration - 1,
          "end",
        ),
        now,
        { roundingMethod: "ceil" },
      )
    : null;
  const minutesTilImmediateNext = immediateNextPeriod?.content.length
    ? differenceInMinutes(
        getTodaySetToPeriodTime(immediateNextPeriod.start_time),
        now,
        { roundingMethod: "ceil" },
      )
    : null;
  const minutesTilTodayNext = todayNextPeriod?.content.length
    ? differenceInMinutes(
        getTodaySetToPeriodTime(todayNextPeriod.start_time),
        now,
        { roundingMethod: "ceil" },
      )
    : null;

  // A percentage of time since the start of the class relative to the total
  // class duration
  const classProgress =
    (secondsSinceStart / ((currentPeriod?.duration || 1) * 50 * 60)) * 100;

  /**
   * The type of Home Glance to display to the user, calculated by the current
   * and upcoming schedule items to be the most relevant.
   */
  const displayType:
    | "assembly"
    | "homeroom"
    | "learn-current"
    | "learn-next"
    | "lunch"
    | "teach-current"
    | "teach-wrap-up"
    | "teach-travel"
    | "teach-future"
    | "none" =
    // If it’s between 07:30 and 08:00, display that it’s assembly time
    isWithinInterval(new Date(), {
      start: new Date().setHours(7, 30, 0, 0),
      end: new Date().setHours(8, 0, 0, 0),
    })
      ? "assembly"
      : // If it’s between 08:00 and 08:30, display that it’s homeroom time
      isWithinInterval(new Date(), {
          start: new Date().setHours(8, 0, 0, 0),
          end: new Date().setHours(8, 30, 0, 0),
        })
      ? "homeroom"
      : !todayRow.length
      ? "none"
      : role === "teacher"
      ? // If the teacher is free and it’s 5 minutes before the next class
        // starts, they are instructed to travel
        minutesTilImmediateNext &&
        minutesTilImmediateNext >= 0 &&
        minutesTilImmediateNext <= 5
        ? "teach-travel"
        : // If the teacher is free and the next class is far away, show a
        //   countdown
        todayNextPeriod?.content.length && !currentPeriod?.content.length
        ? "teach-future"
        : // If the teacher is teaching and it’s 10 minutes until it’s over,
        //   they are intructed to wrap the class up
        currentPeriod?.content.length &&
          minutesTilEnd &&
          minutesTilEnd >= 0 &&
          minutesTilEnd <= 10
        ? "teach-wrap-up"
        : // If the teacher is teaching, display the current class
        currentPeriod?.content.length
        ? "teach-current"
        : "none"
      : role === "student"
      ? // If it’s 10 minutes before the next class, display that class
        minutesTilImmediateNext &&
        minutesTilImmediateNext >= 0 &&
        minutesTilImmediateNext <= 10
        ? "learn-next"
        : // If the student is in class, display that class
        currentPeriod?.content.length
        ? "learn-current"
        : // If the student is free and it’s a lunch period, display that it’s
        //   lunch
        [4, 5].includes(periodNumber)
        ? "lunch"
        : "none"
      : "none";

  const displayPeriod = ["learn-next", "teach-travel"].includes(displayType)
    ? immediateNextPeriod
    : displayType === "teach-future"
    ? todayNextPeriod
    : currentPeriod;

  const [attendanceOpen, setAttendanceOpen] = useState(false);

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
    <AnimatePresence initial={false}>
      {
        // Display the banner if the display type is not `none`
        displayType !== "none" && (
          <motion.div
            layout
            layoutRoot
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transition(duration.medium4, easing.standard)}
            style={{ borderRadius: 28, ...style }}
            className={cn(
              `relative isolate mx-4 flex flex-col gap-3 overflow-hidden
              rounded-xl border-1 border-outline-variant bg-surface-5 p-4
              sm:mx-0`,
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
              <GlanceCountdown
                minutesLeft={
                  (["teach-travel", "teach-future"].includes(displayType)
                    ? minutesTilTodayNext
                    : ["teach-next", "learn-next"].includes(displayType)
                    ? minutesTilImmediateNext
                    : minutesTilEnd) || 0
                }
              />

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
                    value: {
                      assembly: undefined,
                      homeroom: undefined,
                      "learn-current":
                        getSubjectStringFromPeriod(currentPeriod),
                      "learn-next":
                        getSubjectStringFromPeriod(immediateNextPeriod),
                      lunch: undefined,
                      "teach-current":
                        getSubjectStringFromPeriod(currentPeriod),
                      "teach-wrap-up":
                        getSubjectStringFromPeriod(currentPeriod),
                      "teach-travel":
                        immediateNextPeriod?.content[0]?.rooms?.join(", "),
                      "teach-future":
                        getSubjectStringFromPeriod(todayNextPeriod),
                    }[displayType],
                  }}
                />
              </motion.h2>
            </AnimatePresence>

            {/* Subjects details */}
            <LayoutGroup>
              <AnimatePresence initial={false}>
                {["assembly", "homeroom"].includes(displayType) &&
                (role === "student" || (role === "teacher" && classroomID)) ? (
                  <GlanceAttendance
                    role={role}
                    onOpen={() => setAttendanceOpen(true)}
                  />
                ) : (
                  displayPeriod && (
                    <GlancePeriods periods={displayPeriod.content} />
                  )
                )}
              </AnimatePresence>
            </LayoutGroup>
          </motion.div>
        )
      }

      {/* Attendance dialog */}
      {classroomID && ["assembly", "homeroom"].includes(displayType) && (
        <AttendanceDialog
          key={displayType}
          event={displayType as "assembly" | "homeroom"}
          classroomID={classroomID}
          teacherID={teacherID}
          open={attendanceOpen}
          onClose={() => setAttendanceOpen(false)}
        />
      )}
    </AnimatePresence>
  );
};

export default HomeGlance;
