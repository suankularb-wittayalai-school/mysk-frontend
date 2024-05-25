import cn from "@/utils/helpers/cn";
import { StudentAttendance } from "@/utils/types/attendance";
import { Classroom } from "@/utils/types/classroom";
import { StylableFC } from "@/utils/types/common";
import { Card, CardHeader } from "@suankularb-components/react";
import { isWeekend } from "date-fns";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";

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
 * @param classroom The Classroom the Student is in.
 */
const TodayAttendanceCard: StylableFC<{
  attendance?: StudentAttendance["assembly"];
  classroom?: Pick<Classroom, "number">;
}> = ({ attendance, classroom, style, className }) => {
  const { t } = useTranslation("search/students/detail");

  const state = (() => {
    if (isWeekend(new Date())) return TodayAttendanceState.noSchool;
    if (attendance?.is_present) return TodayAttendanceState.present;
    if (attendance?.absence_type === "late") return TodayAttendanceState.late;
    if (attendance?.is_present === false) return TodayAttendanceState.absent;
    return TodayAttendanceState.noData;
  })();

  return (
    <Card
      appearance="outlined"
      {...(classroom
        ? {
            stateLayerEffect: true,
            href: `/classes/${classroom.number}/attendance`,
            element: Link,
          }
        : {})}
      style={style}
      className={cn(
        {
          present: `!bg-primary-container !text-on-primary-container
            state-layer:!bg-on-primary-container`,
          late: `!bg-tertiary-container !text-on-tertiary-container
            focus:!border-tertiary state-layer:!bg-on-tertiary-container`,
          absent: `!bg-error !text-on-error focus:!border-on-error
            state-layer:!bg-on-error`,
          noData: `!bg-surface-variant !text-on-surface-variant`,
          noSchool: `!bg-surface-variant !text-on-surface-variant`,
        }[state],
        `!border-transparent hover:!border-outline-variant
        focus:!border-primary`,
        className,
      )}
    >
      <CardHeader
        title={t(`attendance.today.title.${state}`)}
        subtitle={
          // Show the custom absence reason if available.
          attendance?.absence_reason ||
          // Show the absence type if the Student is absent.
          (state === TodayAttendanceState.absent && attendance?.absence_type
            ? t(`attendance.today.subtitle.${attendance.absence_type}`)
            : undefined)
        }
        className="!px-3 !py-2"
      />
    </Card>
  );
};

export default TodayAttendanceCard;
