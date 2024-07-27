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
  setAttendanceOfShownEvent: (
    eventAttendance: StudentAttendance[AttendanceEvent],
    options?: Partial<{ noSave: boolean }>,
  ) => void;
}> = ({
  attendance,
  shownEvent,
  setAttendanceOfShownEvent,
  style,
  className,
}) => {
  const { t } = useTranslation("attendance", { keyPrefix: "item" });
  return (
    <ChipSet style={style} className={className}>
      <InputChip
        onClick={() => {
          setAttendanceOfShownEvent({
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
        {t("chip.onTime")}
      </InputChip>
      <InputChip
        onClick={() => {
          setAttendanceOfShownEvent({
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
        {t("chip.late")}
      </InputChip>
      <InputChip
        onClick={() => {
          setAttendanceOfShownEvent({
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
        {t("chip.absent")}
      </InputChip>
    </ChipSet>
  );
};

export default AttendanceSelector;
