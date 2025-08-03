import cn from "@/utils/helpers/cn";
import {
  CheerAttendanceEvent,
  CheerAttendanceRecord,
  CheerAttendanceType,
} from "@/utils/types/cheer";
import { StylableFC } from "@/utils/types/common";
import { ChipSet, InputChip } from "@suankularb-components/react";
import useTranslation from "next-translate/useTranslation";

const CheerAttendanceSelector: StylableFC<{
  attendance: CheerAttendanceRecord;
  shownEvent: CheerAttendanceEvent;
  editable: boolean;
  onChange: (
    attendance: CheerAttendanceRecord,
    event: CheerAttendanceEvent,
  ) => void;
}> = ({ attendance, shownEvent, editable, onChange, style, className }) => {
  const { t } = useTranslation("attendance/cheer/list");
  
  return (
    <ChipSet style={style} className={className}>
      {shownEvent == "start" && (
        <>
          <InputChip
            onClick={() => {
              if (!editable) return;
              onChange(
                {
                  ...attendance,
                  presence: CheerAttendanceType.present,
                  presence_at_end: CheerAttendanceType.present,
                },
                shownEvent,
              );
            }}
            {...(attendance.presence === CheerAttendanceType.present
              ? {
                  selected: true,
                  className: cn(`!bg-primary-container
                  !text-on-primary-container
                  state-layer:!bg-on-primary-container`),
                }
              : null)}
          >
            <span className="-mx-1">{t("chip.start.present")}</span>
          </InputChip>
          <InputChip
            onClick={() => {
              if (!editable) return;
              onChange(
                {
                  ...attendance,
                  presence: CheerAttendanceType.late,
                  presence_at_end: CheerAttendanceType.present,
                },
                shownEvent,
              );
            }}
            {...(attendance.presence == CheerAttendanceType.late
              ? {
                  selected: true,
                  className: cn(`!bg-tertiary-container
                  !text-on-tertiary-container
                  state-layer:!bg-on-tertiary-container`),
                }
              : null)}
          >
            <span className="-mx-1">{t("chip.start.late")}</span>
          </InputChip>
          <InputChip
            onClick={() => {
              if (!editable) return;
              onChange(
                {
                  ...attendance,
                  presence: CheerAttendanceType.absentNoRemedial,
                  presence_at_end: CheerAttendanceType.missing,
                },
                shownEvent,
              );
            }}
            {...(attendance.presence == CheerAttendanceType.absentNoRemedial ||
            attendance.presence == CheerAttendanceType.absentWithRemedial ||
            attendance.presence == CheerAttendanceType.missing
              ? {
                  selected: true,
                  className: cn(`!bg-secondary-container
                  !text-on-secondary-container
                  state-layer:!bg-on-secondary-container`),
                }
              : null)}
          >
            <span className="-mx-1">{t("chip.start.absent")}</span>
          </InputChip>
        </>
      )}
      {shownEvent == "end" && (
        <>
          {(attendance.presence == CheerAttendanceType.present ||
            attendance.presence == CheerAttendanceType.late) && (
            <InputChip
              onClick={() => {
                if (!editable) return;
                onChange(
                  {
                    ...attendance,
                    presence_at_end: CheerAttendanceType.present,
                  },
                  shownEvent,
                );
              }}
              {...(attendance.presence_at_end == CheerAttendanceType.present
                ? {
                    selected: true,
                    className: cn(`!bg-primary-container
                  !text-on-primary-container
                  state-layer:!bg-on-primary-container`),
                  }
                : null)}
            >
              <span className="-mx-1">{t("chip.end.present")}</span>
            </InputChip>
          )}
          <InputChip
            onClick={() => {
              if (!editable) return;
              onChange(
                {
                  ...attendance,
                  presence_at_end: CheerAttendanceType.missing,
                },
                shownEvent,
              );
            }}
            {...(attendance.presence_at_end == CheerAttendanceType.missing
              ? {
                  selected: true,
                  className: cn(`!bg-secondary-container
                  !text-on-secondary-container
                  state-layer:!bg-on-secondary-container`),
                }
              : null)}
          >
            <span className="-mx-1">{t("chip.end.absent")}</span>
          </InputChip>
        </>
      )}
    </ChipSet>
  );
};

export default CheerAttendanceSelector;
