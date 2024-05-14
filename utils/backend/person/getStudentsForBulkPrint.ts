import getCurrentAcademicYear from "@/utils/helpers/getCurrentAcademicYear";
import getCurrentSemester from "@/utils/helpers/getCurrentSemester";
import logError from "@/utils/helpers/logError";
import mergeDBLocales from "@/utils/helpers/mergeDBLocales";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { ElectiveSubject } from "@/utils/types/elective";
import { MySKClient } from "@/utils/types/fetch";
import { ShirtSize, Student, UserRole } from "@/utils/types/person";
import { pick } from "radash";

/**
 * Get all Students with Classrooms with just enough information for bulk
 * printing.
 *
 * @param supabase The Supabase Client to use.
 * @param mysk The MySK Client to use.
 *
 * @param options Options.
 * @param options.includeChosenElective Whether to include the chosen Elective Subject of the Students.
 *
 * @returns A Backend Return with an array of the Students.
 */
export async function getStudentsForBulkPrint(
  supabase: DatabaseClient,
  mysk: MySKClient,
  options?: Partial<{ includeChosenElective: boolean }>,
): Promise<BackendReturn<Student[]>> {
  const { data, error } = await supabase
    .from("students")
    .select(
      `*,
      people(
        *,
        person_allergies(allergy_name)),
        classroom_students!inner(class_no, classrooms!inner(id, number)
      )`,
    )
    .eq("classroom_students.classrooms.year", getCurrentAcademicYear());

  if (error) {
    logError("getStudentsForBulkPrint (students)", error);
    console.log(error);
    return { data: null, error };
  }

  let studentElectiveMap: Record<string, ElectiveSubject> = {};

  if (options?.includeChosenElective) {
    const { data: electives, error: electivesError } = await mysk.fetch<
      ElectiveSubject[]
    >("/v1/subjects/electives", {
      query: {
        fetch_level: "detailed",
        descendant_fetch_level: "id_only",
        filter: {
          data: {
            year: getCurrentAcademicYear(),
            semester: getCurrentSemester(),
          },
        },
      },
    });
    if (electivesError) {
      logError("getStudentsForBulkPrint (electives)", electivesError);
      return { data: null, error: electivesError };
    }

    studentElectiveMap = Object.fromEntries(
      electives
        .map((elective) =>
          elective.students.map((student) => [
            student.id,
            pick(elective, [
              "id",
              "name",
              "code",
              "session_code",
              "randomized_students",
            ]),
          ]),
        )
        .flat(),
    );
  }

  const students: Student[] = data!.map((student) => ({
    id: student!.id,
    prefix: mergeDBLocales(student!.people, "prefix"),
    first_name: mergeDBLocales(student!.people, "first_name"),
    middle_name: mergeDBLocales(student!.people, "middle_name"),
    last_name: mergeDBLocales(student!.people, "last_name"),
    nickname: mergeDBLocales(student!.people, "nickname"),
    student_id: student!.student_id,
    ...(student!.classroom_students.length > 0
      ? {
          classroom: student!.classroom_students[0].classrooms,
          class_no: student!.classroom_students[0].class_no,
        }
      : { classroom: null, class_no: null }),
    profile: student!.people?.profile || null,
    profile_url: student!.people?.profile || null,
    chosen_elective:
      (options?.includeChosenElective && studentElectiveMap[student!.id]) ||
      null,
    contacts: [],
    certificates: [],
    allergies:
      student!.people?.person_allergies.map(
        ({ allergy_name }) => allergy_name,
      ) || null,
    citizen_id: student!.people?.citizen_id || null,
    birthdate: student!.people?.birthdate || null,
    shirt_size: <ShirtSize>student!.people?.shirt_size || null,
    pants_size: student!.people?.pants_size || null,
    role: UserRole.student,
    is_admin: null,
  }));

  return { data: students, error: null };
}
