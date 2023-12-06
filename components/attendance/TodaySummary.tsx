// Imports
import { StudentAttendance } from "@/utils/types/attendance";
import { StylableFC } from "@/utils/types/common";
import { Button, MaterialIcon, Text } from "@suankularb-components/react";
import { useTranslation } from "next-i18next";

/**
 * Today Summary displays a quick summary of Attendance for the Date Attendance
 * page.
 *
 * @param attendances The Attendance data to be summarized.
 *
 * @todo Add homeroom description.
 */
const TodaySummary: StylableFC<{
  attendances: StudentAttendance[];
}> = ({ attendances }) => {
  const { t } = useTranslation("attendance", { keyPrefix: "today" });

  // Count the number of students who are marked as late at Assembly.
  // Since being ”late” refers to arrving late to Assembly, we only count those
  // who are marked as late at Assembly.
  const lateCount = attendances.filter(
    (attendance) => attendance.assembly.absence_type === "late",
  ).length;

  // Count the number of students who are absent.
  const absenceCount = attendances.filter((attendance) => {
    const availableAttendance =
      attendance[
        // Use the event that has complete data.
        attendances.every(
          (attendance) => attendance.homeroom.is_present !== null,
        )
          ? "homeroom"
          : "assembly"
      ];
    // Count only those who are absent, not late.
    return (
      availableAttendance.is_present === false &&
      availableAttendance.absence_type !== "late"
    );
  }).length;

  return (
    <div>
      {/* Quick summary */}
      <Text type="headline-small" element="h2" className="mb-2">
        {t("title", { late: lateCount, absent: absenceCount })}
      </Text>

      {/* TODO: homeroom description */}
      <Button appearance="tonal" icon={<MaterialIcon icon="add" />}>
        {t("homeroom.action.add")}
      </Button>
    </div>
  );
};

export default TodaySummary;
