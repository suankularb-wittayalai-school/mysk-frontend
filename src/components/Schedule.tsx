// Modules
import { Schedule as ScheduleType } from "@utils/types/schedule";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

const ScheduleRowDay = (): JSX.Element => {
  const { t } = useTranslation("schedule");

  return <div></div>;
};

const ScheduleRowPeriods = (): JSX.Element => {
  const locale = useRouter().locale;

  return (
    <ul></ul>
  );
};

const ScheduleRow = (): JSX.Element => (
  <li>
    <ScheduleRowDay />
    <ScheduleRowPeriods />
  </li>
);

interface ScheduleProps {
  schedule: ScheduleType;
}

const Schedule = ({ schedule }: ScheduleProps): JSX.Element => {
  const { t } = useTranslation("schedule");

  return (
    <ul className="flex flex-col">
      {schedule.content.map((scheduleRow) => (
        <ScheduleRow />
      ))}
    </ul>
  );
};

export default Schedule;
export { ScheduleRowDay, ScheduleRowPeriods, ScheduleRow };
