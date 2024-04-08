import AbsenceTypeSelector from "@/components/attendance/AbsenceTypeSelector";
import PersonAvatar from "@/components/common/PersonAvatar";
import SnackbarContext from "@/contexts/SnackbarContext";
import upsertAttendance from "@/utils/backend/attendance/upsertAttendance";
import cn from "@/utils/helpers/cn";
import getLocaleName from "@/utils/helpers/getLocaleName";
import getLocaleString from "@/utils/helpers/getLocaleString";
import useLocale from "@/utils/helpers/useLocale";
import useToggle from "@/utils/helpers/useToggle";
import withLoading from "@/utils/helpers/withLoading";
import {
  AbsenceType,
  AttendanceEvent,
  StudentAttendance,
} from "@/utils/types/attendance";
import { StylableFC } from "@/utils/types/common";
import {
  Button,
  DURATION,
  EASING,
  FilterChip,
  ListItem,
  ListItemContent,
  MaterialIcon,
  Snackbar,
  TextField,
  transition,
} from "@suankularb-components/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import { sift } from "radash";
import { ComponentProps, useContext } from "react";

/**
 * A List Item for the Attendance page.
 *
 * @param attendance The Attendance of a Student at assembly and homeroom.
 * @param shownEvent The Attendance Event to show.
 * @param date The date of the Attendance. Used in saving.
 * @param teacherID The ID of the Teacher who is viewing the Attendance. Used in saving.
 * @param editable Whether the Attendance is editable.
 * @param onAttendanceChange Callback when the Attendance is changed.
 */
const AttendanceListItem: StylableFC<{
  attendance: StudentAttendance;
  shownEvent: AttendanceEvent;
  date: string;
  teacherID?: string;
  editable?: boolean;
  onAttendanceChange: (attendance: StudentAttendance) => void;
}> = ({
  attendance,
  shownEvent,
  date,
  teacherID,
  editable,
  onAttendanceChange,
}) => {
  const locale = useLocale();
  const { t } = useTranslation("attendance", { keyPrefix: "item" });
  const { t: tx } = useTranslation("common");

  const supabase = useSupabaseClient();

  const [loading, toggleLoading] = useToggle();
  const { setSnackbar } = useContext(SnackbarContext);

  /**
   * Whether to show the Checkbox as ticked [✓], crossed [✕], or empty [ ].
   */
  const checkboxState =
    attendance[shownEvent].is_present === false
      ? shownEvent === "assembly" && attendance.assembly.absence_type === "late"
      : attendance[shownEvent].is_present;

  /**
   * Sets the Attendance of the shown Event. Also sets the Attendance for
   * Homeroom if the shown Event is Assembly.
   *
   * @param eventAttendance The Attendance of the shown Event.
   * @param options Options.
   * @param options.noSave Prevents saving the Attendance to the database.
   */
  function setAttendanceOfShownEvent(
    eventAttendance: StudentAttendance[AttendanceEvent],
    options?: Partial<{ noSave: boolean }>,
  ) {
    // Lock the fridge (disallow saving while another save process is ongoing)
    // to prevent race conditions.
    // Will anyone get this? Everyone took CS50, right?
    if (loading || !(editable && teacherID)) return;

    // Saving to Assembly also saves to Homeroom, as per Sake’s request.
    const newAttendance =
      shownEvent === "assembly"
        ? {
            ...attendance,
            assembly: eventAttendance,
            homeroom:
              // If this Student is late in Assembly, default to present in
              // Homeroom.
              eventAttendance.absence_type === AbsenceType.late
                ? {
                    id: attendance.homeroom.id,
                    is_present: true,
                    absence_type: null,
                    absence_reason: null,
                  }
                : eventAttendance,
          }
        : { ...attendance, [shownEvent]: eventAttendance };

    // Update the Attendance data locally.
    onAttendanceChange(newAttendance);

    // Save the Attendance to the database, if not prevented.
    if (!options?.noSave) handleSave(newAttendance);
  }

  /**
   * Saves this Attendance record with all events to the database.
   *
   * @param attendance The Attendance to save.
   */
  async function handleSave(attendance: StudentAttendance) {
    if (!(editable && teacherID)) return;
    withLoading(
      async () => {
        const { data, error } = await upsertAttendance(
          supabase,
          attendance,
          date,
          teacherID,
        );
        if (error) setSnackbar(<Snackbar>{tx("snackbar.failure")}</Snackbar>);
        return error === null;
      },
      toggleLoading,
      { hasEndToggle: true },
    );
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
      transition={transition(DURATION.medium2, EASING.standard)}
    >
      <motion.ul
        layout="position"
        className={cn(`grid w-full py-1`, loading && `animate-pulse`)}
      >
        {/* Student information */}
        <ListItem key={attendance.student.id} align="center" lines={2}>
          <PersonAvatar
            {...attendance.student}
            expandable
            className="!min-w-[2.5rem]"
          />
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
          <Button
            appearance="text"
            icon={
              {
                true: <MaterialIcon icon="check_box" fill />,
                false: <MaterialIcon icon="disabled_by_default" fill />,
                null: <MaterialIcon icon="check_box_outline_blank" />,
              }[JSON.stringify(checkboxState)]
            }
            onClick={() => {
              if (checkboxState)
                setAttendanceOfShownEvent({
                  ...attendance[shownEvent],
                  is_present: false,
                  absence_type: AbsenceType.sick,
                });
              else
                setAttendanceOfShownEvent({
                  ...attendance[shownEvent],
                  is_present: true,
                  absence_type: null,
                  absence_reason: null,
                });
            }}
            dangerous={checkboxState === false}
            className={cn(
              checkboxState === null && `!text-on-surface-variant`,
              `!-ml-2 !-mr-6 state-layer:!bg-on-surface-variant`,
            )}
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
              className="mb-2 *:px-4"
            />
          )}

        {/* Custom reason */}
        {attendance[shownEvent].absence_type === "other" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={transition(DURATION.medium2, EASING.standard)}
            className="mt-1 px-4 sm:pb-2"
          >
            <TextField<string>
              appearance="outlined"
              label={t("enterReason")}
              value={attendance[shownEvent].absence_reason || ""}
              onChange={(absence_reason) => {
                setAttendanceOfShownEvent({
                  ...attendance[shownEvent],
                  absence_reason,
                });
              }}
              inputAttr={{ onBlur: () => handleSave(attendance) }}
            />
          </motion.div>
        )}
      </motion.ul>
    </motion.li>
  );
};

export default AttendanceListItem;
