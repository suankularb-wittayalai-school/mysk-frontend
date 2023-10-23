// Imports
import { StylableFC } from "@/utils/types/common";
import { UserRole } from "@/utils/types/person";
import { Actions, Button, MaterialIcon } from "@suankularb-components/react";
import { useTranslation } from "next-i18next";

/**
 * A Button for viewing/taking Attendance of Students in Home Glance.
 * 
 * @param role The user’s role.
 * @param onOpen Triggers when the Button to open the Attendence Dialog is pressed.
 */
const GlanceAttendance: StylableFC<{
  role: UserRole;
  onOpen: () => void;
}> = ({ role, onOpen, style, className }) => {
  const { t } = useTranslation("classes", {
    keyPrefix: "header.action.attendance",
  });

  return (
    <Actions align="left" style={style} className={className}>
      <Button
        appearance="tonal"
        icon={<MaterialIcon icon="assignment_turned_in" />}
        onClick={onOpen}
        className="!bg-surface !text-on-surface state-layer:!bg-primary"
      >
        {role === "teacher" ? t("take") : t("view")}
      </Button>
    </Actions>
  );
};

export default GlanceAttendance;
