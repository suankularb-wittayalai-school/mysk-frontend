// External libraries
import { setDay } from "date-fns";
import { LayoutGroup } from "framer-motion";
import { FC, RefObject, useEffect, useRef, useState } from "react";

// Internal components
import DayCard from "@/components/schedule/DayCard";
import NowLine from "@/components/schedule/NowLine";
import NumbersRow from "@/components/schedule/NumbersRow";
import ElectivePeriod from "@/components/schedule/ElectivePeriod";
import EmptyPeriod from "@/components/schedule/EmptyPeriod";
import PeriodAdditionHint from "@/components/schedule/PeriodAdditionHint";
import SubjectPeriod from "@/components/schedule/SubjectPeriod";
import SubjectsInChargeCard from "@/components/schedule/SubjectsInChargeCard";

// Contexts
import ScheduleContext from "@/contexts/ScheduleContext";

// Helpers
import {
  getCurrentPeriod,
  isInPeriod,
  isSchoolInSessionNow,
} from "@/utils/helpers/schedule";

// Types
import { Role } from "@/utils/types/person";
import { PeriodLocation, Schedule } from "@/utils/types/schedule";
import { SubjectWNameAndCode } from "@/utils/types/subject";

const Schedule: FC<{
  schedule: Schedule;
  subjectsInCharge?: SubjectWNameAndCode[];
  teacherID?: number;
  role: Role;
}> = ({ schedule, subjectsInCharge, teacherID, role }) => {
  // Ref for drag constrains and scrolling
  const scheduleRef: RefObject<HTMLElement> = useRef(null);

  // Time calculation set up
  const [now, setNow] = useState<Date>(new Date());

  // (@SiravitPhokeed)
  // we’re using a long update interval because this updates the Period
  // components. When a Period is expanded, the original unexpanded period is
  // hidden by Framer Motion. When the Period update from a change in `now`,
  // the original shows again. This means if we use a short interval like 1
  // second, it would take a maximum of 1 second of looking at the details of a
  // Period for it to bug out slightly. It’s not a huge deal, so I decided to
  // just settle on making it happen less.

  // Update the current time every 20 seconds
  useEffect(() => {
    const nowInterval = setInterval(() => setNow(new Date()), 20000);
    return () => clearInterval(nowInterval);
  }, []);

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
        role,
        teacherID,
        periodWidth: 104, // 96 + 8
        periodHeight: 60, // 56 + 4
        additionSite,
        setAdditionSite,
        constraintsRef: scheduleRef,
      }}
    >
      <div className="relative -my-2 !mx-0 flex flex-col-reverse gap-3 sm:flex-col">
        {role === "teacher" && (
          <>
            {/* Subjects in Charge Card: for Subjects to be added to Schedule */}
            <SubjectsInChargeCard subjects={subjectsInCharge!} />

            <p className="mx-4 sm:mx-0">
              Drag a subject into the period when you teach that subject, then
              fill in the rest of the information.
            </p>
          </>
        )}

        <figure
          ref={scheduleRef}
          className="relative overflow-x-auto overflow-y-hidden"
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
                        const props = {
                          key: [row.day, period.startTime].join("-"),
                          isInSession: isInPeriod(
                            now,
                            day,
                            period.startTime,
                            period.duration
                          ),
                        };

                        return period.content.length === 1 ? (
                          <SubjectPeriod
                            period={period.content[0]}
                            day={row.day}
                            {...props}
                          />
                        ) : period.content.length ? (
                          <ElectivePeriod period={period} {...props} />
                        ) : (
                          <EmptyPeriod {...props} />
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
