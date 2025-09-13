import {
  CheerAttendanceRecord,
  CheerAttendanceType,
} from "@/utils/types/cheer";
import { StylableFC } from "@/utils/types/common";
import { ChipSet, FilterChip } from "@suankularb-components/react";
import useTranslation from "next-translate/useTranslation";

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
        {t("chip.absenceType.missing")}
      </FilterChip>
      <FilterChip
        selected={value == CheerAttendanceType.absentNoRemedial}
        onClick={() => {
          if (!editable) return;
          onChange({
            ...attendance,
            presence: CheerAttendanceType.absentNoRemedial,
          });
        }}
      >
        {t("chip.absenceType.noRemedial")}
      </FilterChip>
      <FilterChip
        selected={value == CheerAttendanceType.absentWithRemedial}
        onClick={() => {
          if (!editable) return;
          onChange({
            ...attendance,
            presence: CheerAttendanceType.absentWithRemedial,
          });
        }}
      >
        {t("chip.absenceType.withRemedial")}
      </FilterChip>
    </ChipSet>
  );
};

export default CheerAbsenceTypeSelector;
