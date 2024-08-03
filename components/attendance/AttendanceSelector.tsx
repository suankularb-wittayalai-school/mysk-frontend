import cn from "@/utils/helpers/cn";
import {
  AbsenceType,
  AttendanceEvent,
  StudentAttendance,
} from "@/utils/types/attendance";
import { StylableFC } from "@/utils/types/common";
import { ChipSet, InputChip } from "@suankularb-components/react";
import { useTranslation } from "next-i18next";

const AttendanceSelector: StylableFC<{
  attendance: StudentAttendance;
  shownEvent: AttendanceEvent;
  onChange: (attendance: StudentAttendance[AttendanceEvent]) => void;
}> = ({ attendance, shownEvent, onChange, style, className }) => {
  const { t } = useTranslation("attendance", { keyPrefix: "item" });
  return (
    <ChipSet style={style} className={className}>
      <InputChip
        onClick={() => {
          onChange({
            ...attendance[shownEvent],
            is_present: true,
            absence_type: null,
            absence_reason: null,
          });
        }}
        {...(attendance[shownEvent].is_present === true
          ? {
              selected: true,
              className: cn(`!bg-primary-container
              !text-on-primary-container
              state-layer:!bg-on-primary-container`),
            }
          : null)}
      >
        <span className="-mx-1">{t("chip.onTime")}</span>
      </InputChip>
      <InputChip
        onClick={() => {
          onChange({
            ...attendance[shownEvent],
            is_present: false,
            absence_type: AbsenceType.late,
            absence_reason: null,
          });
        }}
        {...(attendance[shownEvent].absence_type === AbsenceType.late
          ? {
              selected: true,
              className: cn(`!bg-tertiary-container
              !text-on-tertiary-container
              state-layer:!bg-on-tertiary-container`),
            }
          : null)}
      >
        <span className="-mx-1">{t("chip.late")}</span>
      </InputChip>
      <InputChip
        onClick={() => {
          onChange({
            ...attendance[shownEvent],
            is_present: false,
            absence_type: AbsenceType.sick,
          });
        }}
        {...(attendance[shownEvent].is_present === false &&
        attendance[shownEvent].absence_type !== AbsenceType.late
          ? {
              selected: true,
              className: cn(`!bg-secondary-container
              !text-on-secondary-container
              state-layer:!bg-on-secondary-container`),
            }
          : null)}
      >
        <span className="-mx-1">{t("chip.absent")}</span>
      </InputChip>
    </ChipSet>
  );
};

export default AttendanceSelector;
