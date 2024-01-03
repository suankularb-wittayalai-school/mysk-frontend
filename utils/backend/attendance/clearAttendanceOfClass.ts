import logError from "@/utils/helpers/logError";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";

/**
 * Clears Attendance records of a Classroom for a specific date.
 *
 * @param supabase The Supabase client to use.
 * @param date The date to clear Attendance records for.
 * @param classroomID The ID of the Classroom to clear Attendance records for.
 *
 * @returns An empty Backend Return.
 */
export default async function clearAttendanceOfClass(
  supabase: DatabaseClient,
  date: string | Date,
  classroomID: string,
): Promise<BackendReturn> {
  const { data: ids, error: idsError } = await supabase
    .from("student_attendances")
    .select(`id, students!inner(id, classroom_students!inner(classroom_id))`)
    .eq("date", date)
    .eq("students.classroom_students.classroom_id", classroomID);

  if (idsError) {
    logError("clearAttendanceOfClass (ids)", idsError);
    return { data: null, error: idsError };
  }

  const { error } = await supabase
    .from("student_attendances")
    .delete()
    .in("id", ids?.map(({ id }) => id) || []);

  if (error) logError("clearAttendanceOfClass (delete)", error);
  return { data: null, error };
}
