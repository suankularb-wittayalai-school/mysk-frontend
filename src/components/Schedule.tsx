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
      <time className="text-base">
        {setDay(today, day).toLocaleDateString(locale)}
      </time>
    </div>
  );
};

interface ScheduleRowProps {
  scheduleRow: ScheduleRowType;
}

const ScheduleRow = ({ scheduleRow }: ScheduleRowProps): JSX.Element => {
  const locale = useRouter().locale == "th" ? "th" : "en-US";

  // TODO: This might need to be rewrote as the way Schedule is represented in the database is finalized
  return (
    <li>
      <ul className="flex flex-row items-stretch gap-2">
        {scheduleRow.content.map((schedulePeriod) => (
          <li
            key={schedulePeriod.periodStart}
            className="container-secondary flex w-28 flex-col rounded-xl px-4 py-2 leading-snug"
            title={schedulePeriod.subject.name[locale].name}
          >
            <p className="max-lines-1 font-display text-xl font-medium">
              {schedulePeriod.subject.name[locale].name}
            </p>
            {schedulePeriod.subject.teachers.length > 0 && (
              <p className="text-base">
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
              </p>
            )}
          </li>
        ))}
      </ul>
    </li>
  );
};

interface ScheduleProps {
  schedule: ScheduleType;
}

const Schedule = ({ schedule }: ScheduleProps): JSX.Element => {
  const { t } = useTranslation("schedule");

  return (
    <div className="flex flex-row gap-5">
      <div className="flex flex-col py-1">
        {schedule.content.map((scheduleRow) => (
          <ScheduleDay key={scheduleRow.day} day={scheduleRow.day} />
        ))}
      </div>
      <div className="scroll-h-0 grow overflow-x-auto">
        <ul className="flex w-fit flex-col py-1 pl-1">
          {schedule.content.map((scheduleRow) => (
            <ScheduleRow key={scheduleRow.day} scheduleRow={scheduleRow} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Schedule;
export { ScheduleDay as ScheduleDays, ScheduleRow };
