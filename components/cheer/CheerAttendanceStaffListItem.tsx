import PersonAvatar from "@/components/common/PersonAvatar";
import WithPersonDetails from "@/components/person/WithPersonDetails";
import SnackbarContext from "@/contexts/SnackbarContext";
import useMySKClient from "@/utils/backend/mysk/useMySKClient";
import cn from "@/utils/helpers/cn";
import getLocaleName from "@/utils/helpers/getLocaleName";
import getLocaleString from "@/utils/helpers/getLocaleString";
import useLocale from "@/utils/helpers/useLocale";
import {
  CheerAttendanceEvent,
  CheerAttendanceRecord,
  CheerAttendanceType,
} from "@/utils/types/cheer";
import { StylableFC } from "@/utils/types/common";
import { UserRole } from "@/utils/types/person";
import {
  DURATION,
  EASING,
  Interactive,
  ListItem,
  ListItemContent,
  Snackbar,
  TextField,
  transition,
} from "@suankularb-components/react";
import { motion } from "framer-motion";
import { sift } from "radash";
import { useContext, useState } from "react";
import CheerAttendanceSelector from "@/components/cheer/CheerAttendanceSelector";
import CheerAbsenceTypeSelector from "@/components/cheer/CheerAbsenceTypeSelector";
import useTranslation from "next-translate/useTranslation";

/**
 * A List Item for the Attendance page.
 *
 * @param attendance The Attendance of a Student at assembly and homeroom.
 * @param shownEvent The Attendance Event to show.
 * @param date The date of the Attendance. Used in saving.
 * @param editable Whether the Attendance is editable.
 * @param onAttendanceChange Callback when the Attendance is changed.
 */
const CheerAttendanceStaffListItem: StylableFC<{
  attendance: CheerAttendanceRecord;
  shownEvent: CheerAttendanceEvent;
  editable?: boolean;
  saving: boolean;
  setSaving: React.Dispatch<React.SetStateAction<boolean>>;
  onAttendancesChange: (attendance: CheerAttendanceRecord) => void;
}> = ({
  attendance,
  shownEvent,
  editable,
  saving,
  setSaving,
  onAttendancesChange,
}) => {
  const locale = useLocale();
  const { t } = useTranslation("attendance/cheer/list");
  const { t: tx } = useTranslation("common");

  const mysk = useMySKClient();
  const { setSnackbar } = useContext(SnackbarContext);

  const [loading, setLoading] = useState(false);
  const [studentOpen, setStudentOpen] = useState(false);

  const ShowAbsenceTypeSelector =
    attendance.presence &&
    shownEvent === "start" &&
    ![CheerAttendanceType.present, CheerAttendanceType.late].includes(
      attendance.presence,
    );

  /**
   * @param eventAttendance The Attendance of the shown Event.
   * @param options Options.
   * @param options.noSave Prevents saving the Attendance to the database.
   */

  async function setAttendanceOfShownEvent(
    eventAttendance: CheerAttendanceRecord,
  ) {
    if (saving || !editable) return;

    setLoading(true);
    setSaving(true);
    const success = await handleSave(eventAttendance);
    setLoading(false);
    setSaving(false);

    if (success) {
      onAttendancesChange(eventAttendance); // only update after no api error
    }
  }

  /**
   * Saves this Attendance record with all events to the database.
   *
   * @param attendance The Attendance to save.
   */

  async function handleSave(
    attendance: CheerAttendanceRecord,
  ): Promise<boolean> {
    if (!editable) return false;

    const { error } = await mysk.fetch(
      `/v1/attendance/cheer/periods/${attendance.practice_period.id}/check`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            is_start: shownEvent === "start",
            student_id: attendance.student.id,
            presence:
              shownEvent === "start"
                ? attendance.presence
                : attendance.presence_at_end,
            ...(shownEvent === "start" &&
            (attendance.presence == CheerAttendanceType.onLeaveNoRemedial ||
              attendance.presence == CheerAttendanceType.onLeaveWithRemedial) &&
            attendance.absence_reason
              ? { absence_reason: attendance.absence_reason }
              : {}),
          },
        }),
      },
    );

    if (error) {
      setSnackbar(<Snackbar>{tx("snackbar.failure")}</Snackbar>);
      return false;
    }

    return true;
  }

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
        <ListItem
          align="center"
          lines={2}
          element="div"
          className="!items-center !overflow-visible"
        >
          <WithPersonDetails
            open={studentOpen}
            person={{ ...attendance.student, role: UserRole.student }}
            onClose={() => setStudentOpen(false)}
            options={{ hideSeeClass: true }}
          >
            <Interactive
              onClick={() => setStudentOpen(true)}
              className="-m-1 rounded-full p-1"
            >
              <PersonAvatar {...attendance.student} size={40} />
            </Interactive>
          </WithPersonDetails>
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
          <CheerAttendanceSelector
            attendance={attendance}
            shownEvent={shownEvent}
            onChange={setAttendanceOfShownEvent}
            editable={true}
            className="-mr-4 -space-x-1"
          />
        </ListItem>

        {/* Absence type */}
        {ShowAbsenceTypeSelector && (
          <CheerAbsenceTypeSelector
            attendance={attendance}
            onChange={setAttendanceOfShownEvent}
            editable={true}
            className="mb-2 *:px-4"
          />
        )}
        {/* Custom reason */}
        {shownEvent == "start" &&
          attendance.presence != null &&
          [
            CheerAttendanceType.onLeaveWithRemedial,
            CheerAttendanceType.onLeaveNoRemedial,
          ].includes(attendance.presence) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={transition(DURATION.medium2, EASING.standard)}
              className="mt-1 px-4 sm:pb-2"
            >
              <TextField<string>
                appearance="outlined"
                label={t("enterReason")}
                value={attendance.absence_reason || ""}
                onChange={(absence_reason) => {
                  setAttendanceOfShownEvent({
                    ...attendance,
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

export default CheerAttendanceStaffListItem;
