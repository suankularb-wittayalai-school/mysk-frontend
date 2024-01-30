import getISODateString from "@/utils/helpers/getISODateString";
import logError from "@/utils/helpers/logError";
import mergeDBLocales from "@/utils/helpers/mergeDBLocales";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { Student } from "@/utils/types/person";
import { addDays } from "date-fns";

/**
 * Get all Students in a Classroom who are having a birthday today.
 *
 * @param supabase The Supabase Client to use.
 * @param classroomID The ID of the Classroom to check for birthday Students.
 */
export default async function getBirthdayBoysOfClassroom(
  supabase: DatabaseClient,
  classroomID: string,
): Promise<
  BackendReturn<Pick<Student, "id" | "first_name" | "nickname" | "birthdate">[]>
> {
  const { data, error } = await supabase
    .from("classroom_students")
    .select(
      `students(
        id,
        people(
          first_name_th,
          first_name_en,
          nickname_th,
          nickname_en,
          birthdate
        )
      )`,
    )
    .eq("classroom_id", classroomID);

  if (error) {
    logError("getBirthdayBoysOfClassroom", error);
    return { data: null, error };
  }

  const students = data
    .filter(
      ({ students }) =>
        students!.people!.birthdate?.slice(5) ===
        getISODateString(new Date()).slice(5),
    )
    .map(({ students }) => ({
      id: students!.id,
      first_name: mergeDBLocales(students!.people, "first_name"),
      nickname: mergeDBLocales(students!.people, "nickname"),
      birthdate: students!.people!.birthdate,
    }));

  return { data: students, error: null };
}
