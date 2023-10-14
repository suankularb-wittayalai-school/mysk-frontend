import logError from "@/utils/helpers/logError";
import mergeDBLocales from "@/utils/helpers/mergeDBLocales";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { Student } from "@/utils/types/person";

/**
 * Retrieves a list of Students in a given Classroom from the database.
 *
 * @param supabase The Supabase client to use.
 * @param classroomID The ID of the classroom to retrieve students from.
 * @param options Optional parameters.
 * @param options.year The academic year to filter the results by. Defaults to the current academic year.
 *
 * @returns A Backend Return of Students (ID, full name, nickname, and class No.).
 */
export default async function getStudentsOfClass(
  supabase: DatabaseClient,
  classroomID: string,
): Promise<
  BackendReturn<
    Pick<Student, "id" | "first_name" | "last_name" | "nickname" | "class_no">[]
  >
> {
  const { data, error } = await supabase
    .from("classroom_students")
    .select(
      `class_no,
      students(
        id,
        people(
          first_name_en,
          first_name_th,
          middle_name_en,
          middle_name_th,
          last_name_en,
          last_name_th,
          nickname_en,
          nickname_th
        )
      )`,
    )
    .eq("classroom_id", classroomID)
    .order("class_no");

  if (error) {
    logError("getStudentsOfClass", error);
    return { data: null, error };
  }

  const students = data.map(({ class_no, students }) => ({
    id: students!.id,
    first_name: mergeDBLocales(students!.people, "first_name"),
    middle_name: mergeDBLocales(students!.people, "middle_name"),
    last_name: mergeDBLocales(students!.people, "last_name"),
    nickname: mergeDBLocales(students!.people, "nickname"),
    class_no: class_no,
  }));

  return { data: students, error: null };
}
