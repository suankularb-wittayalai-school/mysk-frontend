import {
  AbsenceType,
  AttendanceEvent,
  StudentAttendance,
} from "@/utils/types/attendance";
import { StylableFC } from "@/utils/types/common";
import { ChipSet, FilterChip } from "@suankularb-components/react";
import { useTranslation } from "next-i18next";

/**
 * The text to put in the `absence_reason` field when the absence is due to
 * COVID-19.
 */
const COVID_REASON = "COVID-19";

/**
 * A Chip Set for selecting an Absence Type.
 *
 * @param attendance The Student’s Attendance at an Attendance Event.
 * @param onChange Triggers when the Attendance is changed. Should update the Attendance state.
 */
const AbsenceTypeSelector: StylableFC<{
  attendance: StudentAttendance[AttendanceEvent];
  onChange: (attendance: StudentAttendance[AttendanceEvent]) => void;
}> = ({ attendance, onChange, style, className }) => {
  const { t } = useTranslation("attendance", { keyPrefix: "item.absenceType" });

  const value = attendance.absence_type;

  /**
   * Handles changing the Absence Type.
   * @param type The new Absence Type.
   */
  function handleTypeChange(type: AbsenceType) {
    onChange({
      ...attendance,
      is_present: false,
      absence_type: type,
      absence_reason:
        attendance.absence_reason === COVID_REASON
          ? null
          : attendance.absence_reason,
    });
  }

  return (
    <ChipSet scrollable style={style} className={className}>
      <FilterChip
        selected={
          value === AbsenceType.sick &&
          attendance.absence_reason !== COVID_REASON
        }
        onClick={() => handleTypeChange(AbsenceType.sick)}
      >
        {t("sick")}
      </FilterChip>
      <FilterChip
        selected={attendance.absence_reason === COVID_REASON}
        onClick={() =>
          onChange({
            ...attendance,
            is_present: false,
            absence_type: AbsenceType.sick,
            absence_reason: COVID_REASON,
          })
        }
      >
        {t("covid")}
      </FilterChip>
      <FilterChip
        selected={value === AbsenceType.activity}
        onClick={() =>
          onChange({
            ...attendance,
            is_present: true,
            absence_type: AbsenceType.activity,
            absence_reason: null,
          })
        }
      >
        {t("activity")}
      </FilterChip>
      <FilterChip
        selected={value === AbsenceType.business}
        onClick={() => handleTypeChange(AbsenceType.business)}
      >
        {t("business")}
      </FilterChip>
      <FilterChip
        selected={value === AbsenceType.absent}
        onClick={() => handleTypeChange(AbsenceType.absent)}
      >
        {t("absent")}
      </FilterChip>
      <FilterChip
        selected={value === AbsenceType.dropped}
        onClick={() => handleTypeChange(AbsenceType.dropped)}
      >
        {t("dropped")}
      </FilterChip>
      <FilterChip
        selected={value === AbsenceType.other}
        onClick={() => handleTypeChange(AbsenceType.other)}
      >
        {t("other")}
      </FilterChip>
    </ChipSet>
  );
};

export default AbsenceTypeSelector;
