import getCurrentAcademicYear from "@/utils/helpers/getCurrentAcademicYear";
import getCurrentSemester from "@/utils/helpers/getCurrentSemester";
import logError from "@/utils/helpers/logError";
import { APIStudent } from "@/utils/types/api/person";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import {
  CeremonyConfirmationStatus,
  StudentCertificate,
  StudentCertificateType,
} from "@/utils/types/certificate";
import { JATU_DAY_PRACTICE_PERIODS } from "@/utils/types/cheer";
import { Contact } from "@/utils/types/contact";
import { ElectiveSubject } from "@/utils/types/elective";
import { MySKClient } from "@/utils/types/fetch";
import { Student, UserRole } from "@/utils/types/person";

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
 * @param options.includeCheerMedicalRisk Whether to include Cheer medical risk information of the Student.
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
    includeElectives: boolean;
    includeCheerMedicalRisk: boolean;
  }>,
): Promise<BackendReturn<Student>> {
  //Fetch initial student data
  const { data, error } = await mysk.fetch<APIStudent>(
    `/v1/students/${studentID}`,
    {
      query: {
        fetch_level: "default",
        descendant_fetch_level: "compact",
      },
    },
  );

  if (!data || error) {
    logError("getStudentByID", error);
    return { data: null, error: error };
  }

  //Fetch elective if included in options
  let chosenElective: ElectiveSubject | null = null;
  if (options?.includeElectives) {
    const { data: electives, error: electivesError } = await mysk.fetch<
      ElectiveSubject[]
    >("/v1/subjects/electives", {
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
    });
    if (electivesError || !electives) {
      logError("getStudentByID (electives)", electivesError);
      return {
        data: null,
        error: electivesError ?? { detail: "Could not fetch electives." },
      };
    }
    if (electives.length) chosenElective = electives[0];
  }

  //Fetch Cheer Medical Risk if included in options
  let cheerMedicalRisk = { firstDay: "", secondDay: "" };
  if (options?.includeCheerMedicalRisk) {
    let { data: cheerMedicalRiskData, error: cheerMedicalRiskError } =
      await supabase
        .from("cheer_practice_medical_risk_students")
        .select(`condition, practice_period_id`)
        .eq("student_id", studentID)
        .in("practice_period_id", JATU_DAY_PRACTICE_PERIODS);

    if (cheerMedicalRiskError) {
      logError("getStudentByID (cheer medical risk)", cheerMedicalRiskError);
      return { data: null, error: cheerMedicalRiskError };
    }
    cheerMedicalRisk = {
      firstDay:
        cheerMedicalRiskData?.find(
          (risk) => risk.practice_period_id === JATU_DAY_PRACTICE_PERIODS[0],
        )?.condition ?? "",
      secondDay:
        cheerMedicalRiskData?.find(
          (risk) => risk.practice_period_id === JATU_DAY_PRACTICE_PERIODS[1],
        )?.condition ?? "",
    };
  }

  let certificates: StudentCertificate[] = [];
  if (options?.includeCertificates) {
    const { data: certificatesData, error: certificatesError } = await supabase
      .from("student_certificates")
      .select("*")
      .eq("student_id", studentID);

    if (certificatesError) {
      logError("getStudentByID (certificates)", certificatesError);
      return { data: null, error: certificatesError };
    }

    certificates = (certificatesData ?? []).map((certificate) => ({
      ...certificate,
      certificate_type: certificate.certificate_type as StudentCertificateType,
      rsvp_status: certificate.rsvp_status as CeremonyConfirmationStatus,
    }));
  }

  let contacts: Contact[] = [];
  if (options?.includeContacts) {
    const { data: contactsData, error: contactsError } = await mysk.fetch<
      Contact[]
    >("/v1/contacts", {
      query: {
        fetch_level: "default",
        filter: {
          data: {
            student_ids: [studentID],
          },
        },
      },
    });
    if (contactsError || !contactsData) {
      logError("getStudentByID (contacts)", contactsError);
      return { data: null, error: contactsError };
    }
    contacts = contactsData;
  }

  const student: Student = {
    id: data.id,
    prefix: data.person.prefix,
    first_name: data.person.first_name,
    last_name: data.person.last_name,
    middle_name: data.person.middle_name,
    nickname: data.person.nickname,
    student_id: data.student_id ?? "",
    classroom: data.classroom
      ? { id: data.classroom.id, number: data.classroom.number }
      : null,
    class_no: data.class_no,
    contacts: contacts.map((contact) => ({
      id: contact.id,
      name: contact.name
        ? { th: contact.name.th ?? "", "en-US": contact.name["en-US"] }
        : null,
      type: contact.type,
      value: contact.value,
      include_parents: null,
      include_students: null,
      include_teachers: null,
    })),
    certificates: certificates,
    chosen_elective: chosenElective,
    profile: null,
    profile_url: data.person.profile ?? null,
    ...(options?.detailed
      ? {
          allergies: data.person.allergies,
          health_problem: cheerMedicalRisk,
          citizen_id: null,
          birthdate: data.person.birthdate,
          shirt_size: data.person.shirt_size,
          pants_size: data.person.pants_size,
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
