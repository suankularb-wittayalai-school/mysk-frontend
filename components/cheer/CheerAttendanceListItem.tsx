import AbsenceTypeSelector from "@/components/attendance/AbsenceTypeSelector";
import AttendanceSelector from "@/components/attendance/AttendanceSelector";
import PersonAvatar from "@/components/common/PersonAvatar";
import WithPersonDetails from "@/components/person/WithPersonDetails";
import SnackbarContext from "@/contexts/SnackbarContext";
import upsertAttendance from "@/utils/backend/attendance/upsertAttendance";
import useMySKClient from "@/utils/backend/mysk/useMySKClient";
import cn from "@/utils/helpers/cn";
import getLocaleName from "@/utils/helpers/getLocaleName";
import getLocaleString from "@/utils/helpers/getLocaleString";
import useLocale from "@/utils/helpers/useLocale";
import useToggle from "@/utils/helpers/useToggle";
import withLoading from "@/utils/helpers/withLoading";
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
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import { sift } from "radash";
import { useContext, useState } from "react";
import CheerAttendanceSelector from "./CheerAttendanceSelector";
import CheerAbsenceTypeSelector from "./CheerAbsenceTypeSelector";

/**
 * A List Item for the Attendance page.
 *
 * @param attendance The Attendance of a Student at assembly and homeroom.
 * @param shownEvent The Attendance Event to show.
 * @param date The date of the Attendance. Used in saving.
 * @param editable Whether the Attendance is editable.
 * @param onAttendanceChange Callback when the Attendance is changed.
 */
const CheerAttendanceListItem: StylableFC<{
  attendance: CheerAttendanceRecord;
  shownEvent: CheerAttendanceEvent;
  date: string;
  editable?: boolean;
  onAttendanceChange: (attendance: CheerAttendanceRecord) => void;
}> = ({ attendance, shownEvent, date, editable, onAttendanceChange }) => {
  const locale = useLocale();
  const { t } = useTranslation("attendance", { keyPrefix: "item" });
  const { t: tx } = useTranslation("common");

  const supabase = useSupabaseClient();
  const mysk = useMySKClient();
  const { setSnackbar } = useContext(SnackbarContext);

  const [loading, toggleLoading] = useToggle();
  const [studentOpen, setStudentOpen] = useState(false);

  const ShowAbsenceTypeSelector =
    attendance.presence &&
    shownEvent === "start" &&
    ![CheerAttendanceType.present, CheerAttendanceType.late].includes(
      attendance.presence,
    );

  /**
   * Sets the Attendance of the shown Event. Also sets the Attendance for
   * Homeroom if the shown Event is Assembly.
   *
   * @param eventAttendance The Attendance of the shown Event.
   * @param options Options.
   * @param options.noSave Prevents saving the Attendance to the database.
   */

  function setAttendanceOfShownEvent(eventAttendance: CheerAttendanceRecord) {

    // Saving to Assembly also saves to Homeroom, as per Sake’s request.
    const newAttendance = eventAttendance;

    // Update the Attendance data locally.
    onAttendanceChange(newAttendance);

    // Save the Attendance to the database
    handleSave(newAttendance);
  }

  /**
   * Saves this Attendance record with all events to the database.
   *
   * @param attendance The Attendance to save.
   */

  async function handleSave(attendance: CheerAttendanceRecord) {
    /*  if (!(editable && mysk.person?.role === UserRole.teacher)) return;
    withLoading(
      async () => {
        const { error } = await upsertAttendance(
          supabase,
          attendance,
          date,
          mysk.person!.id,
        );
        if (error) setSnackbar(<Snackbar>{tx("snackbar.failure")}</Snackbar>);
        return error === null;
      },
      toggleLoading,
      { hasEndToggle: true },
    ); */
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
            CheerAttendanceType.absentWithRemedial,
            CheerAttendanceType.absentNoRemedial,
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

export default CheerAttendanceListItem;
