// Imports
import GlanceAttendance from "@/components/home/GlanceAttendance";
import GlanceCountdown from "@/components/home/GlanceCountdown";
import GlancePeriods from "@/components/home/GlanceSubjects";
import cn from "@/utils/helpers/cn";
import getLocaleString from "@/utils/helpers/getLocaleString";
import getCurrentPeriod from "@/utils/helpers/schedule/getCurrentPeriod";
import getCurrentSchoolSessionState, {
  ASSEMBLY_START,
  HOMEROOM_START,
  SCHEDULE_START,
  SchoolSessionState,
} from "@/utils/helpers/schedule/getCurrentSchoolSessionState";
import getTodaySetToPeriodTime from "@/utils/helpers/schedule/getTodaySetToPeriodTime";
import useLocale from "@/utils/helpers/useLocale";
import useNow from "@/utils/helpers/useNow";
import within from "@/utils/helpers/within";
import { AttendanceEvent } from "@/utils/types/attendance";
import { Classroom } from "@/utils/types/classroom";
import { StylableFC } from "@/utils/types/common";
import { UserRole } from "@/utils/types/person";
import { Schedule, SchedulePeriod } from "@/utils/types/schedule";
import {
  MaterialIcon,
  transition,
  useAnimationConfig,
} from "@suankularb-components/react";
import { differenceInMinutes, differenceInSeconds } from "date-fns";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { Trans, useTranslation } from "next-i18next";
import { camel, list } from "radash";
import { useMemo } from "react";

/**
 * A glanceable banner dynamically updated by the current and upcoming schedule
 * items, display the most relevant information to the user.
 *
 * @param schedule Data for displaying Home Glance.
 * @param role The user’s role. Used in determining the Home Glance view.
 * @param classroom The Classroom the user is in. Used for Attendance.
 */
const HomeGlance: StylableFC<{
  schedule: Schedule;
  role: UserRole;
  classroom?: Pick<Classroom, "number">;
}> = ({ schedule, role, classroom, style, className }) => {
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
    [todayRow, periodNumber],
  );

  const immediateNextPeriod = useMemo(
    () =>
      todayRow.find(
        // The period starts at the next period
        (period) => periodNumber + 1 === period.start_time,
      ),
    [todayRow, periodNumber],
  );
  const todayNextPeriod = useMemo(
    () =>
      todayRow.filter(
        // The period starts at any period after the current
        (period) => period.content.length && period.start_time > periodNumber,
      )[0],
    [todayRow, periodNumber],
  );

  // Note: `differenceInSeconds` and `differenceInMinutes` operate by
  // [first param] - [second param]

  const schoolSessionState = getCurrentSchoolSessionState();

  /**
   * The current Attendance Event, if any.
   */
  const attendanceEvent = [
    SchoolSessionState.assembly,
    SchoolSessionState.homeroom,
  ].includes(schoolSessionState)
    ? (schoolSessionState as AttendanceEvent)
    : null;

  // The edges of periods relative to current time, used in calculating the
  // display type.

  /**
   * The number of seconds since the start of the current period. This is used
   * to calculate the {@link classProgress class progress}.
   *
   * Also support assembly and homeroom.
   */
  const secondsSinceStart = attendanceEvent
    ? differenceInSeconds(
        now,
        {
          assembly: new Date().setHours(...ASSEMBLY_START),
          homeroom: new Date().setHours(...HOMEROOM_START),
        }[attendanceEvent],
      )
    : currentPeriod
      ? differenceInSeconds(
          now,
          getTodaySetToPeriodTime(currentPeriod.start_time),
        )
      : 0;

  /**
   * The number of minutes until the end of the current period.
   *
   * Also support assembly and homeroom.
   */
  const minutesTilEnd = attendanceEvent
    ? differenceInMinutes(
        {
          assembly: new Date().setHours(...HOMEROOM_START),
          homeroom: new Date().setHours(...SCHEDULE_START),
        }[attendanceEvent],
        now,
        { roundingMethod: "ceil" },
      )
    : currentPeriod
      ? differenceInMinutes(
          getTodaySetToPeriodTime(
            currentPeriod.start_time + currentPeriod.duration - 1,
            "end",
          ),
          now,
          { roundingMethod: "ceil" },
        )
      : null;

  /**
   * The number of minutes until the start of the immediate next period.
   *
   * If there is no period immediately after the current period, this is `null`.
   */
  const minutesTilImmediateNext = immediateNextPeriod?.content.length
    ? differenceInMinutes(
        getTodaySetToPeriodTime(immediateNextPeriod.start_time),
        now,
        { roundingMethod: "ceil" },
      )
    : null;

  /**
   * The number of minutes until the start of the next period of the day,
   * regardless of whether it’s immediately after the current period or not.
   */
  const minutesTilTodayNext = todayNextPeriod?.content.length
    ? differenceInMinutes(
        getTodaySetToPeriodTime(todayNextPeriod.start_time),
        now,
        { roundingMethod: "ceil" },
      )
    : null;

  /**
   * A percentage of time since the start of the class relative to the total
   * class duration.
   */
  const classProgress =
    (secondsSinceStart /
      // If there is a current period, use the duration of that period
      // (A period is 50 minutes long)
      ((schoolSessionState === SchoolSessionState.schedule
        ? (currentPeriod?.duration || 1) * 50
        : // Assembly and homeroom are each 30 minutes long
          30) *
        // There are 60 seconds in a minute
        60)) *
    // Convert decimal to percentage
    100;

  /**
   * The type of Home Glance to display to the user, calculated by the current
   * and upcoming schedule items to be the most relevant.
   */
  const displayType = (() => {
    // If it’s assembly or homeroom, display that
    if (attendanceEvent) return attendanceEvent;

    // If there are no periods today, don’t display anything
    if (!todayRow.length) return "none";

    switch (role) {
      case UserRole.student:
        // If it’s 5 minutes before the next class, display that class
        if (minutesTilImmediateNext && within(minutesTilImmediateNext, 0, 5))
          return "learn-next";

        // If the student is in class, display that class
        if (currentPeriod?.content.length) return "learn-current";

        // If the student is free and it’s a lunch period, display that it’s
        // lunch
        if ([4, 5].includes(periodNumber)) return "lunch";

        break;
      case UserRole.teacher:
        // If the teacher is free and it’s 5 minutes before the next class
        // starts, they are instructed to travel
        if (minutesTilImmediateNext && within(minutesTilImmediateNext, 0, 5))
          return "teach-travel";

        // If the teacher is free and the next class is far away, show a
        // countdown
        if (
          todayNextPeriod?.content.length &&
          !currentPeriod?.content.length &&
          schoolSessionState === SchoolSessionState.schedule
        )
          return "teach-future";

        // If the teacher is teaching and it’s 10 minutes until it’s over, they
        // are intructed to wrap the class up
        if (
          currentPeriod?.content.length &&
          minutesTilEnd &&
          within(minutesTilEnd, 0, 10)
        )
          return "teach-wrap-up";

        // If the teacher is teaching, display the current class
        if (currentPeriod?.content.length) return "teach-current";

        break;
    }
    return "none";
  })();

  /**
   * The period to display in the Home Glance.
   */
  const displayPeriod = ["learn-next", "teach-travel"].includes(displayType)
    ? immediateNextPeriod
    : displayType === "teach-future"
      ? todayNextPeriod
      : currentPeriod;

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
                {["assembly", "homeroom"].includes(displayType) && classroom ? (
                  <GlanceAttendance role={role} classroom={classroom} />
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
    </AnimatePresence>
  );
};

export default HomeGlance;
