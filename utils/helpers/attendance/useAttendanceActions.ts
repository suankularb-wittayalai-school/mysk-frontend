import recordAttendances from "@/utils/backend/attendance/recordAttendances";
import useRefreshProps from "@/utils/helpers/useRefreshProps";
import useToggle from "@/utils/helpers/useToggle";
import { StudentAttendance } from "@/utils/types/attendance";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import va from "@vercel/analytics";
import { isToday } from "date-fns";
import { mapValues, omit, replace } from "radash";
import { useEffect, useState } from "react";

/**
 * A hook that returns a set of functions to handle Attendance data.
 *
 * @param initialAttendances The initial Attendance data.
 * @param date The date associated with the Attendance data.
 * @param teacherID The ID of the Teacher who is recording the Attendance data.
 */
export default function useAttendanceActions(
  initialAttendances: StudentAttendance[],
  date: string,
  teacherID?: string,
) {
  const [attendances, setAttendances] =
    useState<StudentAttendance[]>(initialAttendances);
  useEffect(() => setAttendances(initialAttendances), [initialAttendances]);

  const [loading, toggleLoading] = useToggle();
  const refreshProps = useRefreshProps();
  const supabase = useSupabaseClient();

  /**
   * Replace a record of the Attendance data.
   *
   * @param attendance The new Attendance data.
   */
  async function replaceAttendance(attendance: StudentAttendance) {
    setAttendances(
      replace(
        attendances,
        attendance,
        (item) => attendance.student!.id === item.student!.id,
      ),
    );
  }

  /**
   * Save the Attendance data.
   *
   * @returns Whether the save was successful.
   */
  async function handleSave(): Promise<boolean> {
    if (!teacherID) return false;

    if (
      attendances.some((attendance) =>
        Object.values(omit(attendance, ["student"])).some(
          (event) => event.is_present === null,
        ),
      )
    )
      return false;

    toggleLoading();
    const { error } = await recordAttendances(
      supabase,
      attendances,
      date,
      teacherID,
    );
    toggleLoading();

    va.track("Save Attendance", {
      isToday: date !== undefined && isToday(new Date(date)),
    });
    if (error) return false;
    return true;
  }

  /**
   * Mark all Students in the client state as present.
   */
  async function handleMarkAllPresent() {
    va.track("Mark All Students as Present", {
      isToday: date !== undefined && isToday(new Date(date)),
    });
    setAttendances(
      attendances.map((attendance) => ({
        student: attendance.student,
        ...mapValues(omit(attendance, ["student"]), (value) =>
          value.is_present !== null
            ? value
            : {
                ...value,
                is_present: true,
                absence_type: null,
                absence_reason: null,
              },
        ),
      })),
    );
  }

  /**
   * Clear the Attendance data in the client state.
   */
  async function handleClear() {
    va.track("Clear Attendance", {
      isToday: date !== undefined && isToday(new Date(date)),
    });
    setAttendances(
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
  }

  return {
    attendances,
    loading,
    replaceAttendance,
    handleSave,
    handleMarkAllPresent,
    handleClear,
  };
}
