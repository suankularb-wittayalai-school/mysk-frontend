import getCurrentAcademicYear from "@/utils/helpers/getCurrentAcademicYear";
import logError from "@/utils/helpers/logError";
import mergeDBLocales from "@/utils/helpers/mergeDBLocales";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { StudentCertificateType } from "@/utils/types/certificate";
import { ShirtSize, Student, UserRole } from "@/utils/types/person";
import { pick } from "radash";

/**
 * Get multiple Students by their IDs.
 *
 * @param supabase The Supabase Client to use.
 * @param studentID The IDs of the Students in the database. Not to be confused with the Person ID or the 5-digit Student ID.
 *
 * @param options Options.
 * @param options.detailed Whether to include detailed information about the Students.
 *
 * @returns A Backend Return with an array of the Students.
 */
export async function getStudentsByIDs(
  supabase: DatabaseClient,
  studentID: string[],
  options?: { detailed?: boolean },
): Promise<BackendReturn<Student[]>> {
  let { data, error: studentError } = await supabase
    .from("students")
    .select(
      `*,
      student_certificates(
        id,
        year,
        certificate_type,
        certificate_detail,
        receiving_order_number
      ),
      people(
        *,
        person_contacts(contacts(*)),
        person_allergies(allergy_name)),
        classroom_students(class_no, classrooms!inner(id, number)
      )`,
    )
    .in("id", studentID)
    .eq("classroom_students.classrooms.year", getCurrentAcademicYear());

  if (studentError) {
    logError("getStudentByID (students)", studentError);
    return { data: null, error: studentError };
  }

  const students: Student[] = data!.map((student) => ({
    id: student!.id,
    prefix: mergeDBLocales(student!.people, "prefix"),
    first_name: mergeDBLocales(student!.people, "first_name"),
    last_name: mergeDBLocales(student!.people, "last_name"),
    nickname: mergeDBLocales(student!.people, "nickname"),
    middle_name: mergeDBLocales(student!.people, "middle_name"),
    student_id: student!.student_id,
    ...(student!.classroom_students.length > 0
      ? {
          classroom: student!.classroom_students[0].classrooms,
          class_no: student!.classroom_students[0].class_no,
        }
      : { classroom: null, class_no: null }),
    profile: student!.people?.profile ?? null,
    ...(options?.detailed && student!.people
      ? {
          contacts: student!.people!.person_contacts.map(({ contacts }) => ({
            ...pick(contacts!, [
              "id",
              "type",
              "value",
              "include_parents",
              "include_students",
              "include_teachers",
            ]),
            name: mergeDBLocales(contacts!, "name"),
          })),
          certificates: student!.student_certificates.map((certicate) => ({
            ...certicate,
            certificate_type: <StudentCertificateType>(
              certicate.certificate_type
            ),
          })),
          allergies: student!.people.person_allergies.map(
            ({ allergy_name }) => allergy_name,
          ),
          citizen_id: student!.people.citizen_id,
          birthdate: student!.people.birthdate,
          shirt_size: <ShirtSize>student!.people.shirt_size,
          pants_size: student!.people.pants_size,
        }
      : {
          contacts: [],
          certificates: [],
          allergies: null,
          citizen_id: null,
          birthdate: null,
          shirt_size: null,
          pants_size: null,
        }),
    role: UserRole.student,
    is_admin: null,
  }));

  return { data: students, error: null };
}
