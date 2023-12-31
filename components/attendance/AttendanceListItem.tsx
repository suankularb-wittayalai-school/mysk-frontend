// Imports
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
  Checkbox,
  FilterChip,
  ListItem,
  ListItemContent,
  Snackbar,
  TextField,
  transition,
  useAnimationConfig,
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

  const { duration, easing } = useAnimationConfig();

  const supabase = useSupabaseClient();

  const [loading, toggleLoading] = useToggle();
  const { setSnackbar } = useContext(SnackbarContext);

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
            homeroom: { ...eventAttendance, id: attendance.homeroom.id },
          }
        : { ...attendance, homeroom: eventAttendance };

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
        if (error) {
          setSnackbar(<Snackbar>{tx("snackbar.failure")}</Snackbar>);
          return false;
        }
        if (data)
          onAttendanceChange({
            student: attendance.student,
            assembly: { ...attendance.assembly, id: data.assembly },
            homeroom: { ...attendance.homeroom, id: data.homeroom },
          });
        return true;
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
      transition={transition(duration.medium2, easing.standard)}
    >
      <motion.ul
        layout="position"
        className={cn(`grid w-full py-1`, loading && `animate-pulse`)}
      >
        {/* Student information */}
        <ListItem key={attendance.student.id} align="center" lines={2}>
          <PersonAvatar {...attendance.student} className="!min-w-[2.5rem]" />
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

        {/* Custom reason */}
        {attendance[shownEvent].absence_type === "other" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={transition(duration.medium2, easing.standard)}
            className="mt-1 px-4 sm:px-0"
          >
            <TextField appearance="outlined" label={t("enterReason")} />
          </motion.div>
        )}
      </motion.ul>
    </motion.li>
  );
};

export default AttendanceListItem;
