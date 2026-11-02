import getCurrentAcademicYear from "@/utils/helpers/getCurrentAcademicYear";
import getCurrentSemester from "@/utils/helpers/getCurrentSemester";
import logError from "@/utils/helpers/logError";
import { APITeacher } from "@/utils/types/api/person";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { Contact } from "@/utils/types/contact";
import { ElectiveSubject } from "@/utils/types/elective";
import { MySKClient } from "@/utils/types/fetch";
import { Teacher, UserRole } from "@/utils/types/person";
import { alphabetical } from "radash";

/**
 * Get a Teacher by their ID.
 *
 * Note that this function fetches for everything related to the Teacher,
 * including Contacts and Subjects in charge, even if they are not included in
 * the options. Do not expose this function to the frontend.
 *
 * @param supabase The Supabase Client to use.
 * @param mysk The MySK Client to use.
 * @param teacherID The ID of the Teacher in the database. Not to be confused with the Person ID or the Teacher ID.
 * @param options Options.
 * @param options.detailed Whether to include detailed information about the Teacher.
 * @param options.includeContacts Whether to include Contacts of the Teacher.
 * @param options.includeElectives Whether to include Elective Subjects the Teacher is in charge of.
 *
 * @returns A Backend Return with the Teacher.
 */
export async function getTeacherByID(
  supabase: DatabaseClient,
  mysk: MySKClient,
  teacherID: string,
  options?: Partial<{
    detailed: boolean;
    includeContacts: boolean;
    includeElectives: boolean;
  }>,
): Promise<BackendReturn<Teacher>> {
  //Fetch initial teacher data
  const { data, error } = await mysk.fetch<APITeacher>(
    `/v1/teachers/${teacherID}`,
    {
      query: {
        fetch_level: "default",
        descendant_fetch_level: "compact",
      },
    },
  );

  if (!data || error) {
    logError("getTeacherByID", error);
    return { data: null, error: error };
  }

  //Fetch contacts if included in options
  let contacts: Contact[] = [];
  if (options?.includeContacts) {
    const { data: contactsData, error: contactsError } = await mysk.fetch<
      Contact[]
    >("/v1/contacts", {
      query: {
        fetch_level: "default",
        filter: {
          data: {
            teacher_ids: [teacherID],
          },
        },
      },
    });
    if (contactsError || !contactsData) {
      logError("getTeacherByID (contacts)", contactsError);
      return { data: null, error: contactsError };
    }
    contacts = contactsData.map((contact) => ({
      id: contact.id,
      name: contact.name
        ? { th: contact.name.th ?? "", "en-US": contact.name["en-US"] }
        : null,
      type: contact.type,
      value: contact.value,
      include_parents: null,
      include_students: null,
      include_teachers: null,
    }));
  }

  //Fetch electives if included in options
  const electivesInCharge: ElectiveSubject[] = [];
  if (options?.includeElectives) {
    const { data: electives, error: electivesError } = await mysk.fetch<
      ElectiveSubject[]
    >("/v1/subjects/electives", {
      query: {
        fetch_level: "compact",
        filter: {
          data: {
            teacher_ids: [teacherID],
            year: getCurrentAcademicYear(),
            semester: getCurrentSemester(),
          },
        },
      },
    });
    if (electivesError || !electives) {
      logError("getTeacherByID (electives)", electivesError);
      return {
        data: null,
        error: electivesError,
      };
    }
    electivesInCharge.push(...electives);
  }

  const teacher: Teacher = {
    id: data.id,
    prefix: data.person.prefix,
    first_name: data.person.first_name,
    last_name: data.person.last_name,
    middle_name: data.person.middle_name,
    nickname: data.person.nickname,
    teacher_id: data.teacher_id,
    class_advisor_at: data.class_advisor_at
      ? { id: data.class_advisor_at.id, number: data.class_advisor_at.number }
      : null,
    contacts: options?.includeContacts
      ? alphabetical(contacts, (contact) => contact.type)
      : [],
    allergies: options?.detailed ? data.person.allergies : null,
    profile: data.person.profile ?? null,
    profile_url: data.person.profile ?? null,
    citizen_id: null,
    shirt_size: options?.detailed ? data.person.shirt_size : null,
    subject_group: {
      id: data.subject_group.id,
      name: data.subject_group.name,
    },
    subjects_in_charge: options?.detailed
      ? alphabetical(
          data.subjects_in_charge.map((subject) => ({
            id: subject.id,
            name: subject.name,
            code: subject.code,
            short_name: subject.short_name,
          })),
          (subject) => subject.code.th,
        )
      : [],
    electives_in_charge: electivesInCharge,
    birthdate: options?.detailed ? (data.person.birthdate ?? null) : null,
    pants_size: options?.detailed ? (data.person.pants_size ?? null) : null,
    role: UserRole.teacher,
    is_admin: null,
  };

  return { data: teacher, error: null };
}
