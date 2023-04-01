// External libraries
import { setDay } from "date-fns";

import { FC } from "react";

import { AnimatePresence, LayoutGroup } from "framer-motion";

import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

// Internal components
import NumbersRow from "@/components/schedule/NumbersRow";
import ScheduleRow from "@/components/schedule/ScheduleRow";

// Types
import { Role } from "@/utils/types/person";
import {
  Schedule,
  PeriodContentItem,
  ScheduleRow as ScheduleRowType,
} from "@/utils/types/schedule";

// Day section
const ScheduleDay = ({ day }: { day: ScheduleRowType["day"] }): JSX.Element => {
  const locale = useRouter().locale;
  const { t } = useTranslation("common");
  const today = new Date();

  return (
    <div
      className="flex w-32 flex-col rounded-sm bg-primary-container px-4 py-2
        leading-snug text-on-primary-container"
    >
      <p className="skc-title-medium">{t(`datetime.day.${day}`)}</p>
      <time className="skc-body-small">
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
const Schedule: FC<{
  schedule: Schedule;
  role: Role;
  noScroll?: boolean;
  allowEdit?: boolean;
  setAddPeriod?: ({
    show,
    day,
    startTime,
  }: {
    show: boolean;
    day: Day;
    startTime: number;
  }) => void;
  setEditPeriod?: ({
    show,
    day,
    schedulePeriod,
  }: {
    show: boolean;
    day: Day;
    schedulePeriod: PeriodContentItem;
  }) => void;
  setDeletePeriod?: ({
    show,
    periodID,
  }: {
    show: boolean;
    periodID: number;
  }) => void;
  toggleFetched?: () => void;
}> = ({
  schedule,
  role,
  noScroll,
  allowEdit,
  setAddPeriod,
  setEditPeriod,
  setDeletePeriod,
  toggleFetched,
}) => {
  const periodWidth = 104;

  return (
    <div
      className="scroll-desktop !mx-0 flex w-full flex-row gap-5
        overflow-x-auto overflow-y-hidden !px-0 sm:overflow-x-visible"
    >
      <div aria-hidden className="flex flex-col gap-2 pb-2 pl-4 sm:pl-0">
        <div className="mb-1 h-[2.375rem]" />
        {schedule.content.map((scheduleRow) => (
          <ScheduleDay key={scheduleRow.day} day={scheduleRow.day} />
        ))}
      </div>
      <div
        className={
          noScroll
            ? "grow"
            : "scroll-w-0 scroll-desktop grow overflow-y-clip sm:overflow-x-auto"
        }
      >
        <LayoutGroup>
          <AnimatePresence initial={false}>
            <ul className="flex flex-col gap-2 pb-2 pl-1 pr-4 sm:pr-0">
              <NumbersRow periodWidth={periodWidth} />
              {schedule.content.map((scheduleRow) => (
                <ScheduleRow
                  key={scheduleRow.day}
                  scheduleRow={scheduleRow}
                  periodWidth={periodWidth}
                  role={role}
                  allowEdit={allowEdit}
                  setAddPeriod={setAddPeriod}
                  setEditPeriod={setEditPeriod}
                  setDeletePeriod={setDeletePeriod}
                  toggleFetched={toggleFetched}
                />
              ))}
            </ul>
          </AnimatePresence>
        </LayoutGroup>
      </div>
    </div>
  );
};

export default Schedule;
export { ScheduleDay as ScheduleDays, ScheduleRow };
