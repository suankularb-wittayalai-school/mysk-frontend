import clearAttendanceOfClass from "@/utils/backend/attendance/clearAttendanceOfClass";
import getISODateString from "@/utils/helpers/getISODateString";
import logError from "@/utils/helpers/logError";
import { AttendanceEvent } from "@/utils/types/attendance";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";

/**
 * Creates present Attendance records for a Classroom for a specific date.
 *
 * @param supabase The Supabase client to use.
 * @param date The date to create Attendance records for.
 * @param classroomID The ID of the Classroom to create Attendance records for.
 * @param teacherID The ID of the Teacher who created the Attendance records.
 *
 * @returns An empty Backend Return.
 */
export default async function bulkCreateAttendanceOfClass(
  supabase: DatabaseClient,
  date: string | Date,
  classroomID: string,
  teacherID: string,
): Promise<BackendReturn> {
  const { error: deleteError } = await clearAttendanceOfClass(
    supabase,
    date,
    classroomID,
  );

  if (deleteError) return { data: null, error: deleteError };

  const { data: studentIDs, error: studentsError } = await supabase
    .from("classroom_students")
    .select("student_id")
    .eq("classroom_id", classroomID);

  if (studentsError) {
    logError("bulkCreateAttendanceOfClass (students)", studentsError);
    return { data: null, error: studentsError };
  }

  const { error } = await supabase.from("student_attendances").insert(
    (["assembly", "homeroom"] as AttendanceEvent[])
      .map((attendanceEvent) =>
        studentIDs!.map(({ student_id }) => ({
          student_id,
          attendance_event: attendanceEvent,
          checker_id: teacherID,
          date: typeof date === "string" ? date : getISODateString(date),
          is_present: true,
        })),
      )
      .flat(),
  );

  if (error) logError("bulkCreateAttendanceOfClass (insert)", error);
  return { data: null, error };
}
