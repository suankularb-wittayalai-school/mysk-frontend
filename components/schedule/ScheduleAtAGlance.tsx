// Imports
import HoverList from "@/components/person/HoverList";
import GlanceCountdown from "@/components/schedule/GlanceCountdown";
import { range } from "@/utils/helpers/array";
import { cn } from "@/utils/helpers/className";
import { useNow } from "@/utils/helpers/date";
import { getLocaleString } from "@/utils/helpers/string";
import {
  getCurrentPeriod,
  getTodaySetToPeriodTime,
} from "@/utils/helpers/schedule";
import { useLocale } from "@/utils/hooks/i18n";
import { UserRole } from "@/utils/types/person";
import { Schedule } from "@/utils/types/schedule";
import {
  MaterialIcon,
  transition,
  useAnimationConfig,
} from "@suankularb-components/react";
import { differenceInMinutes, differenceInSeconds } from "date-fns";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { Trans, useTranslation } from "next-i18next";
import { FC } from "react";

/**
 * A glanceable banner dynamically updated by the current and upcoming schedule
 * items, display the most relevant information to the user.
 *
 * @param schedule Data for displaying Schedule at a Glance.
 * @param role The user’s role. Used in determining the Schedule at a Glance view.
 */
const ScheduleAtAGlance: FC<{
  schedule: Schedule;
  role: UserRole;
}> = ({ schedule, role }) => {
  const locale = useLocale();
  const { t } = useTranslation("schedule", { keyPrefix: "atAGlance" });

  const { duration, easing } = useAnimationConfig();

  const now = useNow();

  // Determine relevant periods every second
  const periodNumber = getCurrentPeriod();
  const todayRow = range(5, 1).includes(now.getDay())
    ? schedule.content[now.getDay() - 1].content
    : [];

  const currentPeriod = todayRow.find(
    (period) =>
      // The period starts before or at the current period
      period.start_time <= periodNumber &&
      // The period ends at or after the end of the current period (current
      // period number + 1)
      period.start_time + period.duration > periodNumber,
  );

  const immediateNextPeriod = todayRow.find(
    // The period starts at the next period
    (period) => periodNumber + 1 === period.start_time,
  );
  const todayNextPeriod = todayRow.filter(
    // The period starts at any period after the current
    (period) => period.content.length && period.start_time > periodNumber,
  )[0];

  // Note: `differenceInSeconds` and `differenceInMinutes` operate by
  // [first param] - [second param]

  // The edges of periods relative to current time, used in calculating the
  // display type
  const secondsSinceStart = currentPeriod
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

  // console.log({ currentPeriod });

  // A percentage of time since the start of the class relative to the total
  // class duration
  const classProgress =
    (secondsSinceStart / ((currentPeriod?.duration || 1) * 50 * 60)) * 100;

  /**
   * The type of At a Glance to display to the user, calculated by the current
   * and upcoming schedule items to be the most relevant.
   */
  const displayType:
    | "learn-current"
    | "learn-next"
    | "lunch"
    | "teach-current"
    | "teach-wrap-up"
    | "teach-travel"
    | "teach-future"
    | "none" = !todayRow.length
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
            className="relative isolate mx-4 flex flex-col gap-3 overflow-hidden
              rounded-lg border-1 border-outline-variant bg-surface-5 p-4
              sm:mx-0"
            style={{ borderRadius: 16 }}
          >
            {/* Class Progress Indicator */}
            <motion.div
              className="absolute inset-0 right-auto -z-10 bg-surface-2"
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
                className="skc-headline-medium"
              >
                {
                  {
                    "learn-current": (
                      <Trans
                        i18nKey="atAGlance.title.learnCurrent"
                        ns="schedule"
                        values={{
                          subject:
                            currentPeriod?.content.length &&
                            getLocaleString(
                              currentPeriod.content[0].subject.name,
                              locale,
                            ),
                        }}
                      />
                    ),
                    "learn-next": (
                      <Trans
                        i18nKey="atAGlance.title.learnNext"
                        ns="schedule"
                        values={{
                          subject:
                            immediateNextPeriod?.content.length &&
                            getLocaleString(
                              immediateNextPeriod.content[0].subject.name,
                              locale,
                            ),
                        }}
                      />
                    ),
                    lunch: t("title.lunch"),
                    "teach-current": (
                      <Trans
                        i18nKey="atAGlance.title.teachCurrent"
                        ns="schedule"
                        values={{
                          subject:
                            currentPeriod?.content.length &&
                            getLocaleString(
                              currentPeriod.content[0].subject.name,
                              locale,
                            ),
                        }}
                      />
                    ),
                    "teach-wrap-up": (
                      <Trans
                        i18nKey="atAGlance.title.teachWrapUp"
                        ns="schedule"
                        values={{
                          subject:
                            currentPeriod?.content.length &&
                            getLocaleString(
                              currentPeriod.content[0].subject.name,
                              locale,
                            ),
                        }}
                      />
                    ),
                    "teach-travel": (
                      <Trans
                        i18nKey="atAGlance.title.teachTravel"
                        ns="schedule"
                        values={{
                          room: immediateNextPeriod?.content[0]?.rooms?.join(
                            ", ",
                          ),
                        }}
                      />
                    ),
                    "teach-future": (
                      <Trans
                        i18nKey="atAGlance.title.teachFuture"
                        ns="schedule"
                        values={{
                          subject:
                            todayNextPeriod?.content.length &&
                            getLocaleString(
                              todayNextPeriod.content[0].subject.name,
                              locale,
                            ),
                        }}
                      />
                    ),
                  }[displayType]
                }
              </motion.h2>
            </AnimatePresence>

            {/* Subjects details */}
            <LayoutGroup>
              <AnimatePresence initial={false}>
                <motion.ul layout="position" role="list" className="contents">
                  {(["learn-next", "teach-travel"].includes(displayType)
                    ? immediateNextPeriod
                    : displayType === "teach-future"
                    ? todayNextPeriod
                    : currentPeriod
                  )?.content.map((period) => (
                    <motion.li
                      key={period.id}
                      layoutId={`subject-${period.id}`}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={transition(duration.medium4, easing.standard)}
                      className="grid grid-cols-2 gap-x-6 gap-y-3 md:grid-cols-4"
                    >
                      {/* Subject */}
                      <div className="flex flex-col">
                        <h3 className="skc-title-medium">
                          {t("details.subject")}
                        </h3>
                        <p className="skc-body-medium text-on-surface-variant">
                          {getLocaleString(period.subject.name, locale)}
                        </p>
                      </div>

                      {/* Subject code */}
                      <div className="flex flex-col">
                        <h3 className="skc-title-medium">
                          {t("details.code")}
                        </h3>
                        <p className="skc-body-medium text-on-surface-variant">
                          {getLocaleString(period.subject.code, locale)}
                        </p>
                      </div>

                      {/* Teachers */}
                      <div
                        className={cn([
                          `flex flex-col`,
                          !(period.rooms && period.rooms.length > 0) &&
                            `sm:col-span-2`,
                        ])}
                      >
                        <h3 className="skc-title-medium">
                          {t("details.teachers")}
                        </h3>
                        <p className="skc-body-medium text-on-surface-variant">
                          <HoverList
                            people={period.teachers}
                            options={{ nameJoinerOptions: { lastName: true } }}
                          />
                        </p>
                      </div>

                      {/* Room */}
                      {period.rooms && period.rooms?.length > 0 && (
                        <div className="flex flex-col">
                          <h3 className="skc-title-medium">
                            {t("details.room")}
                          </h3>
                          <p className="skc-body-medium text-on-surface-variant">
                            {period.rooms.join(", ")}
                          </p>
                        </div>
                      )}
                    </motion.li>
                  ))}
                </motion.ul>
              </AnimatePresence>
            </LayoutGroup>
          </motion.div>
        )
      }
    </AnimatePresence>
  );
};

export default ScheduleAtAGlance;
