import getCurrentAcademicYear from "@/utils/helpers/getCurrentAcademicYear";
import getCurrentSemester from "@/utils/helpers/getCurrentSemester";
import logError from "@/utils/helpers/logError";
import mergeDBLocales from "@/utils/helpers/mergeDBLocales";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import {
  CeremonyConfirmationStatus,
  StudentCertificateType,
} from "@/utils/types/certificate";
import { ElectiveSubject } from "@/utils/types/elective";
import { MySKClient } from "@/utils/types/fetch";
import { ShirtSize, Student, UserRole } from "@/utils/types/person";
import { pick } from "radash";

/**
 * Get a Student by their ID.
 *
 * Note that this function fetches for everything related to the Student,
 * including Contacts and Certificates, even if they are not included in the
 * options. Do not expose this function to the frontend.
 *
 * May the API save us all. Someday.
 *
 * @param supabase The Supabase Client to use.
 * @param mysk The MySK Client to use.
 * @param studentID The ID of the Student in the database. Not to be confused with the Person ID or the 5-digit Student ID.
 * @param options Options.
 * @param options.detailed Whether to include detailed information about the Student.
 * @param options.includeContacts Whether to include Contacts of the student.
 * @param options.includeCertificates Whether to include Student Certificates of the Student.
 *
 * @returns A Backend Return with the Student.
 */
export async function getStudentByID(
  supabase: DatabaseClient,
  mysk: MySKClient,
  studentID: string,
  options?: Partial<{
    detailed: boolean;
    includeContacts: boolean;
    includeCertificates: boolean;
  }>,
): Promise<BackendReturn<Student>> {
  let { data: data, error: error } = await supabase
    .from("students")
    .select(
      `*,
      student_certificates(
        id,
        year,
        certificate_type,
        certificate_detail,
        receiving_order_number,
        seat_code,
        rsvp_status
      ),
      cheer_practice_medical_risk_students(condition),
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

  if (error) {
    logError("getStudentByID", error);
    return { data: null, error };
  }

  let chosenElective: ElectiveSubject | null = null;
  if (options?.detailed) {
    const { data, error } = await mysk.fetch<ElectiveSubject[]>(
      "/v1/subjects/electives",
      {
        query: {
          fetch_level: "compact",
          filter: {
            data: {
              student_ids: [studentID],
              year: getCurrentAcademicYear(),
              semester: getCurrentSemester(),
            },
          },
        },
      },
    );
    if (error) logError("getStudentByID (electives)", error);
    if (data?.length) chosenElective = data[0];
  }

  const student: Student = {
    id: data!.id,
    prefix: mergeDBLocales(data!.people, "prefix"),
    first_name: mergeDBLocales(data!.people, "first_name"),
    last_name: mergeDBLocales(data!.people, "last_name"),
    nickname: mergeDBLocales(data!.people, "nickname"),
    middle_name: mergeDBLocales(data!.people, "middle_name"),
    student_id: data!.student_id,
    ...(data!.classroom_students.length > 0
      ? {
          classroom: data!.classroom_students[0].classrooms,
          class_no: data!.classroom_students[0].class_no,
        }
      : { classroom: null, class_no: null }),
    contacts: data!.people!.person_contacts.map(({ contacts }) => ({
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
    certificates: options?.includeCertificates
      ? data!.student_certificates.map((certicate) => ({
          ...certicate,
          certificate_type: <StudentCertificateType>certicate.certificate_type,
          rsvp_status: <CeremonyConfirmationStatus>certicate.rsvp_status,
        }))
      : [],
    chosen_elective: chosenElective,
    profile: data!.people?.profile ?? null,
    profile_url: data!.people?.profile ?? null,
    ...(options?.detailed && data!.people
      ? {
          allergies: data!.people.person_allergies.map(
            ({ allergy_name }) => allergy_name,
          ),
          health_problem:
            data!.cheer_practice_medical_risk_students.map(
              ({ condition }) => condition,
            )[0] || "",
          citizen_id: data!.people.citizen_id,
          birthdate: data!.people.birthdate,
          shirt_size: <ShirtSize>data!.people.shirt_size,
          pants_size: data!.people.pants_size,
        }
      : {
          allergies: null,
          citizen_id: null,
          birthdate: null,
          shirt_size: null,
          pants_size: null,
        }),
    role: UserRole.student,
    is_admin: null,
  };

  return { data: student, error: null };
}
