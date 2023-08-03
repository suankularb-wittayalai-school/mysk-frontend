import { getCurrentAcademicYear } from "@/utils/helpers/date";
import { logError } from "@/utils/helpers/debug";
import { mergeDBLocales } from "@/utils/helpers/string";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { Student } from "@/utils/types/person";
import { pick } from "radash";

export async function getStudentByID(
  supabase: DatabaseClient,
  studentID: string,
  options?: Partial<{ detailed: boolean; includeContacts: boolean }>,
): Promise<BackendReturn<Student>> {
  let { data: studentData, error: studentError } = await supabase
    .from("students")
    .select(
      `*,
      people(
        *,
        person_contacts(contacts(*)),
        person_allergies(allergy_name)),
        classroom_students(class_no, classrooms!inner(id, number)
      )`,
    )
    .eq("id", studentID)
    .eq("classroom_students.classrooms.year", getCurrentAcademicYear())
    .single();

  if (studentError) {
    logError("getStudentByID (students)", studentError);
    return { data: null, error: studentError };
  }

  let student: Student = {
    id: studentData!.id,
    prefix: mergeDBLocales(studentData!.people, "prefix"),
    first_name: mergeDBLocales(studentData!.people, "first_name"),
    last_name: mergeDBLocales(studentData!.people, "last_name"),
    nickname: mergeDBLocales(studentData!.people, "nickname"),
    middle_name: mergeDBLocales(studentData!.people, "middle_name"),
    student_id: studentData!.student_id,
    classroom:
      studentData!.classroom_students.length > 0
        ? studentData!.classroom_students[0].classrooms
        : null,
    class_no:
      studentData!.classroom_students.length > 0
        ? studentData!.classroom_students[0].class_no
        : null,
    contacts: true
      ? studentData!.people!.person_contacts.map((contacts) => {
          const { contacts: contact } = contacts;
          return {
            ...pick(contact!, [
              "id",
              "type",
              "value",
              "include_parents",
              "include_students",
              "include_teachers",
            ]),
            name: mergeDBLocales(contact!, "name"),
          };
        })
      : [],
    allergies: options?.detailed
      ? studentData!.people!.person_allergies.map(
          (allergies) => allergies.allergy_name,
        )
      : null,
    profile: studentData!.people?.profile ?? null,
    citizen_id: options?.detailed
      ? studentData!.people?.citizen_id ?? null
      : null,
    birthdate: options?.detailed
      ? studentData!.people?.birthdate ?? null : null,
    shirt_size: options?.detailed
      ? studentData!.people?.shirt_size ?? null
      : null,
    pants_size: options?.detailed
      ? studentData!.people?.pants_size ?? null
      : null,
    role: "student",
    is_admin: null,
  };

  return { data: student, error: null };
}
