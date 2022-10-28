import { PostgrestError } from "@supabase/supabase-js";
import { supabase } from "@utils/supabaseClient";
import { BackendReturn } from "@utils/types/common";
import {
  PersonDB,
  PersonTable,
  StudentDB,
  StudentTable,
  TeacherDB,
  TeacherTable,
} from "@utils/types/database/person";
import { Person, Role, Student, Teacher } from "@utils/types/person";
import { IncomingMessage, ServerResponse } from "http";
import { NextApiRequestCookies } from "next/dist/server/api-utils";
import { createContact } from "../contact";
import { db2Student, db2Teacher } from "../database";

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
      prefix_th: person.prefix.th,
      prefix_en: person.prefix["en-US"],
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

export async function setupPerson(
  form: {
    thPrefix: string;
    thFirstName: string;
    thMiddleName: string;
    thLastName: string;
    enPrefix: string;
    enFirstName: string;
    enMiddleName: string;
    enLastName: string;
    studentID: string;
    teacherID: string;
    citizenID: string;
    birthDate: string;
    subjectGroup: number;
  },
  person: Student | Teacher
): Promise<BackendReturn<PersonTable, null>> {
  // Get person ID
  let personID = 0;

  // Fetch person ID from `student` table if user is a student
  if (person.role == "student") {
    const { data: studentPersonID, error: idError } = await supabase
      .from<StudentTable>("student")
      .select("person")
      .match({ id: person.id })
      .limit(1)
      .single();

    if (idError) {
      console.error(idError);
      return { data: null, error: idError };
    }
    personID = (studentPersonID as StudentTable).person;
  }

  // Fetch person ID from `teacher` table if user is a teacher
  else if (person.role == "teacher") {
    const { data: teacherPersonID, error: idError } = await supabase
      .from<TeacherTable>("teacher")
      .select("person")
      .match({ id: person.id })
      .limit(1)
      .single();

    if (idError) {
      console.error(idError);
      return { data: null, error: idError };
    }
    personID = (teacherPersonID as TeacherTable).person;
  }

  // Update person data (`person` table)
  const { data: updPerson, error: personError } = await supabase
    .from<PersonTable>("people")
    .update({
      prefix_th: form.thPrefix,
      first_name_th: form.thFirstName,
      middle_name_th: form.thMiddleName,
      last_name_th: form.thLastName,
      prefix_en: form.enPrefix,
      first_name_en: form.enFirstName,
      middle_name_en: form.enMiddleName,
      last_name_en: form.enLastName,
      birthdate: form.birthDate,
      citizen_id: form.citizenID,
    })
    .match({ id: personID })
    .limit(1)
    .single();

  if (personError) {
    console.error(personError);
    return { data: null, error: personError };
  }

  // Update role-specific data (`student` or `teacher` table)

  // Update a student’s student ID
  if (person.role == "student") {
    const { error } = await supabase
      .from<StudentTable>("student")
      .update({ std_id: form.studentID })
      .match({ id: person.id, std_id: person.studentID })
      .limit(1)
      .single();

    if (error) {
      console.error(error);
      return { data: null, error };
    }
    return { data: updPerson as PersonTable, error: null };
  }

  // Update a teacher’s teacher ID and subject group
  else if (person.role == "teacher") {
    const { error } = await supabase
      .from<TeacherTable>("teacher")
      .update({
        teacher_id: form.teacherID,
        subject_group: form.subjectGroup,
      })
      .match({ id: person.id, teacher_id: person.teacherID });

    if (error) {
      console.error(error);
      return { data: null, error };
    }
    return { data: updPerson as PersonTable, error: null };
  }

  // Invalid role handling
  const error = { message: "invalid role." };
  console.error(error);
  return { data: null, error };
}

export async function getUserFromReq(
  req: IncomingMessage & { cookies: NextApiRequestCookies },
  res?: ServerResponse
): Promise<BackendReturn<Student | Teacher, null>> {
  const { user, error } = await supabase.auth.api.getUserByCookie(req, res);

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
      data: await db2Student(student as StudentDB),
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
        ...(await db2Teacher(teacher as TeacherDB)),
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
  req: IncomingMessage & { cookies: NextApiRequestCookies },
  res?: ServerResponse
): Promise<number> {
  const { user, error } = await supabase.auth.api.getUserByCookie(req, res);

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
