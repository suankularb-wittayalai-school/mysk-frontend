import getAttendanceOfStudent from "@/utils/backend/attendance/getAttendanceOfStudent";
import cn from "@/utils/helpers/cn";
import { AttendanceEvent } from "@/utils/types/attendance";
import { StylableFC } from "@/utils/types/common";
import { Student, UserRole } from "@/utils/types/person";
import { Button, MaterialIcon } from "@suankularb-components/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import va from "@vercel/analytics";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { title } from "radash";
import { useEffect, useState } from "react";

/**
 * A Button for viewing/taking Attendance of Students in Home Glance.
 *
 * @param role The user’s role.
 * @param student The Student viewing this page.
 */
const AttendanceButton: StylableFC<{
  role: UserRole;
  attendanceEvent: AttendanceEvent;
  student?: Pick<Student, "id" | "classroom">;
}> = ({ role, attendanceEvent, student, style, className }) => {
  const { t } = useTranslation("schedule", {
    keyPrefix: "atAGlance.action.attendance",
  });

  const supabase = useSupabaseClient();
  const [isPresent, setIsPresent] = useState<boolean | null>(null);

  // Get the Attendance of the Student.
  useEffect(() => {
    if (!student) return;
    (async () => {
      const { data, error } = await getAttendanceOfStudent(
        supabase,
        student.id,
        new Date(2024, 1, 1),
      );
      if (error) return;
      setIsPresent(data![attendanceEvent].is_present);
    })();
  }, []);

  if (!student?.classroom) return null;

  return (
    <Button
      appearance={isPresent === null ? "tonal" : "filled"}
      icon={<MaterialIcon icon="assignment_turned_in" />}
      dangerous={isPresent === false}
      onClick={() =>
        va.track("View Attendance", {
          location: "Home Glance",
          role: title(role),
          number: `M.${student.classroom!.number}`,
          isOwnClass: true,
        })
      }
      href={`/classes/${student.classroom.number}/attendance`}
      element={Link}
      style={style}
      className={cn(
        isPresent === null &&
          `!bg-surface !text-on-surface state-layer:!bg-primary`,
        className,
      )}
    >
      {isPresent === null
        ? t("unknown", { context: role })
        : isPresent
          ? t("present")
          : t("absent")}
    </Button>
  );
};

export default AttendanceButton;
