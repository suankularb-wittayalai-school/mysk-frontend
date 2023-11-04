import getISODateString from "@/utils/backend/getISODateString";
import logError from "@/utils/helpers/logError";
import mergeDBLocales from "@/utils/helpers/mergeDBLocales";
import { AttendanceEvent, StudentAttendance } from "@/utils/types/attendance";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";

/**
 * Retrieves the Attendance records of a Classroom for a specific date and Attendance event.
 *
 * @param supabase The Supabase client to use.
 * @param classroomID The ID of the Classroom to retrieve Attendance records for.
 * @param date The date to retrieve Attendance records for.
 * @param attendanceEvent The Attendance event to retrieve records for, assembly or homeroom.
 *
 * @returns A Backend Return of an array of Student Attendances.
 */
export default async function getAttendancesOfClassAtDate(
  supabase: DatabaseClient,
  classroomID: string,
  date: Date,
  attendanceEvent: AttendanceEvent,
): Promise<BackendReturn<StudentAttendance[]>> {
  const { data, error } = await supabase
    .from("student_attendances")
    .select(
      `id,
      students!inner(
        id,
        people!inner(
          id,
          first_name_en,
          first_name_th,
          middle_name_en,
          middle_name_th,
          last_name_en,
          last_name_th,
          nickname_en,
          nickname_th
        ),
        classroom_students!inner(
          classroom_id,
          class_no
        )
      ),
      is_present,
      attendance_event,
      absence_type,
      absence_reason`,
    )
    .eq("students.classroom_students.classroom_id", classroomID)
    .eq("attendance_event", attendanceEvent)
    .eq("date", getISODateString(date));

  if (error) {
    logError("getAttendancesOfClassAtDate", error);
    return { data: null, error };
  }

  // Reformat the data
  const attendances = data.map((attendance) => {
    return {
      id: attendance.id,
      student: {
        id: attendance.students!.id,
        first_name: mergeDBLocales(attendance.students!.people, "first_name"),
        middle_name: mergeDBLocales(attendance.students!.people, "middle_name"),
        last_name: mergeDBLocales(attendance.students!.people, "last_name"),
        nickname: mergeDBLocales(attendance.students!.people, "nickname"),
        class_no: attendance.students!.classroom_students[0].class_no,
      },
      is_present: attendance.is_present,
      attendance_event: attendance.attendance_event,
      absence_type: attendance.absence_type,
      absence_reason: attendance.absence_reason,
    };
  });

  return { data: attendances, error: null };
}
