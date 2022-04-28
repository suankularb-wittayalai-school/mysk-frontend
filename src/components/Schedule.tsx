// Modules
import { Day, setDay } from "date-fns";

import { AnimatePresence, motion } from "framer-motion";

import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

// Types
import { Role, Teacher } from "@utils/types/person";
import {
  StudentSchedule as ScheduleType,
  SchedulePeriod as SchedulePeriodType,
  ScheduleRow as ScheduleRowType,
} from "@utils/types/schedule";

// Animations
import { animationTransition } from "@utils/animations/config";

// Helpers
import { isInPeriod } from "@utils/helpers/schedule";
import { useEffect, useState } from "react";
import { Subject } from "@utils/types/subject";

// Day section
const ScheduleDay = ({ day }: { day: ScheduleRowType["day"] }): JSX.Element => {
  const locale = useRouter().locale;
  const { t } = useTranslation("common");
  const today = new Date();

  return (
    <div className="container-primary flex w-40 flex-col rounded-xl px-4 py-2 leading-snug">
      <p className="font-display text-xl font-medium">
        {t(`datetime.day.${day}`)}
      </p>
      <time className="text-base">
        {setDay(today, day).toLocaleDateString(locale, {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </time>
    </div>
  );
};

// Content section
const ScheduleRow = ({
  scheduleRow,
  role,
}: {
  scheduleRow: ScheduleRowType;
  role: Role;
}): JSX.Element => {
  const { t } = useTranslation("common");

  const [now, setNow] = useState<Date>(new Date());
  const day = setDay(new Date(), scheduleRow.day);

  // Updates `now` every 5 seconds
  useEffect(() => {
    setInterval(() => setNow(new Date()), 5000);
  }, []);

  const periodWidth = 112;

  return (
    <li aria-label={t(`datetime.day.${scheduleRow.day}`)}>
      <ul className="relative h-[3.75rem]">
        {scheduleRow.content.map((schedulePeriod) => (
          <SchedulePeriod
            key={schedulePeriod.periodStart}
            schedulePeriod={schedulePeriod}
            now={now}
            day={day}
            periodWidth={periodWidth}
            role={role}
          />
        ))}
      </ul>
    </li>
  );
};

const SchedulePeriod = ({
  schedulePeriod,
  now,
  day,
  periodWidth,
  role,
}: {
  schedulePeriod: SchedulePeriodType;
  now: Date;
  day: Date;
  periodWidth: number;
  role: Role;
}): JSX.Element => {
  const locale = useRouter().locale == "th" ? "th" : "en-US";

  // Component-specific utils
  function getSubjectName(
    duration: SchedulePeriodType["duration"],
    subjectName: Subject["name"]
  ) {
    return duration < 2
      ? subjectName[locale].shortName ?? subjectName[locale].name
      : subjectName[locale].name;
  }

  return (
    <motion.li
      key={schedulePeriod.periodStart}
      className="absolute px-1"
      style={{
        width: periodWidth * schedulePeriod.duration,
        left: periodWidth * (schedulePeriod.periodStart - 1),
      }}
      initial={{ scale: 0.8, y: 20, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      exit={{ scale: 0.8, y: 20, opacity: 0 }}
      transition={animationTransition}
    >
      {schedulePeriod.subject ? (
        // Filled period
        <div
          className={`flex h-[3.75rem] flex-col rounded-lg px-4 py-2 leading-snug ${
            isInPeriod(
              now,
              day,
              schedulePeriod.periodStart,
              schedulePeriod.duration
            )
              ? "container-tertiary shadow"
              : "container-secondary"
          }`}
        >
          {role == "teacher" ? (
            <>
              <span className="max-lines-1 font-display text-xl font-medium">
                {/* TODO: Use data here */}
                M.500
              </span>
              <span
                className="max-lines-1 text-base"
                title={schedulePeriod.subject.name[locale].name}
              >
                {getSubjectName(
                  schedulePeriod.duration,
                  schedulePeriod.subject.name
                )}
              </span>
            </>
          ) : (
            <>
              <span
                className="max-lines-1 font-display text-xl font-medium"
                title={schedulePeriod.subject.name[locale].name}
              >
                {getSubjectName(
                  schedulePeriod.duration,
                  schedulePeriod.subject.name
                )}
              </span>
              <TeacherTeachingList teachers={schedulePeriod.subject.teachers} />
            </>
          )}
        </div>
      ) : (
        // Empty period
        <div
          className={`h-[3.75rem] w-full rounded-lg ${
            isInPeriod(
              now,
              day,
              schedulePeriod.periodStart,
              schedulePeriod.duration
            )
              ? "outline-4 outline-offset-[-4px] outline-secondary"
              : "outline-2 outline-offset-[-2px] outline-outline"
          }`}
        />
      )}
    </motion.li>
  );
};

const TeacherTeachingList = ({
  teachers,
}: {
  teachers: { name: Teacher["name"] }[];
}) => {
  const locale = useRouter().locale == "th" ? "th" : "en-US";

  return (
    <span className="max-lines-1 text-base">
      {teachers.length > 0 &&
        // Show the first teacher’s first name in user locale
        (teachers[0].name[locale]?.firstName || teachers[0].name.th.firstName)}
      {
        // If there are more than one teacher, display +1 and show the remaining teachers on hover
        teachers.length > 1 && (
          <abbr
            className="text-secondary opacity-50"
            title={teachers
              .slice(1)
              .map(
                (teacher) =>
                  teacher.name[locale]?.firstName || teacher.name.th.firstName
              )
              .join(", ")}
          >
            +{teachers.length - 1}
          </abbr>
        )
      }
    </span>
  );
};

// Main component
const Schedule = ({
  schedule,
  role,
  noScroll,
}: {
  schedule: ScheduleType;
  role: Role;
  noScroll?: boolean;
}): JSX.Element => (
  <div className="scroll-w-0 flex flex-row gap-5 overflow-x-auto !px-0 sm:overflow-x-visible">
    <div aria-hidden className="flex flex-col gap-2 py-1 pl-4 sm:pl-0">
      {schedule.content.map((scheduleRow) => (
        <ScheduleDay key={scheduleRow.day} day={scheduleRow.day} />
      ))}
    </div>
    <div
      className={
        noScroll ? "grow" : "scroll-w-0 scroll-desktop grow sm:overflow-x-auto"
      }
    >
      <AnimatePresence initial={false}>
        <ul className="flex flex-col gap-2 py-1 pl-1 pr-4 sm:pr-0">
          {schedule.content.map((scheduleRow) => (
            <ScheduleRow
              key={scheduleRow.day}
              scheduleRow={scheduleRow}
              role={role}
            />
          ))}
        </ul>
      </AnimatePresence>
    </div>
  </div>
);

export default Schedule;
export { ScheduleDay as ScheduleDays, ScheduleRow };
