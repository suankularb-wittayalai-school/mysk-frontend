// Imports
import AbsenceTypeSelector from "@/components/attendance/AbsenceTypeSelector";
import DynamicAvatar from "@/components/common/DynamicAvatar";
import getLocaleName from "@/utils/helpers/getLocaleName";
import getLocaleString from "@/utils/helpers/getLocaleString";
import useLocale from "@/utils/helpers/useLocale";
import {
  AbsenceType,
  AttendanceEvent,
  StudentAttendance,
} from "@/utils/types/attendance";
import { StylableFC } from "@/utils/types/common";
import {
  Checkbox,
  FilterChip,
  ListItem,
  ListItemContent,
  transition,
  useAnimationConfig,
} from "@suankularb-components/react";
import { motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import { sift } from "radash";
import { ComponentProps } from "react";

/**
 * A List Item for the Attendance page.
 *
 * @param attendance The Attendance of a Student at assembly and homeroom.
 * @param editable Whether the Attendance is editable.
 * @param onAttendanceChange Callback when the Attendance is changed.
 */
const AttendanceListItem: StylableFC<{
  attendance: StudentAttendance;
  shownEvent: AttendanceEvent;
  editable?: boolean;
  onAttendanceChange: (attendance: StudentAttendance) => void;
}> = ({ attendance, shownEvent, editable, onAttendanceChange }) => {
  const locale = useLocale();
  const { t } = useTranslation("attendance", { keyPrefix: "item" });

  const { duration, easing } = useAnimationConfig();

  /**
   * Sets the Attendance of the shown Event. Also sets the Attendance for
   * Homeroom if the shown Event is Assembly.
   *
   * @param eventAttendance The Attendance of the shown Event.
   */
  function setAttendanceOfShownEvent(
    eventAttendance: StudentAttendance[AttendanceEvent],
  ) {
    if (!editable) return;
    else if (shownEvent === "assembly")
      onAttendanceChange({
        ...attendance,
        assembly: eventAttendance,
        homeroom: eventAttendance,
      });
    else onAttendanceChange({ ...attendance, homeroom: eventAttendance });
  }

  // Ideally we would just have a motion.li > ListItem sequence, but `element`
  // doesn’t seem to work on List Item, so we have that would result in li > li,
  // which is invalid HTML.

  // ```tsx
  // <motion.li>
  //   <ListItem>
  //     ...
  // ```

  // So we have to use motion.li > motion.ul > ListItem, which results in
  // li > ul > li, which *is* valid HTML, but is horrible for accessibility. But
  // it works for now--until SKCom fixes this.

  // ```tsx
  // <motion.li>
  //   <motion.ul>
  //     <ListItem>
  //       ...
  // ```

  return (
    <motion.li
      layoutId={attendance.student.id}
      transition={transition(duration.medium2, easing.standard)}
    >
      <motion.ul layout="position" className="grid w-full">
        {/* Student information */}
        <ListItem key={attendance.student.id} align="center" lines={2}>
          <DynamicAvatar {...attendance.student} className="!min-w-[2.5rem]" />
          <ListItemContent
            title={getLocaleName(locale, attendance.student)}
            desc={sift([
              t("classNo", { classNo: attendance.student.class_no }),
              (attendance.student.nickname?.th ||
                attendance.student.nickname?.["en-US"]) &&
                getLocaleString(attendance.student.nickname, locale),
            ]).join(" • ")}
            className="w-0 [&>span]:!truncate"
          />

          {/* Late */}
          {shownEvent === "assembly" &&
            (attendance.assembly.is_present ||
              attendance.assembly.absence_type === "late") && (
              <FilterChip
                selected={attendance.assembly.absence_type === "late"}
                onClick={(state) =>
                  setAttendanceOfShownEvent({
                    ...attendance.assembly,
                    ...(state
                      ? { is_present: false, absence_type: AbsenceType.late }
                      : { is_present: true, absence_type: null }),
                  })
                }
              >
                {t("late")}
              </FilterChip>
            )}

          {/* Presence */}
          <Checkbox
            value={
              attendance[shownEvent].is_present ||
              attendance.assembly.absence_type === "late"
            }
            onChange={(value) =>
              setAttendanceOfShownEvent({
                ...attendance.assembly,
                ...(value
                  ? { is_present: true, absence_type: null }
                  : { is_present: false, absence_type: AbsenceType.sick }),
              })
            }
            className="!-mr-2"
          />
        </ListItem>

        {/* Absence type */}
        {attendance[shownEvent].absence_type &&
          attendance[shownEvent].absence_type !== "late" && (
            <AbsenceTypeSelector
              value={
                attendance[shownEvent].absence_type as ComponentProps<
                  typeof AbsenceTypeSelector
                >["value"]
              }
              onChange={(absence_type) => {
                setAttendanceOfShownEvent({
                  ...attendance[shownEvent],
                  is_present: false,
                  absence_type,
                });
              }}
              className="mb-2 [&>*]:px-4"
            />
          )}
      </motion.ul>
    </motion.li>
  );
};

export default AttendanceListItem;
