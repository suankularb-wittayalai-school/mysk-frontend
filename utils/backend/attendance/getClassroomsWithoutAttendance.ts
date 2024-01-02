import getCurrentAcademicYear from "@/utils/helpers/getCurrentAcademicYear";
import getISODateString from "@/utils/helpers/getISODateString";
import logError from "@/utils/helpers/logError";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { Classroom } from "@/utils/types/classroom";
import { sift } from "radash";

/**
 * Gets a list of Classrooms that do not have ant Attendance data for a given
 * date.
 *
 * @param supabase The Supabase Client to use.
 * @param date The date to check for Attendance data.
 *
 * @returns A Backend Return of a list of Classrooms.
 */
export default async function getClassrooomsWithoutAttendance(
  supabase: DatabaseClient,
  date: string | Date,
): Promise<BackendReturn<Pick<Classroom, "id" | "number">[]>> {
  const {
    data: classroomsWithAttendance,
    error: classroomsWithAttendanceError,
  } = await supabase
    .from("student_attendances")
    .select(`students!inner(classroom_students!inner(classrooms!inner(id)))`)
    .eq("date", typeof date === "string" ? date : getISODateString(date));

  if (classroomsWithAttendanceError) {
    logError(
      "getClassroomsWithoutAttendance (attendance)",
      classroomsWithAttendanceError,
    );
    return {
      data: null,
      error: classroomsWithAttendanceError,
    };
  }

  const classroomsWithoutAttendance = classroomsWithAttendance
    ? sift(
        classroomsWithAttendance.map(
          (classroom) =>
            classroom.students?.classroom_students[0]?.classrooms?.id,
        ),
      )
    : [];

  const { data: classrooms, error: classroomsError } = await supabase
    .from("classrooms")
    .select(`id, number`)
    .not("id", "in", `(${classroomsWithoutAttendance.join()})`)
    .eq("year", getCurrentAcademicYear())
    .order("number");

  if (classroomsError) {
    logError("getClassroomsWithoutAttendance (classroom)", classroomsError);
    return {
      data: null,
      error: classroomsError,
    };
  }

  return { data: classrooms, error: null };
}
