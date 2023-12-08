import getStudentsOfClass from "@/utils/backend/classroom/getStudentsOfClass";
import getISODateString from "@/utils/helpers/getISODateString";
import logError from "@/utils/helpers/logError";
import {
  AttendanceEvent,
  StudentAttendance,
} from "@/utils/types/attendance";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { sort } from "radash";

/**
 * Retrieves the Attendance records of a Classroom for a specific date.
 *
 * @param supabase The Supabase client to use.
 * @param classroomID The ID of the Classroom to retrieve Attendance records for.
 * @param date The date to retrieve Attendance records for.
 *
 * @returns A Backend Return of an array of Student Attendances.
 */
export default async function getAttendanceOfClass(
  supabase: DatabaseClient,
  classroomID: string,
  date: Date | string,
): Promise<BackendReturn<StudentAttendance[]>> {
  // Fetch students of this Classroom
  const { data: students, error: studentsError } = await getStudentsOfClass(
    supabase,
    classroomID,
  );
  if (studentsError) return { data: null, error: studentsError };

  // Fetch attendance records of this Classroom
  const { data, error } = await supabase
    .from("student_attendances")
    .select(
      `id,
      is_present,
      attendance_event,
      absence_type,
      absence_reason,
      students!inner(id, classroom_students!inner(classroom_id))`,
    )
    .eq("students.classroom_students.classroom_id", classroomID)
    .eq("date", typeof date === "string" ? date : getISODateString(date));
  if (error) {
    logError("getFullStudentAttendanceOfClass (attendance)", error);
    return { data: null, error };
  }

  function getRecordOfStudent(
    studentID: string,
    attendanceEvent: AttendanceEvent,
  ) {
    return (
      (data?.find(
        (row) =>
          row.students!.id === studentID &&
          row.attendance_event === attendanceEvent,
      ) as StudentAttendance[typeof attendanceEvent]) || {
        id: null,
        is_present: null,
        absence_type: null,
        absence_reason: null,
      }
    );
  }

  // Group attendance records by student
  const attendance: StudentAttendance[] = sort(
    students.map((student) => ({
      student: student,
      assembly: getRecordOfStudent(student.id, "assembly"),
      homeroom: getRecordOfStudent(student.id, "homeroom"),
    })),
    ({ student }) => student.class_no || 0,
  );

  // Return the grouped attendance records
  return { data: attendance, error: null };
}
