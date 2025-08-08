import cn from "@/utils/helpers/cn";
import useLocale from "@/utils/helpers/useLocale";
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
  const locale = useLocale();
  function isAbsent(attendance: CheerAttendanceType | null): boolean {
    if (
      attendance == CheerAttendanceType.absentNoRemedial ||
      attendance == CheerAttendanceType.absentWithRemedial ||
      attendance == CheerAttendanceType.missing
    ) {
      return true;
    }
    // null is counted as not bsent
    return false;
  }

  return (
    <ChipSet style={style} className={className}>
      {shownEvent == "start" && (
        <>
          <InputChip
            onClick={() => {
              if (!editable) return;
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
            }}
            {...(isAbsent(attendance.presence)
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
          {!isAbsent(attendance.presence) && (
            <InputChip
              onClick={() => {
                if (!editable) return;
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
            }}
            {...(isAbsent(attendance.presence_at_end)
              ? {
                  selected: true,
                  className: cn(`!bg-secondary-container
                  !text-on-secondary-container
                  state-layer:!bg-on-secondary-container`),
                }
              : null)}
            {...(isAbsent(attendance.presence)
              ? {
                  className: locale == "en-US" ? "w-[73px]" : "w-[101px]",
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
