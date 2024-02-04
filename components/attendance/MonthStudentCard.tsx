import AttendanceFigure from "@/components/attendance/AttendanceFigure";
import PersonAvatar from "@/components/common/PersonAvatar";
import getAttendanceSummary from "@/utils/helpers/attendance/getAttendanceSummary";
import cn from "@/utils/helpers/cn";
import getLocaleName from "@/utils/helpers/getLocaleName";
import getLocaleString from "@/utils/helpers/getLocaleString";
import useLocale from "@/utils/helpers/useLocale";
import { AbsenceType, StudentAttendance } from "@/utils/types/attendance";
import { StylableFC } from "@/utils/types/common";
import { Card, CardHeader, MaterialIcon } from "@suankularb-components/react";
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

  /**
   * Count the number of Attendance records for each type of Attendance.
   */
  const counts = getAttendanceSummary(
    attendances.map((attendance) => attendance.assembly),
  );

  return (
    <Card
      appearance="outlined"
      style={style}
      className={cn(
        `md:!grid md:!grid-cols-[minmax(0,3fr),minmax(0,7fr),minmax(0,2fr)]
        md:!items-center md:!rounded-none md:!border-0 md:!border-b-1
        md:!bg-transparent`,
        className,
      )}
    >
      <CardHeader
        avatar={<PersonAvatar {...student} expandable className="!my-0" />}
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
          date={date}
          attendances={attendances}
          className="w-fit px-4 md:w-full"
        />
      </div>
      <ul
        className={cn(`flex flex-row flex-wrap items-center gap-x-1 p-4 pb-3
          *:flex *:min-w-8 *:flex-row`)}
      >
        <li title={t("legend.present")}>
          <MaterialIcon icon="done" size={20} className="text-primary" />
          <span>{counts.present}</span>
        </li>
        <li title={t("legend.late")}>
          <MaterialIcon icon="alarm" size={20} className="text-tertiary" />
          <span>{counts.late}</span>
        </li>
        <li title={t("legend.onLeave")}>
          <MaterialIcon
            icon="close"
            size={20}
            className="text-on-surface-variant"
          />
          <span>{counts.onLeave}</span>
        </li>
        <li title={t("legend.absent")}>
          <MaterialIcon icon="close" size={20} className="text-error" />
          <span>{counts.absent}</span>
        </li>
      </ul>
    </Card>
  );
};

export default MonthStudentCard;
