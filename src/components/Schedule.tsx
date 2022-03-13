// Modules
import { setDay } from "date-fns";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

// Types
import {
  Schedule as ScheduleType,
  ScheduleRow as ScheduleRowType,
} from "@utils/types/schedule";

interface ScheduleDaysProps {
  day: ScheduleRowType["day"];
}

const ScheduleDay = ({ day }: ScheduleDaysProps): JSX.Element => {
  const locale = useRouter().locale;
  const { t } = useTranslation("common");
  const today = new Date();

  return (
    <div className="container-primary flex w-40 flex-col rounded-xl px-4 py-2 leading-snug">
      <p className="font-display text-xl font-medium">
        {t(`datetime.day.${day}`)}
      </p>
      <time className="text-base font-light">
        {setDay(today, day).toLocaleDateString(locale)}
      </time>
    </div>
  );
};

interface ScheduleRowProps {
  scheduleRow: ScheduleRowType;
}

const ScheduleRow = ({ scheduleRow }: ScheduleRowProps): JSX.Element => (
  <li>
    <ul>
      {scheduleRow.content.map((schedulePeriod) => (
        <li className="container-secondary flex w-24 flex-col rounded-xl px-4 py-2">
          {schedulePeriod.subject.name}
        </li>
      ))}
    </ul>
  </li>
);

interface ScheduleProps {
  schedule: ScheduleType;
}

const Schedule = ({ schedule }: ScheduleProps): JSX.Element => {
  const { t } = useTranslation("schedule");

  return (
    <div className="flex flex-row">
      <div className="flex flex-col">
        {schedule.content.map((scheduleRow) => (
          <ScheduleDay key={scheduleRow.day} day={scheduleRow.day} />
        ))}
      </div>
      <ul className="flex flex-col">
        {schedule.content.map((scheduleRow) => (
          <ScheduleRow key={scheduleRow.day} scheduleRow={scheduleRow} />
        ))}
      </ul>
    </div>
  );
};

export default Schedule;
export { ScheduleDay as ScheduleDays, ScheduleRow };
