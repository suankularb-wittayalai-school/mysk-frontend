// Imports
import AbsenceTypeSelector from "@/components/classes/AbsenceTypeSelector";
import cn from "@/utils/helpers/cn";
import getLocaleName from "@/utils/helpers/getLocaleName";
import getLocaleString from "@/utils/helpers/getLocaleString";
import useLocale from "@/utils/helpers/useLocale";
import { StudentAttendance } from "@/utils/types/attendance";
import { StylableFC } from "@/utils/types/common";
import {
  CardHeader,
  Interactive,
  MaterialIcon,
  SegmentedButton,
  TextField,
  transition,
  useAnimationConfig,
} from "@suankularb-components/react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import { sift } from "radash";

/**
 * A single Student Attendance record.
 *
 * @param attendance The Attendance record to display.
 * @param editable Whether the Attendance record is editable or not, depending on the time and the user role.
 * @param onAttendanceChange Callback function to handle changes to the attendance record.
 */
const AttendanceListItem: StylableFC<{
  attendance: Omit<StudentAttendance, "id" | "is_present"> & {
    is_present: boolean | null;
  };
  editable?: boolean;
  onAttendanceChange: (
    attendance: Omit<StudentAttendance, "id" | "is_present"> & {
      is_present: boolean | null;
    },
  ) => void;
}> = ({ attendance, editable, onAttendanceChange, style, className }) => {
  const { student } = attendance;

  const locale = useLocale();
  const { t } = useTranslation("classes", {
    keyPrefix: "dialog.attendance.item",
  });

  const { duration, easing } = useAnimationConfig();

  return (
    <motion.li
      layout="position"
      layoutId={student.id}
      transition={transition(duration.medium2, easing.standard)}
      style={style}
      className={cn(`space-y-3 px-4 py-3`, className)}
    >
      <div className="flex flex-row items-center">
        {/* Student */}
        <CardHeader
          // Full name
          title={getLocaleName(locale, student)}
          subtitle={sift([
            // Class no.
            t("classNo", { classNo: student.class_no }),
            // Nickname
            (student.nickname?.th || student.nickname?.["en-US"]) &&
              `${getLocaleString(student.nickname, locale)}`,
          ]).join(" • ")}
          className="grow !p-0"
        />

        {/* Presence */}
        <SegmentedButton alt={t("presence.title")}>
          {/* Present */}
          <Interactive
            onClick={() =>
              editable
                ? onAttendanceChange({
                    ...attendance,
                    is_present: true,
                    absence_type: null,
                    absence_reason: null,
                  })
                : undefined
            }
            element={(props) => (
              <button {...props} title={t("presence.present")} />
            )}
            className={cn(
              `skc-button skc-button--outlined !text-on-surface
              focus:!border-on-surface state-layer:!bg-on-surface`,
              attendance.is_present &&
                `!bg-primary-container !text-primary focus:!border-primary
                state-layer:!bg-primary`,
            )}
          >
            <div className="skc-button__icon">
              <MaterialIcon icon="check" />
            </div>
          </Interactive>

          {/* Absent */}
          <Interactive
            onClick={
              editable
                ? () =>
                    onAttendanceChange({
                      ...attendance,
                      is_present: false,
                      absence_type: "on_leave",
                    })
                : undefined
            }
            element={(props) => (
              <button {...props} title={t("presence.absent")} />
            )}
            className={cn(
              `skc-button skc-button--outlined skc-button--dangerous`,
              attendance.is_present === false && `!bg-error !text-on-error`,
            )}
          >
            <div className="skc-button__icon">
              <MaterialIcon icon="close" />
            </div>
          </Interactive>
        </SegmentedButton>
      </div>

      <AnimatePresence initial={false}>
        {/* Absence type */}
        {attendance.is_present === false && (
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
                onAttendanceChange({
                  ...attendance,
                  absence_type,
                  absence_reason: null,
                })
              }
              className="-mx-4 sm:-mx-6 [&>*]:px-4 [&>*]:sm:px-6"
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
            className="pt-2"
          >
            <TextField<string>
              appearance="outlined"
              label={t("enterReason")}
              value={attendance.absence_reason || ""}
              onChange={
                editable
                  ? (value) =>
                      onAttendanceChange({
                        ...attendance,
                        absence_reason: value || null,
                      })
                  : undefined
              }
              locale={locale}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
};

export default AttendanceListItem;
