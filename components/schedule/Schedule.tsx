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
import SubjectPeriod from "@/components/schedule/SubjectPeriod";

// Contexts
import ScheduleContext from "@/contexts/ScheduleContext";

// Types
import { Role } from "@/utils/types/person";
import { Schedule } from "@/utils/types/schedule";
import {
  getCurrentPeriod,
  isInPeriod,
  isSchoolInSessionNow,
} from "@/utils/helpers/schedule";

const Schedule: FC<{
  schedule: Schedule;
  teacherID?: number;
  role: Role;
}> = ({ schedule, teacherID, role }) => {
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
    <figure
      ref={scheduleRef}
      className="relative -my-2 !mx-0 overflow-x-auto overflow-y-hidden"
    >
      {/* Now indicator line */}
      {isSchoolInSessionNow() === "in-session" && <NowLine />}

      <ul className="flex w-fit flex-col gap-2 px-4 py-2 sm:px-0">
        {/* Period numbers and start-end times */}
        <NumbersRow />

        <ScheduleContext.Provider
          value={{ role, teacherID, constraintsRef: scheduleRef }}
        >
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
                        <SubjectPeriod period={period.content[0]} {...props} />
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
        </ScheduleContext.Provider>
      </ul>
    </figure>
  );
};

export default Schedule;
