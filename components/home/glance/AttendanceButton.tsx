import getAttendanceOfStudent from "@/utils/backend/attendance/getAttendanceOfStudent";
import cn from "@/utils/helpers/cn";
import { AttendanceEvent } from "@/utils/types/attendance";
import { Classroom } from "@/utils/types/classroom";
import { StylableFC } from "@/utils/types/common";
import { UserRole } from "@/utils/types/person";
import { Button, MaterialIcon } from "@suankularb-components/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { usePlausible } from "next-plausible";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { title } from "radash";
import { useEffect, useState } from "react";

/**
 * A Button for viewing/taking Attendance of Students in Home Glance.
 *
 * @param role The user’s role.
 * @param attendanceEvent The current Attendance Event.
 * @param studentID The Student’s database ID. Used in fetching Attendance.
 * @param classroom The Classroom the user is in. Used for linking Attendance.
 */
const AttendanceButton: StylableFC<{
  role: UserRole;
  attendanceEvent: AttendanceEvent;
  studentID?: string;
  classroom?: Pick<Classroom, "number">;
}> = ({ role, attendanceEvent, studentID, classroom, style, className }) => {
  const { t } = useTranslation("glance/schedule");

  const plausible = usePlausible();
  const supabase = useSupabaseClient();

  const [isPresent, setIsPresent] = useState<boolean | null>(null);

  // Get the Attendance of the Student.
  useEffect(() => {
    if (!studentID) return;
    (async () => {
      const { data, error } = await getAttendanceOfStudent(
        supabase,
        studentID,
        new Date(),
      );
      if (error) return;
      setIsPresent(data![attendanceEvent].is_present);
    })();
  }, []);

  if (!classroom) return null;

  return (
    <Button
      appearance={isPresent === null ? "tonal" : "filled"}
      icon={<MaterialIcon icon="assignment_turned_in" />}
      dangerous={isPresent === false}
      onClick={() =>
        plausible("View Attendance", {
          props: {
            location: "Schedule Glance",
            role: title(role),
            number: `M.${classroom.number}`,
            isOwnClass: true,
          },
        })
      }
      href={`/classes/${classroom.number}/attendance`}
      element={Link}
      style={style}
      className={cn(
        isPresent === null &&
          `!bg-surface !text-on-surface state-layer:!bg-primary`,
        className,
      )}
    >
      {t(
        `action.attendance.${
          isPresent === null
            ? `unknown.${role}`
            : isPresent
              ? "present"
              : "absent"
        }`,
      )}
    </Button>
  );
};

export default AttendanceButton;
