// Modules
import { setDay } from "date-fns";

import { AnimatePresence } from "framer-motion";

import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

// Components
import ScheduleRow from "@components/schedule/ScheduleRow";

// Types
import { Role } from "@utils/types/person";
import {
  StudentSchedule as StudentSchedule,
  ScheduleRow as ScheduleRowType,
} from "@utils/types/schedule";

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

// Main component
const Schedule = ({
  schedule,
  role,
  noScroll,
}: {
  schedule: StudentSchedule;
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
