import getISODateString from "@/utils/helpers/getISODateString";
import logError from "@/utils/helpers/logError";
import { APIStudent } from "@/utils/types/api/person";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { MySKClient } from "@/utils/types/fetch";
import { Student } from "@/utils/types/person";

/**
 * Get all Students in a Classroom who are having a birthday today.
 *
 * This is a temporary workaround until the MySK API supports a Classroom
 * endpoint or filtering Students by Classroom.
 *
 * @param supabase The Supabase Client to use.
 * @param mysk The MySK Client to use.
 * @param classroomID The ID of the Classroom to check for birthday Students.
 *
 * @returns A Backend Return with the Students having a birthday today.
 */
export default async function getBirthdayBoysOfClassroom(
  supabase: DatabaseClient,
  mysk: MySKClient,
  classroomID: string,
): Promise<
  BackendReturn<Pick<Student, "id" | "first_name" | "nickname" | "birthdate">[]>
> {
  // TODO: Replace this Supabase lookup with the Classroom endpoint or a
  // Student filter once the MySK API supports either.
  const { data: classroomStudents, error: classroomStudentsError } =
    await supabase
      .from("classroom_students")
      .select("student_id")
      .eq("classroom_id", classroomID);

  if (classroomStudentsError) {
    logError(
      "getBirthdayBoysOfClassroom (classroom students)",
      classroomStudentsError,
    );
    return { data: null, error: classroomStudentsError };
  }

  if (!classroomStudents.length) return { data: [], error: null };

  const { data, error } = await mysk.fetch<APIStudent[]>("/v1/students", {
    query: {
      fetch_level: "default",
      descendant_fetch_level: "compact",
      filter: {
        data: {
          ids: classroomStudents.map(({ student_id }) => student_id),
        },
      },
    },
  });

  if (!data || error) {
    logError("getBirthdayBoysOfClassroom", error);
    return { data: null, error };
  }

  const students = data
    .filter(
      ({ person }) =>
        person.birthdate?.slice(5) === getISODateString(new Date()).slice(5),
    )
    .map(({ id, person }) => ({
      id,
      first_name: person.first_name,
      nickname: person.nickname,
      birthdate: person.birthdate,
    }));

  return { data: students, error: null };
}
