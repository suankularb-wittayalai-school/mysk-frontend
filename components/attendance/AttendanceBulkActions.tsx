import SnackbarContext from "@/contexts/SnackbarContext";
import bulkCreateAttendanceOfClass from "@/utils/backend/attendance/bulkCreateAttendanceOfClass";
import clearAttendanceOfClass from "@/utils/backend/attendance/clearAttendanceOfClass";
import cn from "@/utils/helpers/cn";
import useRefreshProps from "@/utils/helpers/useRefreshProps";
import withLoading from "@/utils/helpers/withLoading";
import { StudentAttendance } from "@/utils/types/attendance";
import { StylableFC } from "@/utils/types/common";
import {
  Actions,
  Button,
  MaterialIcon,
  Snackbar,
  transition,
  useAnimationConfig,
} from "@suankularb-components/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import { mapValues, omit } from "radash";
import { useContext } from "react";

/**
 * Bulk Actions for Attendance.
 *
 * @param attendances The Attendance data to bulk edit.
 * @param onAttendancesChange Callback when the Attendance data is changed.
 * @param toggleLoading Callback to toggle loading state during saving.
 * @param date The date of the Attendance. Used in saving.
 * @param classroomID The ID of the Classroom. Used in saving.
 * @param teacherID The ID of the Teacher who is viewing this page. Used in saving.
 */
const AttendanceBulkActions: StylableFC<{
  attendances: StudentAttendance[];
  onAttendancesChange: (attendances: StudentAttendance[]) => void;
  toggleLoading: () => void;
  date: string;
  classroomID: string;
  teacherID: string;
}> = ({
  attendances,
  onAttendancesChange,
  toggleLoading,
  date,
  classroomID,
  teacherID,
  style,
  className,
}) => {
  const { t } = useTranslation("attendance", { keyPrefix: "today" });
  const { t: tx } = useTranslation("common");

  const supabase = useSupabaseClient();
  const { setSnackbar } = useContext(SnackbarContext);
  const { duration, easing } = useAnimationConfig();
  const refreshProps = useRefreshProps();

  /**
   * Save all Students as present.
   */
  async function handleMarkAll() {
    withLoading(
      async () => {
        const { error } = await bulkCreateAttendanceOfClass(
          supabase,
          date,
          classroomID,
          teacherID,
        );
        if (error) setSnackbar(<Snackbar>{tx("snackbar.failure")}</Snackbar>);
        else await refreshProps();
        return error === null;
      },
      toggleLoading,
      { hasEndToggle: true },
    );
  }

  /**
   * Clear all Students’ Attendance.
   */
  async function handleClear() {
    withLoading(
      async () => {
        const { error } = await clearAttendanceOfClass(
          supabase,
          date,
          classroomID,
        );
        if (error) {
          setSnackbar(<Snackbar>{tx("snackbar.failure")}</Snackbar>);
          return false;
        }
        onAttendancesChange(
          attendances.map((attendance) => ({
            student: attendance.student,
            ...mapValues(omit(attendance, ["student"]), (value) => ({
              ...value,
              is_present: null,
              absence_type: null,
              absence_reason: null,
            })),
          })),
        );
        return true;
      },
      toggleLoading,
      { hasEndToggle: true },
    );
  }

  return (
    <motion.li
      layout="position"
      transition={transition(duration.medium2, easing.standard)}
      style={style}
      className={cn(
        `overflow-auto !rounded-none !bg-surface px-0 sm:px-4 md:-mx-4
        md:!bg-transparent`,
        className,
      )}
    >
      <Actions
        align="left"
        className={cn(`!w-fit !flex-nowrap md:!gap-1 md:px-4 *:md:!border-0
          *:md:!bg-surface [&>*>span]:whitespace-nowrap`)}
      >
        <Button
          appearance="outlined"
          icon={<MaterialIcon icon="done_all" />}
          onClick={handleMarkAll}
        >
          {t("action.markAll")}
        </Button>
        <Button
          appearance="outlined"
          icon={<MaterialIcon icon="delete" />}
          dangerous
          onClick={handleClear}
        >
          {t("action.clear")}
        </Button>
      </Actions>
    </motion.li>
  );
};

export default AttendanceBulkActions;
