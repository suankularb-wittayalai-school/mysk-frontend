import { PostgrestError } from "@supabase/supabase-js";
import { supabase } from "@utils/supabaseClient";
import { BackendReturn } from "@utils/types/common";
import {
  PersonTable,
  StudentDB,
  TeacherDB,
} from "@utils/types/database/person";
import { Person, Student, Teacher } from "@utils/types/person";
import { IncomingMessage } from "http";
import { NextApiRequestCookies } from "next/dist/server/api-utils";
import { createContact } from "../contact";
import { db2Student, db2Teacher } from "../database";

const prefixMap = {
  Master: "เด็กชาย",
  "Mr.": "นาย",
  "Mrs.": "นาง",
  "Miss.": "นางสาว",
};

export async function createPerson(
  person: Person
): Promise<{ data: PersonTable[] | null; error: PostgrestError | null }> {
  // create contacts
  const contacts = await Promise.all(
    person.contacts.map(async (contact) => await createContact(contact))
  );

  // check if any contact creation failed
  if (contacts.some((contact) => contact.error)) {
    const error = contacts.find((contact) => contact.error)?.error;
    if (error) {
      console.error(error);
      return { data: null, error };
    } else {
      throw new Error("Unknown error");
    }
  }

  // map the created contact to id
  const contactIds = contacts
    .map((contact) => contact.data?.[0]?.id)
    .filter((id) => id !== undefined || id !== null);

  const { data: createdPerson, error: personCreationError } = await supabase
    .from<PersonTable>("people")
    .insert({
      prefix_th: prefixMap[person.prefix as keyof typeof prefixMap] as
        | "นาย"
        | "นาง"
        | "นางสาว"
        | "เด็กชาย",
      prefix_en: person.prefix as "Mr." | "Mrs." | "Miss." | "Master",
      first_name_th: person.name.th.firstName,
      middle_name_th: person.name.th.middleName,
      last_name_th: person.name.th.lastName,
      first_name_en: person.name["en-US"]?.firstName,
      middle_name_en: person.name["en-US"]?.middleName,
      last_name_en: person.name["en-US"]?.lastName,
      birthdate: person.birthdate,
      citizen_id: person.citizenID,
      contacts: contactIds as number[],
    });
  if (personCreationError || !person) {
    console.error(personCreationError);
    return { data: null, error: personCreationError };
  }
  return { data: createdPerson, error: null };
}

export async function getUserFromReq(
  req: IncomingMessage & { cookies: NextApiRequestCookies }
): Promise<BackendReturn<Student | Teacher, null>> {
  const { user, error } = await supabase.auth.api.getUserByCookie(req);

  if (error) {
    console.error(error);
    return { data: null, error };
  }

  if (user?.user_metadata.role == "student") {
    const { data: student, error: studentError } = await supabase
      .from<StudentDB>("student")
      .select("id, std_id, people:person(*)")
      .match({ id: user?.user_metadata.student })
      .single();

    if (studentError) {
      console.error(studentError);
      return { data: null, error: studentError };
    }

    return {
      data: await db2Student(student),
      error: null,
    };
  } else if (user?.user_metadata.role == "teacher") {
    const { data: teacher, error: teacherError } = await supabase
      .from<TeacherDB>("teacher")
      .select("id, teacher_id, people:person(*), SubjectGroup:subject_group(*)")
      .match({ id: user?.user_metadata.teacher })
      .single();

    if (teacherError) {
      console.error(teacherError);
      return { data: null, error: teacherError };
    }

    return {
      data: {
        ...(await db2Teacher(teacher)),
        isAdmin: user.user_metadata.isAdmin,
      },
      error: null,
    };
  }

  return { data: null, error: { message: "invalid role." } };
}

export async function getPersonIDFromStudentID(
  studentID: number
): Promise<number> {
  const { data: student, error } = await supabase
    .from<{ id: number; person: number }>("student")
    .select("id, person")
    .match({ id: studentID })
    .limit(1)
    .single();

  if (error || !student) {
    console.error(error);
    return -1;
  }

  return student.person;
}

export async function getPersonIDFromTeacherID(
  teacherID: number
): Promise<number> {
  const { data: teacher, error } = await supabase
    .from<{ id: number; person: number }>("teacher")
    .select("id, person")
    .match({ id: teacherID })
    .limit(1)
    .single();

  if (error || !teacher) {
    console.error(error);
    return -1;
  }

  return teacher.person;
}

export async function getPersonIDFromReq(
  req: IncomingMessage & { cookies: NextApiRequestCookies }
): Promise<number> {
  const { user, error } = await supabase.auth.api.getUserByCookie(req);

  if (error || !user) {
    console.error(error);
    return 0;
  }

  const userRole = user?.user_metadata.role;

  const personID =
    userRole === "student"
      ? await getPersonIDFromStudentID(user.user_metadata.student)
      : await getPersonIDFromTeacherID(user.user_metadata.teacher);

  return personID;
}
