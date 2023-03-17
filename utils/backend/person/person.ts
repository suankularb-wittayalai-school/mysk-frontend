// External libraries
import { User } from "@supabase/supabase-js";

// Backend
import { createContact } from "@/utils/backend/contact";
import { db2Student } from "@/utils/backend/database";
import { getTeacherFromUser } from "@/utils/backend/person/teacher";
import { getCurrentAcademicYear } from "@/utils/helpers/date";

// Supabase
import { supabase } from "@/utils/supabase-client";

// Types
import { BackendDataReturn, DatabaseClient } from "@/utils/types/common";
import { Person, Student, Teacher } from "@/utils/types/person";
import { Database } from "@/utils/types/supabase";

export async function createPerson(
  person: Person
): Promise<
  BackendDataReturn<Database["public"]["Tables"]["people"]["Row"], null>
> {
  // create contacts
  const contacts = await Promise.all(
    person.contacts.map(
      async (contact) => await createContact(supabase, contact)
    )
  );

  // check if any contact creation failed
  if (contacts.some((contact) => contact.error)) {
    const error = contacts.find((contact) => contact.error)?.error;
    if (error) {
      console.error(error);
      return { data: null, error };
    } else throw new Error("Unknown error");
  }

  // map the created contact to id
  const contactIDs = contacts
    .map((contact) => contact.data?.id)
    .filter((id) => id !== undefined || id !== null);

  const { data: createdPerson, error: personCreationError } = await supabase
    .from("people")
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
      contacts: contactIDs as number[],
    })
    .select("*")
    .limit(1)
    .single();

  if (personCreationError) {
    console.error(personCreationError);
    return { data: null, error: personCreationError };
  }

  return {
    data: createdPerson as Database["public"]["Tables"]["people"]["Row"],
    error: null,
  };
}

export async function setupPerson(
  supabase: DatabaseClient,
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
    citizenID: string;
    birthDate: string;
    email: string;
    subjectGroup: number;
    classAdvisorAt: number;
  },
  person: Student | Teacher
): Promise<
  BackendDataReturn<Database["public"]["Tables"]["people"]["Row"], null>
> {
  // Update user’s email
  const { error: emailError } = await supabase.auth.updateUser({
    email: form.email,
  });

  if (emailError) {
    console.error(emailError);
    return { data: null, error: emailError };
  }

  // Get person ID
  let personID = 0;

  // Fetch person ID from `student` table if user is a student
  if (person.role == "student") {
    const { data: studentPersonID, error: idError } = await supabase
      .from("student")
      .select("person(id)")
      .match({ id: person.id })
      .limit(1)
      .single();

    if (idError) {
      console.error(idError);
      return { data: null, error: idError };
    }

    personID = (
      studentPersonID!.person as Database["public"]["Tables"]["people"]["Row"]
    ).id;
  }

  // Fetch person ID from `teacher` table if user is a teacher
  else if (person.role == "teacher") {
    const { data: teacherPersonID, error: idError } = await supabase
      .from("teacher")
      .select("person")
      .match({ id: person.id })
      .limit(1)
      .single();

    if (idError) {
      console.error(idError);
      return { data: null, error: idError };
    }
    personID = teacherPersonID!.person as unknown as number;
  }

  // Update person data (`person` table)
  const { data: updPerson, error: personError } = await supabase
    .from("people")
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
    .select("*")
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
      .from("student")
      .update({ std_id: form.studentID })
      .match({ id: person.id, std_id: person.studentID })
      .limit(1)
      .single();

    if (error) {
      console.error(error);
      return { data: null, error };
    }
    return { data: updPerson!, error: null };
  }

  // Update a teacher’s subject group and class advisor status
  else if (person.role == "teacher") {
    const { error } = await supabase
      .from("teacher")
      .update({ subject_group: form.subjectGroup })
      .match({ id: person.id });

    if (error) {
      console.error(error);
      return { data: null, error };
    }

    if (form.classAdvisorAt) {
      // Get the classroom that the teacher is an advisor of
      const { data: classroom, error: classroomError } = await supabase
        .from("classroom")
        .select("id, advisors")
        .match({ number: form.classAdvisorAt, year: getCurrentAcademicYear() })
        .maybeSingle();

      if (classroomError) {
        console.error(classroomError);
        return { data: null, error: classroomError };
      }

      // Update class advisor
      const { error: classAdvisorError } = await supabase
        .from("classroom")
        .update({ advisors: [...classroom!.advisors, person.id] })
        .match({ id: classroom!.id });

      if (classAdvisorError) {
        console.error(classAdvisorError);
        return { data: null, error: classAdvisorError };
      }
    }

    return { data: updPerson!, error: null };
  }

  // Invalid role handling
  const error = { message: "invalid role." };
  console.error(error);
  return { data: null, error };
}

export async function getPersonFromUser(
  supabase: DatabaseClient,
  user: User
): Promise<BackendDataReturn<Student | Teacher, null>> {
  if (user?.user_metadata.role == "student") {
    const { data: student, error: studentError } = await supabase
      .from("student")
      .select("*, person(*)")
      .match({ id: user.user_metadata.student })
      .limit(1)
      .single();

    if (studentError) {
      console.error(studentError);
      return { data: null, error: studentError };
    }

    return { data: await db2Student(supabase, student!), error: null };
  } else if (user?.user_metadata.role == "teacher")
    return getTeacherFromUser(supabase, user);

  return { data: null, error: { message: "invalid role." } };
}

export async function getPersonIDFromUser(
  supabase: DatabaseClient,
  user: User
): Promise<BackendDataReturn<number, null>> {
  if (user?.user_metadata.role == "student") {
    const { data: student, error: studentError } = await supabase
      .from("student")
      .select("person(id)")
      .match({ id: user.user_metadata.student })
      .limit(1)
      .single();

    if (studentError) {
      console.error(studentError);
      return { data: null, error: studentError };
    }

    return {
      data: (student as Database["public"]["Tables"]["student"]["Row"]).person
        .id,
      error: null,
    };
  } else if (user?.user_metadata.role == "teacher") {
    const { data: teacher, error: teacherError } = await supabase
      .from("teacher")
      .select("person(id)")
      .match({ id: user.user_metadata.teacher })
      .limit(1)
      .single();

    if (teacherError) {
      console.error(teacherError);
      return { data: null, error: teacherError };
    }

    return {
      data: (teacher as Database["public"]["Tables"]["teacher"]["Row"]).person
        .id,
      error: null,
    };
  }

  return { data: null, error: { message: "invalid role." } };
}
