// Modules
import { setDay } from "date-fns";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";

// Components
import SchedulePeriod from "@components/schedule/SchedulePeriod";

// Types
import { Role } from "@utils/types/person";
import {
  ScheduleRow as ScheduleRowType,
  SchedulePeriod as SchedulePeriodType,
} from "@utils/types/schedule";

const ScheduleRow = ({
  scheduleRow,
  role,
  allowEdit,
  setAddPeriod,
  setEditPeriod,
  setDeletePeriod,
  toggleFetched,
}: {
  scheduleRow: ScheduleRowType;
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
    schedulePeriod: SchedulePeriodType;
  }) => void;
  setDeletePeriod?: ({
    show,
    periodID,
  }: {
    show: boolean;
    periodID: number;
  }) => void;
  toggleFetched?: () => void;
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
