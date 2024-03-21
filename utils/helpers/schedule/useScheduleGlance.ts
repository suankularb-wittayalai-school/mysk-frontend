import getCurrentPeriod from "@/utils/helpers/schedule/getCurrentPeriod";
import getCurrentSchoolSessionState, {
  ASSEMBLY_START,
  HOMEROOM_START,
  SCHEDULE_START,
  SchoolSessionState,
} from "@/utils/helpers/schedule/getCurrentSchoolSessionState";
import getTodaySetToPeriodTime from "@/utils/helpers/schedule/getTodaySetToPeriodTime";
import useNow from "@/utils/helpers/useNow";
import within from "@/utils/helpers/within";
import { AttendanceEvent } from "@/utils/types/attendance";
import { UserRole } from "@/utils/types/person";
import { Schedule } from "@/utils/types/schedule";
import { differenceInMinutes, differenceInSeconds, isWeekend } from "date-fns";
import { list, mapValues } from "radash";
import { useMemo } from "react";

export enum ScheduleGlanceType {
  none = "none",
  assembly = "assembly",
  homeroom = "homeroom",
  learnCurrent = "learn-current",
  learnNext = "learn-next",
  lunch = "lunch",
  teachCurrent = "teach-current",
  teachFuture = "teach-future",
  teachTravel = "teach-travel",
  teachWrapUp = "teach-wrap-up",
}

/**
 * A hook calculating the Schedule Glance display type and relevant information.
 *
 * @param schedule Data for displaying Schedule Glance.
 * @param role The user’s role. Used in determining the Schedule Glance view.
 *
 * @note This hook was created because Schedule Glance was getting unreadable. But it seems I just moved the unreadable code to another file.
 */
export default function useScheduleGlance(schedule: Schedule, role: UserRole) {
  const now = useNow();
  // const now = new Date(new Date().setHours(15, 0, 0, 0));

  // Determine relevant periods every second
  const periodNumber = useMemo(getCurrentPeriod, [now]);
  const todayRow = useMemo(
    () => (!isWeekend(now) ? schedule.content[now.getDay() - 1].content : []),
    [schedule, now.getDay()],
  );

  /**
   * The current period, if any.
   */
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

  /**
   * The period immediately after the current period, if any.
   */
  const immediateNextPeriod = useMemo(
    () =>
      todayRow.find(
        // The period starts at the next period
        (period) => periodNumber + 1 === period.start_time,
      ),
    [todayRow, periodNumber],
  );

  /**
   * The next period of the day, regardless of whether it’s immediately after
   * the current period or not.
   */
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
   * The type of Schedule Glance to display to the user, calculated by the current
   * and upcoming schedule items to be the most relevant.
   */
  const displayType: ScheduleGlanceType = (() => {
    // If it’s assembly or homeroom, display that
    if (attendanceEvent) return <ScheduleGlanceType>attendanceEvent;

    // If there are no periods today, don’t display anything
    if (!todayRow.length) return ScheduleGlanceType.none;

    switch (role) {
      case UserRole.student:
        // If it’s 5 minutes before the next class, display that class
        if (minutesTilImmediateNext && within(minutesTilImmediateNext, 0, 5))
          return ScheduleGlanceType.learnNext;

        // If the student is in class, display that class
        if (currentPeriod?.content.length)
          return ScheduleGlanceType.learnCurrent;

        // If the student is free and it’s a lunch period, display that it’s
        // lunch
        if ([4, 5].includes(periodNumber)) return ScheduleGlanceType.lunch;

        break;
      case UserRole.teacher:
        // If the teacher is free and it’s 5 minutes before the next class
        // starts, they are instructed to travel
        if (minutesTilImmediateNext && within(minutesTilImmediateNext, 0, 5))
          return ScheduleGlanceType.teachTravel;

        // If the teacher is free and the next class is far away, show a
        // countdown
        if (
          todayNextPeriod?.content.length &&
          !currentPeriod?.content.length &&
          schoolSessionState === SchoolSessionState.schedule
        )
          return ScheduleGlanceType.teachFuture;

        // If the teacher is teaching and it’s 10 minutes until it’s over, they
        // are intructed to wrap the class up
        if (
          currentPeriod?.content.length &&
          minutesTilEnd &&
          within(minutesTilEnd, 0, 10)
        )
          return ScheduleGlanceType.teachWrapUp;

        // If the teacher is teaching, display the current class
        if (currentPeriod?.content.length)
          return ScheduleGlanceType.teachCurrent;

        break;
    }
    return ScheduleGlanceType.none;
  })();

  // Below are calculations based on the display type.

  /**
   * The period to display in the Schedule Glance.
   */
  const displayPeriod = useMemo(() => {
    switch (displayType) {
      case ScheduleGlanceType.learnNext:
      case ScheduleGlanceType.teachTravel:
        return immediateNextPeriod;
      case ScheduleGlanceType.teachFuture:
        return todayNextPeriod;
      default:
        return currentPeriod;
    }
  }, [displayType]);

  /**
   * The number of minutes to display in the countdown.
   */
  const countdownMinutes = useMemo(() => {
    switch (displayType) {
      case ScheduleGlanceType.learnNext:
      case ScheduleGlanceType.teachTravel:
        return minutesTilImmediateNext;
      case ScheduleGlanceType.teachFuture:
        return minutesTilTodayNext;
      default:
        return minutesTilEnd;
    }
  }, [now]);

  /**
   * The time boundaries for the current display type.
   */
  const interval: { start: Date; end: Date } | null = useMemo(() => {
    // If it’s assembly or homeroom, the time boundaries are calculated from
    // constants.
    if (attendanceEvent)
      return mapValues(
        {
          assembly: { start: ASSEMBLY_START, end: HOMEROOM_START },
          homeroom: { start: HOMEROOM_START, end: SCHEDULE_START },
        }[displayType as AttendanceEvent],
        // Convert constants into Date objects
        (params) => new Date(new Date().setHours(...params)),
      );
    // If there is a Schedule Period on display, calculate the time boundaries
    // from the period itself.
    else if (displayPeriod)
      return mapValues(
        {
          start: displayPeriod.start_time,
          end: displayPeriod.start_time + displayPeriod.duration,
        },
        // Convert period numbers into Date objects
        (params) => getTodaySetToPeriodTime(params),
      );
    // If it is lunch, use the current period number.
    else if (displayType === ScheduleGlanceType.lunch)
      return mapValues(
        { start: periodNumber, end: periodNumber + 1 },
        // Convert period numbers into Date objects
        (params) => getTodaySetToPeriodTime(params),
      );
    else return null;
  }, [displayType]);

  return {
    displayType,
    displayPeriod,
    classProgress,
    interval,
    countdownMinutes,
  };
}
