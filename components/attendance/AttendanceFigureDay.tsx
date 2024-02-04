import AttendanceFigureEvent from "@/components/attendance/AttendanceFigureEvent";
import cn from "@/utils/helpers/cn";
import { AttendanceEvent, StudentAttendance } from "@/utils/types/attendance";
import { StylableFC } from "@/utils/types/common";
import { Text } from "@suankularb-components/react";
import { isSaturday, isSunday } from "date-fns";
import { useTranslation } from "next-i18next";
import { ReactNode } from "react";

/**
 * A day in Attendance Figure.
 *
 * @param children Content.
 * @param date The date of the day.
 */
const AttendanceFigureDay: StylableFC<{
  children: ReactNode;
  date: Date;
}> = ({ children, date, style, className }) => {
  const { t } = useTranslation("attendance", { keyPrefix: "month" });

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
        {t("item.day", { date })}
      </Text>
      {children}
    </div>
  );
};

export default AttendanceFigureDay;
