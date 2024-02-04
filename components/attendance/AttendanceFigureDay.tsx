import AttendanceFigureEvent from "@/components/attendance/AttendanceFigureEvent";
import cn from "@/utils/helpers/cn";
import useLocale from "@/utils/helpers/useLocale";
import { AttendanceEvent, StudentAttendance } from "@/utils/types/attendance";
import { StylableFC } from "@/utils/types/common";
import { Text } from "@suankularb-components/react";
import { isSaturday, isSunday } from "date-fns";

/**
 * A day in Attendance Figure, showing the Attendance status of both Events of
 * the day.
 *
 * @param date The date of the day.
 * @param attendance The Attendance status of both Events of the day.
 */
const AttendanceFigureDay: StylableFC<{
  date: Date;
  attendance: {
    [key in AttendanceEvent]: StudentAttendance[AttendanceEvent] | null;
  };
}> = ({ date, attendance, style, className }) => {
  const locale = useLocale();

  // Show Divider on weekends.
  if (isSaturday(date))
    return (
      <div
        role="separator"
        className="h-[calc(4rem+1px)] px-1 md:h-[calc(3rem+1px)]"
      >
        <div
          aria-hidden
          className="h-full w-0 border-r-1 border-r-outline-variant"
        />
      </div>
    );
  if (isSunday(date)) return null;

  return (
    <div
      style={style}
      className={cn(
        `flex w-[1.375rem] flex-col items-center md:w-full`,
        className,
      )}
    >
      <Text type="label-small" className="text-on-surface-variant md:hidden">
        {date.toLocaleDateString(locale, { day: "numeric" })}
      </Text>
      <div className="w-full space-y-[1px] overflow-hidden rounded-full">
        {(["assembly", "homeroom"] as AttendanceEvent[]).map((event) => (
          <AttendanceFigureEvent key={event} attendance={attendance[event]} />
        ))}
      </div>
    </div>
  );
};

export default AttendanceFigureDay;
