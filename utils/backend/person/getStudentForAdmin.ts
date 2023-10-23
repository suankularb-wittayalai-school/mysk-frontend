import getCurrentAcademicYear from "@/utils/helpers/getCurrentAcademicYear";
import logError from "@/utils/helpers/logError";
import mergeDBLocales from "@/utils/helpers/mergeDBLocales";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { Student } from "@/utils/types/person";
export async function getStudentsForAdmin(
  supabase: DatabaseClient,
  page: number,
  rowsPerPage: number,
  query?: string,
): Promise<
  BackendReturn<
    Pick<
      Student,
      | "id"
      | "student_id"
      | "classroom"
      | "class_no"
      | "first_name"
      | "last_name"
      | "middle_name"
    >[]
  > & { count: number }
> {
  let students: Pick<
    Student,
    | "id"
    | "student_id"
    | "classroom"
    | "class_no"
    | "first_name"
    | "last_name"
    | "middle_name"
  >[] = [];

  const {
    data: fetchedStudents,
    error: peopleError,
    count,
  } = await supabase
    .from("people")
    .select(
      "id, prefix_th, prefix_en, first_name_th, middle_name_th, last_name_th, nickname_th, first_name_en, middle_name_en, last_name_en, nickname_en, students!inner(id, student_id, classroom_students(class_no, classrooms!inner(id, number)))",
      { count: "exact" },
    )
    .or(
      `first_name_th.like.%${query || ""}%, \
      middle_name_th.like.%${query || ""}%, \
      last_name_th.like.%${query || ""}%, \
      nickname_th.like.%${query || ""}%, \
      first_name_en.ilike.%${query || ""}%, \
      middle_name_en.ilike.%${query || ""}%, \
      last_name_en.ilike.%${query || ""}%, \
      nickname_en.ilike.%${query || ""}%`,
    )
    .eq("students.classroom_students.classrooms.year", getCurrentAcademicYear())
    .order("first_name_th")
    .order("last_name_th")
    // .limit(rowsPerPage);
    .range(rowsPerPage * (page - 1), rowsPerPage * page - 1);

  if (peopleError) {
    // console.error(peopleError);
    logError("getPeopleLookupList", peopleError);
    return { data: null, error: peopleError, count: 0 };
  }

  students = fetchedStudents!.map((studentData) => ({
    id: studentData!.students[0]!.id,
    prefix: mergeDBLocales(studentData, "prefix"),
    first_name: mergeDBLocales(studentData, "first_name"),
    last_name: mergeDBLocales(studentData, "last_name"),
    nickname: mergeDBLocales(studentData, "nickname"),
    middle_name: mergeDBLocales(studentData, "middle_name"),
    student_id: studentData!.students[0].student_id,
    classroom:
      studentData!.students[0].classroom_students.length > 0
        ? {
            id: studentData!.students[0].classroom_students[0].classrooms!.id,
            number:
              studentData!.students[0].classroom_students[0].classrooms!.number,
          }
        : null,
    class_no:
      studentData!.students[0].classroom_students.length > 0
        ? studentData!.students[0].classroom_students[0].class_no
        : null,
  }));

  return { data: students, error: null, count: count! };
}
