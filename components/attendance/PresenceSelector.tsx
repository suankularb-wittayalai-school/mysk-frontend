// Imports
import PresenceSelectorItem from "@/components/classes/PresenceSelectorItem";
import cn from "@/utils/helpers/cn";
import {
  AttendanceEvent,
  StudentAttendance,
} from "@/utils/types/attendance";
import { StylableFC } from "@/utils/types/common";
import { MaterialIcon, SegmentedButton } from "@suankularb-components/react";
import { useTranslation } from "next-i18next";

/**
 * A selector for the presence status of a Student in Attendance List Item.
 *
 * @param attendance The Attendance record to display the presence of.
 * @param editable Whether the Attendance record is editable or not, depending on the user role.
 * @param onAttendanceChange Callback function to handle changes to the attendance record.
 */
const PresenceSelector: StylableFC<{
  attendance: StudentAttendance[AttendanceEvent];
  editable?: boolean;
  onAttendanceChange: (
    attendance: StudentAttendance[AttendanceEvent],
  ) => void;
}> = ({ attendance, editable, onAttendanceChange, style, className }) => {
  const { t } = useTranslation("attendance", { keyPrefix: "item" });

  return (
    <SegmentedButton
      alt={t("presence.title")}
      style={style}
      className={className}
    >
      {/* Present */}
      <PresenceSelectorItem
        icon={<MaterialIcon icon="check" />}
        tooltip={t("presence.present")}
        readOnly={!editable}
        onClick={() =>
          onAttendanceChange({
            ...attendance,
            is_present: true,
            absence_type: null,
            absence_reason: null,
          })
        }
        className={cn(
          attendance.is_present
            ? `!bg-primary-container !text-primary`
            : `!text-on-surface state-layer:!bg-on-surface`,
        )}
      />

      {/* Late */}
      <PresenceSelectorItem
        icon={<MaterialIcon icon="running_with_errors" />}
        tooltip={t("presence.late")}
        readOnly={!editable}
        onClick={() =>
          onAttendanceChange({
            ...attendance,
            is_present: false,
            absence_type: "late",
          })
        }
        className={cn(
          attendance.is_present === false && attendance.absence_type === "late"
            ? `!bg-tertiary-container !text-on-tertiary-container
              state-layer:!bg-on-tertiary-container`
            : `!text-on-surface state-layer:!bg-on-surface`,
        )}
      />

      {/* Absent */}
      <PresenceSelectorItem
        icon={<MaterialIcon icon="close" />}
        tooltip={t("presence.absent")}
        readOnly={!editable}
        onClick={() =>
          onAttendanceChange({
            ...attendance,
            is_present: false,
            absence_type: "on_leave",
          })
        }
        className={cn(
          attendance.is_present === false && attendance.absence_type !== "late"
            ? `!bg-error !text-on-error state-layer:!bg-on-error`
            : `skc-button--dangerous`,
        )}
      />
    </SegmentedButton>
  );
};

export default PresenceSelector;
