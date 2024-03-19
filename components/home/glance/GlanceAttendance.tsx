// Imports
import { Classroom } from "@/utils/types/classroom";
import { StylableFC } from "@/utils/types/common";
import { UserRole } from "@/utils/types/person";
import { Actions, Button, MaterialIcon } from "@suankularb-components/react";
import va from "@vercel/analytics";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { title } from "radash";

/**
 * A Button for viewing/taking Attendance of Students in Home Glance.
 *
 * @param role The user’s role.
 * @param classroom The Classroom to view/take Attendance for.
 */
const GlanceAttendance: StylableFC<{
  role: UserRole;
  classroom: Pick<Classroom, "number">;
}> = ({ role, classroom, style, className }) => {
  const { t } = useTranslation("schedule", {
    keyPrefix: "atAGlance.action.attendance",
  });

  return (
    <Actions align="left" style={style} className={className}>
      <Button
        appearance="tonal"
        icon={<MaterialIcon icon="assignment_turned_in" />}
        onClick={() =>
          va.track("View Attendance", {
            location: "Home Glance",
            role: title(role),
            number: `M.${classroom.number}`,
            isOwnClass: true,
          })
        }
        href={`/classes/${classroom.number}/attendance`}
        element={Link}
        className="!bg-surface !text-on-surface state-layer:!bg-primary"
      >
        {role === "teacher" ? t("take") : t("view")}
      </Button>
    </Actions>
  );
};

export default GlanceAttendance;
