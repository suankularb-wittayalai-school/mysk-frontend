import AttendanceCountsGrid from "@/components/attendance/AttendanceCountsGrid";
import AttendanceFigure from "@/components/attendance/AttendanceFigure";
import PersonAvatar from "@/components/common/PersonAvatar";
import tallyAttendances from "@/utils/helpers/attendance/tallyAttendances";
import cn from "@/utils/helpers/cn";
import getLocaleName from "@/utils/helpers/getLocaleName";
import getLocaleString from "@/utils/helpers/getLocaleString";
import useLocale from "@/utils/helpers/useLocale";
import { StudentAttendance } from "@/utils/types/attendance";
import { StylableFC } from "@/utils/types/common";
import { Card, CardHeader } from "@suankularb-components/react";
import { getDaysInMonth } from "date-fns";
import { useTranslation } from "next-i18next";
import { sift } from "radash";

/**
 * A card to display a Student’s Attendance in a month, with a summary of the
 * Attendance counts.
 *
 * @param student The Student to display the Attendance for.
 * @param date The first date of the month to display the Attendance for.
 * @param attendances The Student’s Attendance records for the month.
 */
const MonthStudentCard: StylableFC<{
  student: StudentAttendance["student"];
  date: Date;
  attendances: (Omit<StudentAttendance, "student"> & { date: string })[];
}> = ({ student, attendances, date, style, className }) => {
  const locale = useLocale();
  const { t } = useTranslation("attendance", { keyPrefix: "month" });

  const interval = {
    start: date.setDate(1),
    end: date.setDate(getDaysInMonth(date)),
  };

  /**
   * Count the number of Attendance records for each type of Attendance.
   */
  const counts = tallyAttendances(
    attendances.map((attendance) => attendance.assembly),
  );

  return (
    <Card
      appearance="outlined"
      style={style}
      className={cn(
        `md:!grid md:!grid-cols-[minmax(0,3fr),minmax(0,7fr),minmax(0,2fr)]
        md:!items-center md:!gap-6 md:!rounded-none md:!border-0
        md:!border-b-1 md:!bg-transparent`,
        className,
      )}
    >
      <CardHeader
        avatar={
          <PersonAvatar
            {...student}
            expandable
            size={40}
            className="!my-0 !h-12"
          />
        }
        title={getLocaleName(locale, student)}
        subtitle={sift([
          t("item.classNo", { classNo: student.class_no }),
          student.nickname?.th && getLocaleString(student.nickname, locale),
        ]).join(" • ")}
        className={cn(`!grid grid-cols-[2.5rem,minmax(0,1fr)]
          [&>:nth-child(2)>*]:!truncate [&>:nth-child(2)>span]:block`)}
      />
      <div className="overflow-auto md:contents">
        <AttendanceFigure
          interval={interval}
          attendances={attendances}
          className={cn(`w-fit px-4 md:w-full md:px-0
            md:[&>*:not([role=separator])>*:first-child]:hidden
            md:[&_[role=separator]]:h-[calc(3rem+1px)]`)}
        />
      </div>
      <AttendanceCountsGrid counts={counts} className="p-4 pb-3" />
    </Card>
  );
};

export default MonthStudentCard;
