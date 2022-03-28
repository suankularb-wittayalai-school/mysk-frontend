// Modules
import { setDay } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

// Types
import {
  Schedule as ScheduleType,
  ScheduleRow as ScheduleRowType,
} from "@utils/types/schedule";

// Animations
import { animationTransition } from "@utils/animations/config";

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

  return (
    <li>
      <ul className="relative h-[3.75rem]">
        {scheduleRow.content.map((schedulePeriod) => (
          <motion.li
            key={schedulePeriod.periodStart}
            className="absolute px-1"
            style={{
              width: 112 * schedulePeriod.duration,
              left: 112 * (schedulePeriod.periodStart - 1),
            }}
            initial={{ scale: 0.8, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 20, opacity: 0 }}
            transition={animationTransition}
          >
            {schedulePeriod.subject ? (
              <div className="container-secondary flex h-[3.75rem] flex-col rounded-xl px-4 py-2 leading-snug">
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
              <div className="h-[3.75rem] w-full rounded-xl outline-offset-[-2px] outline-outline" />
            )}
          </motion.li>
        ))}
      </ul>
    </li>
  );
};

const Schedule = ({
  schedule,
  noScroll,
}: {
  schedule: ScheduleType;
  noScroll?: boolean;
}): JSX.Element => (
  <div className="flex flex-row gap-5 !px-0">
    <div className="flex flex-col gap-2 py-1 pl-4 sm:pl-0">
      {schedule.content.map((scheduleRow) => (
        <ScheduleDay key={scheduleRow.day} day={scheduleRow.day} />
      ))}
    </div>
    <div className={noScroll ? "grow" : "scroll-w-0 grow overflow-x-auto"}>
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
