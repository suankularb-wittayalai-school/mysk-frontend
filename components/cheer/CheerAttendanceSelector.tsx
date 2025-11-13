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
  isJatu: boolean;
  onChange: (
    attendance: CheerAttendanceRecord,
    event: CheerAttendanceEvent,
  ) => void;
}> = ({
  attendance,
  shownEvent,
  editable,
  isJatu,
  onChange,
  style,
  className,
}) => {
  const { t } = useTranslation("attendance/cheer/list");
  const locale = useLocale();
  function isAbsent(attendance: CheerAttendanceType | null): boolean {
    if (
      attendance == CheerAttendanceType.onLeaveNoRemedial ||
      attendance == CheerAttendanceType.onLeaveWithRemedial ||
      attendance == CheerAttendanceType.missing
    ) {
      return true;
    }
    // null is counted as not bsent
    return false;
  }

  const handleChange = (
    shownEvent: "start" | "end",
    presence: CheerAttendanceType,
  ) => {
    if (shownEvent === "start") {
      if (attendance.presence === presence) {
        onChange(
          {
            ...attendance,
            presence: null,
          },
          shownEvent,
        );
      } else if (
        presence === CheerAttendanceType.missing &&
        isAbsent(attendance.presence) === isAbsent(presence)
      ) {
        onChange(
          {
            ...attendance,
            presence: null,
          },
          shownEvent,
        );
      } else {
        onChange(
          {
            ...attendance,
            presence: presence,
          },
          shownEvent,
        );
      }
    }
    if (shownEvent === "end") {
      if (
        presence === CheerAttendanceType.present ||
        presence === CheerAttendanceType.missing ||
        presence === null
      ) {
        if (attendance.presence_at_end === presence) {
          onChange(
            {
              ...attendance,
              presence_at_end: null,
            },
            shownEvent,
          );
        } else {
          onChange(
            {
              ...attendance,
              presence_at_end: presence,
            },
            shownEvent,
          );
        }
      }
    }
  };

  return (
    <ChipSet style={style} className={className}>
      {shownEvent == "start" && !isJatu && (
        <>
          <InputChip
            onClick={() => {
              if (!editable) return;
              handleChange(shownEvent, CheerAttendanceType.present);
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
            <span className="-mx-1">{t("chip.practice.start.present")}</span>
          </InputChip>
          <InputChip
            onClick={() => {
              if (!editable) return;
              handleChange(shownEvent, CheerAttendanceType.late);
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
            <span className="-mx-1">{t("chip.practice.start.late")}</span>
          </InputChip>
          <InputChip
            onClick={() => {
              if (!editable) return;
              handleChange(shownEvent, CheerAttendanceType.missing);
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
            <span className="-mx-1">{t("chip.practice.start.absent")}</span>
          </InputChip>
        </>
      )}
      {shownEvent == "start" && isJatu && (
        <>
          <InputChip
            onClick={() => {
              if (!editable) return;
              handleChange(shownEvent, CheerAttendanceType.present);
            }}
            {...(attendance.presence == CheerAttendanceType.present
              ? {
                  selected: true,
                  className: cn(`!bg-primary-container
                  !text-on-primary-container
                  state-layer:!bg-on-primary-container`),
                }
              : null)}
          >
            <span className="-mx-1">{t("chip.jatu.start.present")}</span>
          </InputChip>
          <InputChip
            onClick={() => {
              if (!editable) return;
              handleChange(shownEvent, CheerAttendanceType.missing);
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
            <span className="-mx-1">{t("chip.jatu.start.absent")}</span>
          </InputChip>
        </>
      )}
      {shownEvent == "end" && !isJatu && (
        <>
          {!isAbsent(attendance.presence) && (
            <InputChip
              onClick={() => {
                if (!editable) return;
                handleChange(shownEvent, CheerAttendanceType.present);
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
              <span className="-mx-1">{t("chip.practice.end.present")}</span>
            </InputChip>
          )}
          <InputChip
            onClick={() => {
              if (!editable) return;
              handleChange(shownEvent, CheerAttendanceType.missing);
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
            <span className="-mx-1">{t("chip.practice.end.absent")}</span>
          </InputChip>
        </>
      )}
      {shownEvent == "end" && isJatu && (
        <>
          <InputChip
            onClick={() => {
              if (!editable) return;
              handleChange(shownEvent, CheerAttendanceType.present);
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
            <span className="-mx-1">{t("chip.jatu.end.present")}</span>
          </InputChip>

          <InputChip
            onClick={() => {
              if (!editable) return;
              handleChange(shownEvent, CheerAttendanceType.missing);
            }}
            {...(isAbsent(attendance.presence_at_end)
              ? {
                  selected: true,
                  className: cn(`!bg-secondary-container
                  !text-on-secondary-container
                  state-layer:!bg-on-secondary-container`),
                }
              : null)}
          >
            <span className="-mx-1">{t("chip.jatu.end.absent")}</span>
          </InputChip>
        </>
      )}
    </ChipSet>
  );
};

export default CheerAttendanceSelector;
