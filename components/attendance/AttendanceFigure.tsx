import AttendanceFigureDay from "@/components/attendance/AttendanceFigureDay";
import AttendanceFigureEvent from "@/components/attendance/AttendanceFigureEvent";
import cn from "@/utils/helpers/cn";
import getISODateString from "@/utils/helpers/getISODateString";
import { AttendanceEvent, StudentAttendance } from "@/utils/types/attendance";
import { StylableFC } from "@/utils/types/common";
import { getDaysInMonth } from "date-fns";
import { list } from "radash";

/**
 * A visual representation of a Student’s Attendance during a month, showing the
 * Attendance status of each day in the month.
 *
 * @param date `YYYY-MM` of the month.
 * @param attendances The attendances of the Student during the month.
 */
const AttendanceFigure: StylableFC<{
  date: Date;
  attendances: (Omit<StudentAttendance, "student"> & { date: string })[];
}> = ({ date, attendances, style, className }) => {
  // Format the Attendances to be in the same length as the days in the month.
  const formattedAttendances = (() => {
    const result = list(getDaysInMonth(date) - 1).map((day) => ({
      assembly: null,
      homeroom: null,
      date: getISODateString(new Date(date.setDate(day + 1))),
    })) as ({
      [key in AttendanceEvent]: StudentAttendance[AttendanceEvent] | null;
    } & { date: string })[];
    for (const attendance of attendances) {
      result[Number(attendance.date.substring(8, 10)) - 1] = attendance;
    }
    return result;
  })();

  return (
    <figure
      style={style}
      className={cn(
        `flex h-20 flex-row items-center gap-0.5 md:h-14`,
        className,
      )}
    >
      {formattedAttendances.map((attendance) => (
        <AttendanceFigureDay
          key={attendance.date}
          date={new Date(attendance.date)}
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
