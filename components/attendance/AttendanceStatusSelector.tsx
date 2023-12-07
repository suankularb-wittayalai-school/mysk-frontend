import AbsenceTypeSelector from "@/components/attendance/AbsenceTypeSelector";
import PresenceSelector from "@/components/attendance/PresenceSelector";
import cn from "@/utils/helpers/cn";
import useLocale from "@/utils/helpers/useLocale";
import { AttendanceEvent, StudentAttendance } from "@/utils/types/attendance";
import { StylableFC } from "@/utils/types/common";
import {
  TextField,
  transition,
  useAnimationConfig,
} from "@suankularb-components/react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "next-i18next";

/**
 * A selector for the Attendance status, including presence, absence type, and
 * absence reason.
 *
 * @param attendance The Attendance of a Student at either assembly or homeroom.
 * @param editable Whether the Attendance is editable.
 * @param onAttendanceChange Callback when the Attendance is changed.
 *
 * @note
 * `attendance` and `onAttendanceChange` accepts only either the `assembly` or
 * `homeroom` property of Student Attendance.
 */
const AttendanceStatusSelector: StylableFC<{
  attendance: StudentAttendance[AttendanceEvent];
  editable?: boolean;
  onAttendanceChange: (attendance: StudentAttendance[AttendanceEvent]) => void;
}> = ({ attendance, editable, onAttendanceChange, style, className }) => {
  const locale = useLocale();
  const { t } = useTranslation("attendance", { keyPrefix: "item" });

  const { duration, easing } = useAnimationConfig();

  return (
    <div style={style} className={cn(`flex flex-col gap-2`, className)}>
      {/* Presence */}
      <PresenceSelector
        attendance={attendance}
        editable={editable}
        onAttendanceChange={onAttendanceChange}
        className="-mt-4 self-end sm:mt-0 sm:self-start"
      />

      <AnimatePresence initial={false}>
        {/* Absence type */}
        {attendance.is_present === false &&
          attendance.absence_type !== "late" && (
            <motion.div
              key="absence-type"
              initial={{ opacity: 0, y: -20 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: transition(duration.medium2, easing.standard),
              }}
              exit={{ opacity: 0 }}
              transition={transition(duration.short4, easing.standard)}
            >
              <AbsenceTypeSelector
                value={attendance.absence_type}
                onChange={(absence_type) =>
                  editable &&
                  onAttendanceChange({
                    ...attendance,
                    absence_type,
                    absence_reason: null,
                  })
                }
                className={cn(`-mx-4 w-screen sm:mx-0 sm:w-full
                sm:[mask-image:linear-gradient(to_left,transparent,black_2.5rem)]
                [&>*]:px-4 [&>*]:sm:px-0 [&>*]:sm:pr-10`)}
              />
            </motion.div>
          )}

        {/* Absence custom reason */}
        {attendance.absence_type === "other" && (
          <motion.div
            key="absence-reason"
            initial={{ opacity: 0, y: -20 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: transition(duration.medium2, easing.standard),
            }}
            exit={{ opacity: 0 }}
            transition={transition(duration.short4, easing.standard)}
            className="pb-2"
          >
            <TextField<string>
              appearance="outlined"
              label={t("enterReason")}
              value={attendance.absence_reason || ""}
              onChange={(value) =>
                editable &&
                onAttendanceChange({
                  ...attendance,
                  absence_reason: value || null,
                })
              }
              locale={locale}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AttendanceStatusSelector;
