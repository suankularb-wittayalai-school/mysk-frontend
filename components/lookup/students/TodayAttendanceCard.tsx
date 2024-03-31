import cn from "@/utils/helpers/cn";
import { StudentAttendance } from "@/utils/types/attendance";
import { StylableFC } from "@/utils/types/common";
import { Card, CardHeader } from "@suankularb-components/react";
import { isWeekend } from "date-fns";
import { useTranslation } from "next-i18next";

enum TodayAttendanceState {
  present = "present",
  late = "late",
  absent = "absent",
  noData = "noData",
  noSchool = "noSchool",
}

/**
 * A Card displaying the Student’s Attendance status today.
 * 
 * @param attendance The Student’s Attendance record at assembly for today.
 */
const TodayAttendanceCard: StylableFC<{
  attendance?: StudentAttendance["assembly"];
}> = ({ attendance, style, className }) => {
  const { t } = useTranslation("lookup", {
    keyPrefix: "students.detail.attendance.today",
  });

  const state = (() => {
    if (isWeekend(new Date())) return TodayAttendanceState.noSchool;
    if (attendance?.is_present) return TodayAttendanceState.present;
    if (attendance?.absence_type === "late") return TodayAttendanceState.late;
    if (attendance?.is_present === false) return TodayAttendanceState.absent;
    return TodayAttendanceState.noData;
  })();

  return (
    <Card
      appearance="filled"
      style={style}
      className={cn(
        {
          present: `!bg-primary-container !text-on-primary-container`,
          late: `!bg-tertiary-container !text-on-tertiary-container`,
          absent: `!bg-error !text-on-error`,
          noData: null,
          noSchool: null,
        }[state],
        className,
      )}
    >
      <CardHeader
        title={t(`title.${state}`)}
        subtitle={
          // Show the custom absence reason if available.
          attendance?.absence_reason ||
          // Show the absence type if the Student is absent.
          (state === TodayAttendanceState.absent && attendance?.absence_type
            ? t(`subtitle.${attendance.absence_type}`)
            : undefined)
        }
        className="!px-3 !py-2"
      />
    </Card>
  );
};

export default TodayAttendanceCard;
