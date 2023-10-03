// Imports
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
import getCurrentPeriod from "@/utils/helpers/schedule/getCurrentPeriod";
import isInPeriod from "@/utils/helpers/schedule/isInPeriod";
import isSchoolInSessionNow from "@/utils/helpers/schedule/isSchoolInSessionNow";
import useNow from "@/utils/helpers/useNow";
import { StylableFC } from "@/utils/types/common";
import { PeriodLocation, Schedule } from "@/utils/types/schedule";
import { Subject } from "@/utils/types/subject";
import { Text } from "@suankularb-components/react";
import { setDay } from "date-fns";
import { LayoutGroup } from "framer-motion";
import { useTranslation } from "next-i18next";
import { RefObject, useEffect, useRef, useState } from "react";

/**
 * An interactive Schedule.
 *
 * @param schedule Data for displaying Schedule.
 * @param subjectsInCharge The Subjects assigned to this teacher. Used in editing the Schedule.
 * @param teacherID The Teacher’s database ID. Used in validating edits in the Schedule.
 * @param role The Schedule view, from the perspective of a student or a teacher.
 */
const Schedule: StylableFC<{
  schedule: Schedule;
  subjectsInCharge?: Pick<Subject, "id" | "name" | "code" | "short_name">[];
  teacherID?: string;
  view: "student" | "teacher";
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
  // Translation
  const { t } = useTranslation("schedule");

  // Ref for drag constrains and scrolling
  const scheduleRef: RefObject<HTMLElement> = useRef(null);

  // (@SiravitPhokeed)
  // We’re using a long update interval because this updates the Period
  // components. When a Period is expanded, the original unexpanded period is
  // hidden by Framer Motion. When the Period update from a change in `now`,
  // the original shows again. This means if we use a short interval like 1
  // second, it would take a maximum of 1 second of looking at the details of a
  // Period for it to bug out slightly. It’s not a huge deal, so I decided to
  // just settle on making it happen less.

  // Time calculation set up
  const now = useNow(20000);

  // State for dropping to add a new period
  const [additionSite, setAdditionSite] = useState<PeriodLocation>();

  // Scroll to near current period
  useEffect(() => {
    const schedule = scheduleRef.current;
    if (!schedule) return;
    if (isSchoolInSessionNow() !== "in-session") return;
    schedule.scrollTo({
      top: 0,
      left: (getCurrentPeriod() - 2) * 104,
      behavior: "smooth",
    });
  }, []);

  return (
    <ScheduleContext.Provider
      value={{
        view: view,
        editable,
        teacherID,
        periodWidth: 104, // 96 + 8
        periodHeight: 60, // 56 + 4
        additionSite,
        setAdditionSite,
        constraintsRef: scheduleRef,
      }}
    >
      <div
        style={style}
        className={cn(
          `relative !mx-0 -my-2 flex flex-col-reverse gap-3
          sm:flex-col`,
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
          {isSchoolInSessionNow() === "in-session" && <NowLine />}

          <ul className="flex w-fit flex-col gap-2 px-4 py-2 sm:px-0">
            {/* Period numbers and start-end times */}
            <NumbersRow />

            {/* Addition drop hint */}
            <PeriodAdditionHint />

            <LayoutGroup>
              {/* For each day */}
              {schedule.content.map((row) => {
                const day = setDay(now, row.day);

                return (
                  <li key={row.day} className="flex flex-row gap-2">
                    {/* The day of this row */}
                    <DayCard day={row.day} />

                    {/* The periods in this row */}
                    <ul className="flex flex-row gap-2">
                      {row.content.map((period) => {
                        const isInSession = isInPeriod(
                          now,
                          day,
                          period.start_time,
                          period.duration,
                        );

                        return period.content.length === 1 ? (
                          <SubjectPeriod
                            key={[row.day, period.start_time].join("-")}
                            period={period.content[0]}
                            day={row.day}
                            isInSession={isInSession}
                          />
                        ) : period.content.length ? (
                          <ElectivePeriod
                            key={[row.day, period.start_time].join("-")}
                            period={period}
                            isInSession={isInSession}
                          />
                        ) : (
                          <EmptyPeriod
                            key={[row.day, period.start_time].join("-")}
                            isInSession={isInSession}
                          />
                        );
                      })}
                    </ul>
                  </li>
                );
              })}
            </LayoutGroup>
          </ul>
        </figure>
      </div>
    </ScheduleContext.Provider>
  );
};

export default Schedule;
