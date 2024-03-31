import AttendanceFigureDay from "@/components/attendance/AttendanceFigureDay";
import AttendanceFigureEvent from "@/components/attendance/AttendanceFigureEvent";
import cn from "@/utils/helpers/cn";
import getISODateString from "@/utils/helpers/getISODateString";
import { AttendanceEvent, StudentAttendance } from "@/utils/types/attendance";
import { StylableFC } from "@/utils/types/common";
import { addDays, differenceInDays } from "date-fns";
import { list } from "radash";
import { useMemo } from "react";

const DEFAULT_ATTENDANCE_PER_EVENT = {
  id: null,
  is_present: null,
  absence_type: null,
  absence_reason: null,
};

const DEFAULT_ATTENDANCE = {
  assembly: DEFAULT_ATTENDANCE_PER_EVENT,
  homeroom: DEFAULT_ATTENDANCE_PER_EVENT,
};

/**
 * A visual representation of a Student’s Attendance during an interval, showing
 * the Attendance status of each day in the interval.
 *
 * @param interval The start and end dates of the interval.
 * @param attendances The attendances of the Student during the interval.
 */
const AttendanceFigure: StylableFC<{
  interval: Interval;
  attendances: (Omit<StudentAttendance, "student"> & { date: string })[];
}> = ({ interval, attendances, style, className }) => {
  // Format the Attendances to be in the same length as the days in the
  // interval.
  const formattedAttendances = useMemo(() => {
    let result = attendances;
    const datesWithData = attendances.map((attendance) => attendance.date);

    // Add default Attendances for days without data.
    for (const daysSinceStart of list(
      differenceInDays(interval.end, interval.start),
    )) {
      const date = addDays(interval.start, daysSinceStart);
      if (datesWithData.includes(getISODateString(date))) continue;
      result.push({ ...DEFAULT_ATTENDANCE, date: getISODateString(date) });
    }

    // Sort the Attendances by date.
    return result.sort((a, b) => a.date.localeCompare(b.date));
  }, [attendances]);

  return (
    <figure
      style={style}
      className={cn(
        `flex h-20 flex-row items-center gap-0.5 md:h-14`,
        className,
      )}
    >
      {formattedAttendances?.map((attendance) => (
        <AttendanceFigureDay
          key={attendance.date}
          date={new Date(attendance.date)}
          interval={interval}
        >
          <div className="w-full space-y-[1px] overflow-hidden rounded-full">
            {(["assembly", "homeroom"] as AttendanceEvent[]).map((event) => (
              <AttendanceFigureEvent
                key={event}
                attendance={attendance[event]}
              />
            ))}
          </div>
        </AttendanceFigureDay>
      ))}
    </figure>
  );
};

export default AttendanceFigure;
