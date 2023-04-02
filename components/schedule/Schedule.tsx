// External libraries
import { LayoutGroup } from "framer-motion";
import { FC, RefObject, useEffect, useRef } from "react";

// Internal components
import DayCard from "@/components/schedule/DayCard";
import NowLine from "@/components/schedule/NowLine";
import NumbersRow from "@/components/schedule/NumbersRow";
import EmptyPeriod from "@/components/schedule/EmptyPeriod";
import SubjectPeriod from "@/components/schedule/SubjectPeriod";

// Contexts
import ScheduleContext from "@/contexts/ScheduleContext";

// Types
import { Role } from "@/utils/types/person";
import { Schedule } from "@/utils/types/schedule";
import {
  getCurrentPeriod,
  isSchoolInSessionNow,
} from "@/utils/helpers/schedule";

const Schedule: FC<{
  schedule: Schedule;
  role: Role;
}> = ({ schedule, role }) => {
  const scheduleRef: RefObject<HTMLElement> = useRef(null);

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

        <ScheduleContext.Provider value={{ role, constraintsRef: scheduleRef }}>
          <LayoutGroup>
            {/* For each day */}
            {schedule.content.map((row) => (
              <li key={row.day} className="flex flex-row gap-2">
                {/* The day of this row */}
                <DayCard day={row.day} />
                {/* The periods in this row */}
                <ul className="flex flex-row gap-2">
                  {row.content.map((period) =>
                    period.content.length ? (
                      <SubjectPeriod
                        key={period.id}
                        period={period.content[0]}
                      />
                    ) : (
                      <EmptyPeriod key={period.id} />
                    )
                  )}
                </ul>
              </li>
            ))}
          </LayoutGroup>
        </ScheduleContext.Provider>
      </ul>
    </figure>
  );
};

export default Schedule;
