import getStudentsOfClass from "@/utils/backend/classroom/getStudentsOfClass";
import logError from "@/utils/helpers/logError";
import { AttendanceEvent, StudentAttendance } from "@/utils/types/attendance";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { getDaysInMonth } from "date-fns";
import { group } from "radash";

/**
 * Get the Attendance of all Students in a Classroom for a specific month.
 *
 * @param supabase The Supabase client to use.
 * @param classroomID The ID of the Classroom to get the Attendance of.
 * @param month The month to get the Attendance of, in the format `YYYY-MM`.
 * 
 * @returns A Backend Return of an array of Students with their Attendance for the month.
 */
export default async function getMonthAttendanceOfClass<
  Year extends number,
  Month extends number,
>(
  supabase: DatabaseClient,
  classroomID: string,
  month: `${Year}-${Month}`,
): Promise<
  BackendReturn<
    {
      student: StudentAttendance["student"];
      attendances: (Omit<StudentAttendance, "student"> & { date: string })[];
    }[]
  >
> {
  const daysInMonth = getDaysInMonth(new Date(month));

  const [{ data: students, error: studentsError }, { data, error }] =
    await Promise.all([
      await getStudentsOfClass(supabase, classroomID),
      await (async () => {
        const { data, error } = await supabase
          .from("student_attendances")
          .select(
            `id,
            date,
            is_present,
            attendance_event,
            absence_type,
            absence_reason,
            students!inner(id, classroom_students!inner(classroom_id))`,
          )
          .eq("students.classroom_students.classroom_id", classroomID)
          .gte("date", `${month}-01`)
          .lte("date", `${month}-${daysInMonth}`);

        if (error) logError("getMonthAttendanceOfClass", error);
        return { data, error };
      })(),
    ]);

  if (studentsError || error)
    return { data: null, error: (studentsError || error)! };

  const defaultAttendance = {
    id: null,
    is_present: null,
    absence_type: null,
    absence_reason: null,
  } as const;

  const studentsWithAttendance = students!.map((student) => ({
    student,
    attendances: Object.entries(
      group(
        data!.filter((attendance) => attendance.students!.id === student.id),
        (row) => row.date,
      ),
    ).map(([date, attendances]) => ({
      date: date as `${typeof month}-${number}`,
      assembly:
        (attendances?.find(
          (attendance) => attendance.attendance_event === "assembly",
        ) as StudentAttendance[AttendanceEvent]) || defaultAttendance,
      homeroom:
        (attendances?.find(
          (attendance) => attendance.attendance_event === "homeroom",
        ) as StudentAttendance[AttendanceEvent]) || defaultAttendance,
    })),
  }));

  return { data: studentsWithAttendance, error: null };
}
