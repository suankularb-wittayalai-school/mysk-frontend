// Imports
import HoverList from "@/components/person/HoverList";
import GlanceCountdown from "@/components/schedule/GlanceCountdown";
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
  Text,
  transition,
  useAnimationConfig,
} from "@suankularb-components/react";
import { differenceInMinutes, differenceInSeconds } from "date-fns";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { Trans, useTranslation } from "next-i18next";
import { list } from "radash";

/**
 * A glanceable banner dynamically updated by the current and upcoming schedule
 * items, display the most relevant information to the user.
 *
 * @param schedule Data for displaying Schedule at a Glance.
 * @param role The user’s role. Used in determining the Schedule at a Glance view.
 */
const ScheduleAtAGlance: StylableFC<{
  schedule: Schedule;
  role: UserRole;
}> = ({ schedule, role, style, className }) => {
  const locale = useLocale();
  const { t } = useTranslation("schedule", { keyPrefix: "atAGlance" });

  const { duration, easing } = useAnimationConfig();

  const now = useNow();

  // Determine relevant periods every second
  const periodNumber = getCurrentPeriod();
  const todayRow = list(1, 5).includes(now.getDay())
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
  const secondsSinceStart = currentPeriod?.content.length
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

  const displayPeriod = ["learn-next", "teach-travel"].includes(displayType)
    ? immediateNextPeriod
    : displayType === "teach-future"
    ? todayNextPeriod
    : currentPeriod;

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
            style={{ borderRadius: 16, ...style }}
            className={cn(
              `relative isolate mx-4 flex flex-col gap-3 overflow-hidden
              rounded-lg border-1 border-outline-variant bg-surface-5 p-4
              sm:mx-0`,
              className,
            )}
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
                className="skc-text skc-text--headline-medium"
              >
                {
                  {
                    "learn-current": (
                      <Trans
                        i18nKey="atAGlance.title.learnCurrent"
                        ns="schedule"
                        values={{
                          subject: getSubjectStringFromPeriod(currentPeriod),
                        }}
                      />
                    ),
                    "learn-next": (
                      <Trans
                        i18nKey="atAGlance.title.learnNext"
                        ns="schedule"
                        values={{
                          subject:
                            getSubjectStringFromPeriod(immediateNextPeriod),
                        }}
                      />
                    ),
                    lunch: t("title.lunch"),
                    "teach-current": (
                      <Trans
                        i18nKey="atAGlance.title.teachCurrent"
                        ns="schedule"
                        values={{
                          subject: getSubjectStringFromPeriod(currentPeriod),
                        }}
                      />
                    ),
                    "teach-wrap-up": (
                      <Trans
                        i18nKey="atAGlance.title.teachWrapUp"
                        ns="schedule"
                        values={{
                          subject: getSubjectStringFromPeriod(currentPeriod),
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
                          subject: getSubjectStringFromPeriod(todayNextPeriod),
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
                  {displayPeriod?.content.map((period, idx) => (
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
                        {idx === 0 && (
                          <Text type="title-medium" element="h3">
                            {t("details.subject")}
                          </Text>
                        )}
                        <Text
                          type="body-medium"
                          element="p"
                          className={cn(
                            `text-on-surface-variant`,
                            idx !== 0 && `-mt-2`,
                          )}
                        >
                          {getLocaleString(period.subject.name, locale)}
                        </Text>
                      </div>

                      {/* Subject code */}
                      <div className="flex flex-col">
                        {idx === 0 && (
                          <Text type="title-medium" element="h3">
                            {t("details.code")}
                          </Text>
                        )}
                        <Text
                          type="body-medium"
                          element="p"
                          className={cn(
                            `text-on-surface-variant`,
                            idx !== 0 && `-mt-2`,
                          )}
                        >
                          {getLocaleString(period.subject.code, locale)}
                        </Text>
                      </div>

                      {/* Teachers */}
                      <div
                        className={cn(
                          `flex flex-col`,
                          !(
                            period.rooms && period.rooms?.find((room) => room)
                          ) && `col-span-2`,
                        )}
                      >
                        {idx === 0 && (
                          <Text type="title-medium" element="h3">
                            {t("details.teachers")}
                          </Text>
                        )}
                        <Text
                          type="body-medium"
                          element="p"
                          className={cn(
                            `text-on-surface-variant`,
                            idx !== 0 && `-mt-2`,
                          )}
                        >
                          <HoverList
                            people={period.teachers}
                            options={{ nameJoinerOptions: { lastName: true } }}
                          />
                        </Text>
                      </div>

                      {/* Room */}
                      {displayPeriod.content.find(
                        (period) => period.rooms?.find((room) => room),
                      ) && (
                        <div className="flex flex-col">
                          {idx === 0 && (
                            <Text type="title-medium" element="h3">
                              {t("details.room")}
                            </Text>
                          )}
                          <Text
                            type="body-medium"
                            element="p"
                            className={cn(
                              `text-on-surface-variant`,
                              idx !== 0 && `-mt-2`,
                            )}
                          >
                            {period.rooms?.join(", ") || " "}
                          </Text>
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
