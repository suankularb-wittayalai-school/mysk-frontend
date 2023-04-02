// External libraries
import { setDay } from "date-fns";
import { useTranslation } from "next-i18next";
import { FC, useEffect, useState } from "react";

// Internal components
import SchedulePeriod from "@/components/schedule-legacy/SchedulePeriod";

// Types
import { Role } from "@/utils/types/person";
import {
  ScheduleRow as ScheduleRowType,
  PeriodContentItem,
} from "@/utils/types/schedule";

const ScheduleRow: FC<{
  scheduleRow: ScheduleRowType;
  periodWidth: number;
  role: Role;
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
  scheduleRow,
  periodWidth,
  role,
  allowEdit,
  setAddPeriod,
  setEditPeriod,
  setDeletePeriod,
  toggleFetched,
}): JSX.Element => {
  const { t } = useTranslation("common");

  const [now, setNow] = useState<Date>(new Date());
  const day = setDay(new Date(), scheduleRow.day);

  // Updates `now` every 5 seconds
  useEffect(() => {
    const updateInterval = setInterval(() => setNow(new Date()), 5000);
    return () => clearInterval(updateInterval);
  }, []);

  return (
    <li aria-label={t(`datetime.day.${scheduleRow.day}`)}>
      <ul className="relative h-14">
        {scheduleRow.content.map((schedulePeriod) => (
          <SchedulePeriod
            key={`${scheduleRow.day}-${schedulePeriod.startTime}`}
            schedulePeriod={schedulePeriod}
            now={now}
            day={day}
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
    </li>
  );
};

export default ScheduleRow;
