import { getCurrentAcademicYear } from "@/utils/helpers/date";
import { logError } from "@/utils/helpers/debug";
import { mergeDBLocales } from "@/utils/helpers/string";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { Student } from "@/utils/types/person";

export async function getStudentByID(
  supabase: DatabaseClient,
  studentID: string,
  options?: { detailed?: boolean },
): Promise<BackendReturn<Student>> {
  let { data: studentData, error: studentError } = await supabase
    .from("students")
    .select(
      "*, people(*, person_contacts(contacts(*)), person_allergies(allergy_name)), classroom_students(class_no, classrooms!inner(id, number))",
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
    classroom: {
      id: studentData!.classroom_students[0].classrooms!.id,
      number: studentData!.classroom_students[0].classrooms!.number,
    },
    class_no: studentData!.classroom_students[0].class_no,
    contacts: options?.detailed
      ? studentData!.people!.person_contacts.map((contacts) => {
          const { contacts: contact } = contacts;
          return {
            id: contact!.id,
            type: contact!.type,
            value: contact!.value,
            name: mergeDBLocales(contact!, "name"),
            include_parents: contact!.include_parents,
            include_students: contact!.include_students,
            include_teachers: contact!.include_teachers,
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
      ? studentData!.people?.birthdate ?? "1970-01-01"
      : "1970-01-01",
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
