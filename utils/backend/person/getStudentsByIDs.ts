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
 * Get multiple Students by their IDs.
 *
 * @param supabase The Supabase Client to use.
 * @param mysk The MySK Client to use.
 * @param studentIDs The IDs of the Students in the database. Not to be confused with the Person ID or the 5-digit Student ID.
 *
 * @param options Options.
 * @param options.detailed Whether to include detailed information about the Students.
 * @param options.includeChosenElective Whether to include the chosen Elective Subject of the Students.
 *
 * @returns A Backend Return with an array of the Students.
 */
export async function getStudentsByIDs(
  supabase: DatabaseClient,
  mysk: MySKClient,
  studentIDs: string[],
  options?: Partial<{ detailed: boolean; includeChosenElective: boolean }>,
): Promise<BackendReturn<Student[]>> {
  const { data, error } = await supabase
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
      cheer_practice_medical_risk_students(condition, risk_priority),
      people(
        *,
        person_contacts(contacts(*)),
        person_allergies(allergy_name)),
        classroom_students(class_no, classrooms!inner(id, number)
      )`,
    )
    .in("id", studentIDs)
    .eq("classroom_students.classrooms.year", getCurrentAcademicYear());

  if (error) {
    logError("getStudentsByIDs (students)", error);
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
            student_ids: studentIDs,
            year: getCurrentAcademicYear(),
            semester: getCurrentSemester(),
          },
        },
      },
    });
    if (electivesError) {
      logError("getStudentsByIDs (electives)", electivesError);
      return { data: null, error: electivesError };
    }

    studentElectiveMap = Object.fromEntries(
      electives
        .map((elective) =>
          elective.students.map((student) => [
            student.id,
            pick(elective, [
              "id",
              "session_code",
              "name",
              "code",
              "room",
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
    profile_url: student!.people?.profile ?? null,
    chosen_elective:
      (options?.includeChosenElective && studentElectiveMap[student!.id]) ||
      null,
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
            rsvp_status: <CeremonyConfirmationStatus>certicate.rsvp_status,
          })),
          allergies: student!.people.person_allergies.map(
            ({ allergy_name }) => allergy_name,
          ),
          health_problem:
            student!.cheer_practice_medical_risk_students.map(
              ({ condition, risk_priority }) =>
                `ประเภทที่ ${risk_priority} ${condition} ${risk_priority == 1 ? "(ห้ามขึ้นสแตนด์)" : "(ดูแลอย่างใกล้ชิด)"}`,
            )[0] || "",
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
