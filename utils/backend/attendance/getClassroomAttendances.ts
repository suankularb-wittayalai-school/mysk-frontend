import getCurrentAcademicYear from "@/utils/helpers/getCurrentAcademicYear";
import getISODateString from "@/utils/helpers/getISODateString";
import logError from "@/utils/helpers/logError";
import { ClassroomAttendance } from "@/utils/types/attendance";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { pick, sift } from "radash";

/**
 * Gets the Attendance summary of all Classrooms on a given date.
 *
 * @param supabase The Supabase client to use.
 * @param date The date to get the Attendance summary of.
 *
 * @returns A Backend Return containing the Attendance summary for each Classroom.
 */
export default async function getClassroomAttendances(
  supabase: DatabaseClient,
  date: Date | string,
): Promise<BackendReturn<ClassroomAttendance[]>> {
  const dateObject = new Date(date);
  const dateString = typeof date === "string" ? date : getISODateString(date);

  const { data, error } = await supabase
    .from("classrooms")
    .select(
      `id,
      number,
      classroom_students(
        students!inner(
          student_attendances!inner(
            attendance_event,
            date,
            is_present,
            absence_type
          )
        )
      ),
      classroom_homeroom_contents(date, homeroom_content)`,
    )
    .eq("year", getCurrentAcademicYear(dateObject))
    .eq("year", 2023)
    .eq("classroom_students.students.student_attendances.date", dateString)
    .eq(
      "classroom_students.students.student_attendances.attendance_event",
      "assembly",
    )
    .eq("classroom_homeroom_contents.date", dateString)
    .order("number");

  if (error) {
    logError("getClassroomAttendances", error);
    return { data: null, error };
  }

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
      const absence = attendances.filter(
        ({ attendance_event, is_present, absence_type }) =>
          attendance_event === preferredEvent &&
          !is_present &&
          absence_type !== "late",
      ).length;

      // Presence is calculated by subtracting late and absence from total
      // attendance.
      // This is to prevent the total attendance count from being higher than the
      // number of students.
      const presence =
        attendances.filter(
          ({ attendance_event }) => attendance_event === preferredEvent,
        ).length -
        late -
        absence;

      return {
        classroom: pick(classroom, ["id", "number"]),
        summary: { presence, late, absence },
        homeroom_content:
          classroom.classroom_homeroom_contents[0]?.homeroom_content || null,
      };
    });

  return { data: classrooms, error: null };
}
