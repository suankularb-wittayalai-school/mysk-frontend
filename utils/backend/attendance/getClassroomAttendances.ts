import getCurrentAcademicYear from "@/utils/helpers/getCurrentAcademicYear";
import getISODateString from "@/utils/helpers/getISODateString";
import logError from "@/utils/helpers/logError";
import {
  AbsenceType,
  AttendanceEvent,
  ClassroomAttendance,
  ManagementAttendanceSummary,
} from "@/utils/types/attendance";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { group, list, pick, sift } from "radash";

/**
 * Gets the Attendance summary of all Classrooms on a given date.
 *
 * @param supabase The Supabase client to use.
 * @param date The date to get the Attendance summary of.
 *
 * @returns A Backend Return containing the Attendance summary for all Classrooms, grouped by grade and by Classroom.
 */
export default async function getClassroomAttendances(
  supabase: DatabaseClient,
  date: Date | string,
): Promise<
  BackendReturn<{
    grades: { [key in AttendanceEvent]: ManagementAttendanceSummary }[];
    classrooms: ClassroomAttendance[];
  }>
> {
  const dateObject = new Date(date);
  const dateString = typeof date === "string" ? date : getISODateString(date);

  const { data, error } = await supabase
    .from("classrooms")
    .select(
      `id,
      number,
      classroom_students(
        class_no,
        students!inner(
          id,
          people!inner(profile),
          student_attendances(
            attendance_event,
            date,
            is_present,
            absence_type,
            absence_reason
          )
        )
      ),
      classroom_homeroom_contents(date, homeroom_content)`,
    )
    .eq("year", getCurrentAcademicYear(dateObject))
    .eq("classroom_students.students.student_attendances.date", dateString)
    .eq("classroom_homeroom_contents.date", dateString)
    .order("number");

  if (error) {
    logError("getClassroomAttendances", error);
    return { data: null, error };
  }

  /**
   * Attendance summary for each grade. This is used to create a chart in Grades
   * Breakdown Chart.
   */
  const grades =
    // For each grade
    list(1, 6).map((grade) => {
      // Get Classrooms of that grade
      const classrooms = data.filter(
        ({ number }) => Math.floor(number / 100) === grade,
      );
      // Get all Attendance records of those Classrooms
      const attendances = group(
        classrooms.flatMap((classroom) =>
          sift(
            classroom.classroom_students.flatMap(
              ({ students }) => students?.student_attendances,
            ),
          ),
        ),
        (attendance) => attendance!.attendance_event,
      );

      return {
        assembly: {
          presence:
            attendances.assembly?.filter(({ is_present }) => is_present)
              .length || 0,
          late:
            attendances.assembly?.filter(
              ({ is_present, absence_type }) =>
                !is_present && absence_type === AbsenceType.late,
            ).length || 0,
          absence:
            attendances.assembly?.filter(
              ({ is_present, absence_type }) =>
                !is_present && absence_type !== AbsenceType.late,
            ).length || 0,
        },
        homeroom: {
          presence:
            attendances.homeroom?.filter(({ is_present }) => is_present)
              .length || 0,
          late: 0,
          absence:
            attendances.homeroom?.filter(({ is_present }) => !is_present)
              .length || 0,
        },
      };
    });

  /**
   * Attendance summary for each Classroom. This is used to create a table in
   * School-wide Attendance Table.
   */
  const classrooms = data
    // Only display Classrooms with Attendance or Homeroom Content.
    .filter(
      (classroom) =>
        classroom.classroom_students.length ||
        classroom.classroom_homeroom_contents.length,
    )
    .map((classroom) => {
      // Get attendance data.
      const attendances = sift(
        classroom.classroom_students
          .map(({ students }) => students?.student_attendances)
          .flat(),
      );

      // Calculate summary.

      // Late is only counted in assembly.
      const late = attendances.filter(
        ({ attendance_event, absence_type }) =>
          attendance_event === "assembly" && absence_type === "late",
      ).length;

      // If there is homeroom attendance, use it as preferred event.
      const preferredEvent = attendances.filter(
        ({ attendance_event }) => attendance_event === "homeroom",
      ).length
        ? "homeroom"
        : "assembly";

      // Use preferred event to calculate absence.
      const absentStudents = classroom.classroom_students.filter(
        ({ students }) => {
          const preferredAttendance = students!.student_attendances.find(
            ({ attendance_event }) => attendance_event === preferredEvent,
          );
          return (
            preferredAttendance &&
            !preferredAttendance.is_present &&
            preferredAttendance.absence_type !== AbsenceType.late
          );
        },
      );

      // Use absent students to calculate COVID-19 absence.
      const covidStudents = absentStudents.filter(
        ({ students }) =>
          students!.student_attendances[0].absence_reason === "COVID-19",
      );

      const covid = covidStudents.length;
      const absence = absentStudents.length - covid;

      // Presence is calculated by subtracting late and absence from total
      // attendance.
      // This is to prevent the total attendance count from being higher than
      // the number of students.
      const presence =
        attendances.filter(
          ({ attendance_event }) => attendance_event === preferredEvent,
        ).length -
        late -
        covid -
        absence;

      return {
        classroom: pick(classroom, ["id", "number"]),
        expected_total: classroom.classroom_students.length,
        summary: { presence, late, covid, absence },
        absent_students: absentStudents
          .map((student) => ({
            id: student.students!.id,
            profile: student.students!.people!.profile,
            class_no: student.class_no,
          }))
          .sort((a, b) => a.class_no - b.class_no),
        homeroom_content:
          classroom.classroom_homeroom_contents[0]?.homeroom_content || null,
      };
    });

  return { data: { grades, classrooms }, error: null };
}
