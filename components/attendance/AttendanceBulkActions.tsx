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
} from "@suankularb-components/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
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
  const { t } = useTranslation("attendance", { keyPrefix: "today.action" });
  const { t: tx } = useTranslation("common");

  const supabase = useSupabaseClient();
  const { setSnackbar } = useContext(SnackbarContext);
  const refreshProps = useRefreshProps();

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
    <Actions
      align="left"
      style={style}
      className={cn(
        `!bg-transparent md:!gap-1 *:md:!border-0 *:md:!bg-surface`,
        className,
      )}
    >
      <Button
        appearance="outlined"
        icon={<MaterialIcon icon="done_all" />}
        onClick={handleMarkAll}
      >
        {t("markAll")}
      </Button>
      <Button
        appearance="outlined"
        icon={<MaterialIcon icon="delete" />}
        dangerous
        onClick={handleClear}
      >
        {t("clear")}
      </Button>
    </Actions>
  );
};

export default AttendanceBulkActions;
