import {
  CheerAttendanceRecord,
  CheerAttendanceType,
} from "@/utils/types/cheer";
import { StylableFC } from "@/utils/types/common";
import { ChipSet, FilterChip } from "@suankularb-components/react";
import useTranslation from "next-translate/useTranslation";

/**
 * A Chip Set for selecting an Absence Type.
 *
 * @param attendance The Student’s Attendance at an Attendance Event.
 * @param editable - Whether the item can be edited.
 * @param onChange Triggers when the Attendance is changed. Should update the Attendance state.
 */
const CheerAbsenceTypeSelector: StylableFC<{
  attendance: CheerAttendanceRecord;
  editable: boolean;
  onChange: (attendance: CheerAttendanceRecord) => void;
}> = ({ attendance, editable, onChange, style, className }) => {
  const value = attendance.presence;
  const { t } = useTranslation("attendance/cheer/list");

  return (
    <ChipSet scrollable style={style} className={className}>
      <FilterChip
        selected={value == CheerAttendanceType.missing}
        onClick={() => {
          if (!editable) return;
          onChange({
            ...attendance,
            presence: CheerAttendanceType.missing,
          });
        }}
      >
        {t("chip.practice.absenceType.missing")}
      </FilterChip>
      <FilterChip
        selected={value == CheerAttendanceType.onLeaveNoRemedial}
        onClick={() => {
          if (!editable) return;
          onChange({
            ...attendance,
            presence: CheerAttendanceType.onLeaveNoRemedial,
          });
        }}
      >
        {t("chip.practice.absenceType.noRemedial")}
      </FilterChip>
      <FilterChip
        selected={value == CheerAttendanceType.onLeaveWithRemedial}
        onClick={() => {
          if (!editable) return;
          onChange({
            ...attendance,
            presence: CheerAttendanceType.onLeaveWithRemedial,
          });
        }}
      >
        {t("chip.practice.absenceType.withRemedial")}
      </FilterChip>
    </ChipSet>
  );
};

export default CheerAbsenceTypeSelector;
