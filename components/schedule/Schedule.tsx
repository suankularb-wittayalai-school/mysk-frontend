import DayCard from "@/components/schedule/DayCard";
import ElectivePeriod from "@/components/schedule/ElectivePeriod";
import EmptyPeriod from "@/components/schedule/EmptyPeriod";
import NowLine from "@/components/schedule/NowLine";
import NumbersRow from "@/components/schedule/NumbersRow";
import PeriodAdditionHint from "@/components/schedule/PeriodAdditionHint";
import SubjectPeriod from "@/components/schedule/SubjectPeriod";
import SubjectsInChargeCard from "@/components/schedule/SubjectsInChargeCard";
import ScheduleContext from "@/contexts/ScheduleContext";
import cn from "@/utils/helpers/cn";
import { SchoolSessionState } from "@/utils/helpers/schedule/schoolSessionStateAt";
import useNow from "@/utils/helpers/useNow";
import { StylableFC } from "@/utils/types/common";
import { UserRole } from "@/utils/types/person";
import {
  PeriodLocation,
  Schedule as ScheduleType,
} from "@/utils/types/schedule";
import { Subject } from "@/utils/types/subject";
import { Text } from "@suankularb-components/react";
import { LayoutGroup } from "framer-motion";
import { useTranslation } from "next-i18next";
import { RefObject, useEffect, useRef, useState } from "react";

const PERIOD_WIDTH = 104; // 96 + 8
const PERIOD_HEIGHT = 60; // 56 + 4

/**
 * An interactive Schedule.
 *
 * @param schedule Data for displaying Schedule.
 * @param subjectsInCharge The Subjects assigned to this teacher. Used in editing the Schedule.
 * @param teacherID The Teacher’s database ID. Used in validating edits in the Schedule.
 * @param role The Schedule view, from the perspective of a student or a teacher.
 */
const Schedule: StylableFC<{
  schedule: ScheduleType;
  subjectsInCharge?: Pick<Subject, "id" | "name" | "code" | "short_name">[];
  teacherID?: string;
  view: UserRole;
  editable?: boolean;
}> = ({
  schedule,
  subjectsInCharge,
  teacherID,
  view,
  editable,
  style,
  className,
}) => {
  const { t } = useTranslation("schedule");

  // Ref for drag constrains and scrolling.
  const scheduleRef: RefObject<HTMLElement> = useRef(null);

  // Time calculation set up.
  const { now, periodNumber, schoolSessionState } = useNow();

  // State for dropping to add a new period.
  const [additionSite, setAdditionSite] = useState<PeriodLocation>();

  // Scroll to near current period on load.
  useEffect(() => {
    const schedule = scheduleRef.current;
    if (!schedule) return;
    if (schoolSessionState !== SchoolSessionState.schedule) return;
    schedule.scrollTo({ top: 0, left: (periodNumber - 2) * PERIOD_WIDTH });
  }, []);

  return (
    <ScheduleContext.Provider
      value={{
        view,
        editable,
        teacherID,
        periodWidth: PERIOD_WIDTH,
        periodHeight: PERIOD_HEIGHT,
        additionSite,
        setAdditionSite,
        constraintsRef: scheduleRef,
      }}
    >
      <div
        style={style}
        className={cn(
          `relative !mx-0 -my-2 flex flex-col-reverse gap-3 sm:flex-col`,
          className,
        )}
      >
        {editable && (
          <>
            {/* Subjects in Charge Card: for Subjects to be added to
                Schedule */}
            <SubjectsInChargeCard subjects={subjectsInCharge!} />
            <Text type="body-medium" element="p" className="mx-4 sm:mx-0">
              {t("schedule.additionGuide")}
            </Text>
          </>
        )}

        <figure
          ref={scheduleRef}
          className="relative overflow-x-auto overflow-y-hidden pb-1"
        >
          {/* Now indicator line */}
          {schoolSessionState === SchoolSessionState.schedule && <NowLine />}

          <ul className="flex w-fit flex-col gap-2 px-4 py-2 sm:px-0">
            {/* Period numbers and start-end times */}
            <NumbersRow />

            {/* Addition drop hint */}
            <PeriodAdditionHint />

            <LayoutGroup>
              {/* For each day */}
              {schedule.content.map((row) => (
                <li key={row.day} className="flex flex-row gap-2">
                  {/* The day of this row */}
                  <DayCard day={row.day} />

                  {/* The periods in this row */}
                  <ul className="flex flex-row gap-2">
                    {row.content.map((period) => {
                      const { length } = period.content;
                      const key = row.day + "-" + period.start_time;
                      const isInSession =
                        schoolSessionState === SchoolSessionState.schedule &&
                        now.getDay() === row.day &&
                        periodNumber >= period.start_time &&
                        periodNumber < period.start_time + period.duration;

                      return length === 0 ? (
                        <EmptyPeriod key={key} isInSession={isInSession} />
                      ) : length === 1 ? (
                        <SubjectPeriod
                          key={key}
                          period={period.content[0]}
                          day={row.day}
                          isInSession={isInSession}
                        />
                      ) : (
                        <ElectivePeriod
                          key={key}
                          period={period}
                          isInSession={isInSession}
                        />
                      );
                    })}
                  </ul>
                </li>
              ))}
            </LayoutGroup>
          </ul>
        </figure>
      </div>
    </ScheduleContext.Provider>
  );
};

export default Schedule;
