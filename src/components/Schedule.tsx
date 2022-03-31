// Modules
import { intervalToDuration, isWithinInterval, setDay } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

// Types
import { Role } from "@utils/types/person";
import {
  Schedule as ScheduleType,
  ScheduleRow as ScheduleRowType,
} from "@utils/types/schedule";

// Animations
import { animationTransition } from "@utils/animations/config";
import { periodTimes } from "@utils/helpers/schedule";

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

const ScheduleRow = ({
  scheduleRow,
}: {
  scheduleRow: ScheduleRowType;
}): JSX.Element => {
  const locale = useRouter().locale == "th" ? "th" : "en-US";
  const { t } = useTranslation("common");

  const day = setDay(new Date(), scheduleRow.day);
  const now = new Date();

  const periodWidth = 112;

  return (
    <li aria-label={t(`datetime.day.${scheduleRow.day}`)}>
      <ul className="relative h-[3.75rem]">
        {scheduleRow.content.map((schedulePeriod) => (
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
              <div
                className={`flex h-[3.75rem] flex-col rounded-lg px-4 py-2 leading-snug ${
                  isWithinInterval(now, {
                    start: new Date(
                      day.setHours(
                        periodTimes[schedulePeriod.periodStart].hours,
                        periodTimes[schedulePeriod.periodStart].min,
                        0,
                        0
                      )
                    ),
                    end: new Date(
                      day.setHours(
                        periodTimes[
                          schedulePeriod.periodStart +
                            schedulePeriod.duration -
                            1
                        ].hours,
                        periodTimes[
                          schedulePeriod.periodStart +
                            schedulePeriod.duration -
                            1
                        ].min,
                        0,
                        0
                      )
                    ),
                  })
                    ? "container-tertiary shadow"
                    : "container-secondary"
                }`}
              >
                <span
                  className="max-lines-1 font-display text-xl font-medium"
                  title={schedulePeriod.subject.name[locale].name}
                >
                  {schedulePeriod.duration < 2
                    ? schedulePeriod.subject.name[locale].shortName ||
                      schedulePeriod.subject.name[locale].name
                    : schedulePeriod.subject.name[locale].name}
                </span>
                {schedulePeriod.subject.teachers.length > 0 && (
                  <span className="max-lines-1 text-base">
                    {
                      // Show the first teacher’s first name in user locale
                      schedulePeriod.subject.teachers[0].name[locale].firstName
                    }
                    {
                      // If there are more than one teacher, display +1 and show the remaining teachers on hover
                      schedulePeriod.subject.teachers.length > 1 && (
                        <abbr
                          className="text-secondary opacity-50"
                          title={schedulePeriod.subject.teachers
                            .slice(1)
                            .map((teacher) => teacher.name[locale].firstName)
                            .join(", ")}
                        >
                          +{schedulePeriod.subject.teachers.length - 1}
                        </abbr>
                      )
                    }
                  </span>
                )}
              </div>
            ) : (
              <div className="h-[3.75rem] w-full rounded-lg outline-offset-[-2px] outline-outline" />
            )}
          </motion.li>
        ))}
      </ul>
    </li>
  );
};

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
            <ScheduleRow key={scheduleRow.day} scheduleRow={scheduleRow} />
          ))}
        </ul>
      </AnimatePresence>
    </div>
  </div>
);

export default Schedule;
export { ScheduleDay as ScheduleDays, ScheduleRow };
