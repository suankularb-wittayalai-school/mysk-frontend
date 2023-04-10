// External libraries
import { User } from "@supabase/supabase-js";

// Backend
import { createContact } from "@/utils/backend/contact";
import { db2PersonName, db2Student } from "@/utils/backend/database";
import { getTeacherFromUser } from "@/utils/backend/person/teacher";
import { getCurrentAcademicYear } from "@/utils/helpers/date";

// Supabase
import { supabase } from "@/utils/supabase-client";

// Types
import {
  BackendDataReturn,
  DatabaseClient,
  LangCode,
} from "@/utils/types/common";
import { ClassWNumber } from "@/utils/types/class";
import { Contact } from "@/utils/types/contact";
import {
  Person,
  PersonLookupItem,
  PersonLookupItemGeneric,
  Role,
  Student,
  Teacher,
} from "@/utils/types/person";
import { SubjectGroup } from "@/utils/types/subject";
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
    prefixTH: string;
    firstNameTH: string;
    middleNameTH: string;
    lastNameTH: string;
    prefixEN: string;
    firstNameEN: string;
    middleNameEN: string;
    lastNameEN: string;
    subjectGroup: number;
    classAdvisorAt: string;
    birthdate: string;
    contacts: Contact[];
  },
  person: Student | Teacher
): Promise<
  BackendDataReturn<Database["public"]["Tables"]["people"]["Row"], null>
> {
  // Delete existing contacts
  for (let contact of person.contacts) {
    const { error } = await supabase
      .from("contacts")
      .delete()
      .eq("id", contact.id);
    if (error) {
      console.error(error);
      return { data: null, error };
    }
  }

  // Create contacts
  const createdContacts = (
    await Promise.all(
      form.contacts.map(async (contact) => {
        const { data: createdContact, error } = await createContact(
          supabase,
          contact
        );
        if (error) {
          console.error(error);
          return;
        }
        return createdContact!.id;
      })
    )
  ).filter((contactID) => contactID) as number[];

  console.log(createdContacts);

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
      prefix_th: form.prefixTH,
      first_name_th: form.firstNameTH,
      middle_name_th: form.middleNameTH,
      last_name_th: form.lastNameTH,
      prefix_en: form.prefixEN,
      first_name_en: form.firstNameEN,
      middle_name_en: form.middleNameEN,
      last_name_en: form.lastNameEN,
      birthdate: form.birthdate,
      contacts: createdContacts,
    })
    .match({ id: personID })
    .select("*")
    .limit(1)
    .single();

  if (personError) {
    console.error(personError);
    return { data: null, error: personError };
  }

  // Update a teacher’s subject group and class advisor status
  if (person.role == "teacher") {
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
  }

  return { data: updPerson!, error: null };
}

export async function getPersonFromUser(
  supabase: DatabaseClient,
  user: User,
  options?: Partial<{ contacts: boolean }>
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

    return { data: await db2Student(supabase, student!, options), error: null };
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

export async function getPersonRole(
  supabase: DatabaseClient,
  personID: number
): Promise<BackendDataReturn<Role, null>> {
  const { data: teacher, error: teacherError } = await supabase
    .from("teacher")
    .select("id")
    .match({ person: personID })
    .limit(1)
    .maybeSingle();

  if (teacherError) {
    console.error(teacherError);
    return { data: null, error: teacherError };
  }

  return { data: teacher ? "teacher" : "student", error: null };
}

export async function getPeopleLookupList(
  query?: string
): Promise<BackendDataReturn<PersonLookupItem[]>> {
  const { data: people, error: peopleError } = await supabase
    .from("people")
    .select("id")
    .or(
      `first_name_th.like.%${query || ""}%, \
      middle_name_th.like.%${query || ""}%, \
      last_name_th.like.%${query || ""}%, \
      first_name_en.ilike.%${query || ""}%, \
      middle_name_en.ilike.%${query || ""}%, \
      last_name_en.ilike.%${query || ""}%`
    )
    .order("first_name_th")
    .order("last_name_th")
    .limit(100);

  if (peopleError) {
    console.error(peopleError);
    return { data: [], error: peopleError };
  }

  const peopleIDs = people.map((person) => person.id);

  // Students

  // Get all students that have the matching person ID
  const { data: students, error: studentsError } = await supabase
    .from("student")
    // We’re not using person(*) because that would expose citizen ID of
    // literally everyone in the school and that’s no good isn’t it!
    .select(
      `*,
      person(
        id,
        prefix_th,
        first_name_th,
        middle_name_th,
        last_name_th,
        prefix_en,
        first_name_en,
        middle_name_en,
        last_name_en,
        birthdate,
        contacts,
        profile
      )`
    )
    .or(`person.in.(${peopleIDs.join()})`);

  if (studentsError) {
    console.error(studentsError);
    return { data: [], error: studentsError };
  }

  // Get all classes that contain these students
  let classes: Pick<
    Database["public"]["Tables"]["classroom"]["Row"],
    "id" | "number" | "students"
  >[] = [];

  if (students.length) {
    const { data, error } = await supabase
      .from("classroom")
      .select("id, number, students")
      .or(students.map((student) => `students.cs.{"${student.id}"}`).join());

    if (error) {
      console.error(error);
      return { data: [], error };
    }

    classes = data;
  }

  // Format the list
  const formattedStudents: PersonLookupItemGeneric<ClassWNumber>[] =
    students.map((student) => {
      const classItem = classes.find((classItem) =>
        classItem.students.includes(student.id)
      )!;
      return {
        id: student.id,
        role: "student",
        metadata: { id: classItem.id, number: classItem.number },
        ...db2PersonName(student.person),
      };
    });

  // Teachers

  // Get all teachers that have the matching person ID
  const { data: teachers, error: teachersError } = await supabase
    .from("teacher")
    .select("*, person(*), subject_group(*)")
    .or(`person.in.(${peopleIDs.join()})`);

  if (teachersError) {
    console.error(teachersError);
    return { data: [], error: teachersError };
  }

  // Format the list
  const formattedTeachers: PersonLookupItemGeneric<SubjectGroup>[] =
    teachers.map((teacher) => ({
      id: teacher.id,
      role: "teacher",
      metadata: {
        id: teacher.subject_group.id,
        name: {
          th: teacher.subject_group.name_th,
          "en-US": teacher.subject_group.name_en,
        },
      },
      ...db2PersonName(teacher.person),
    }));

  return {
    data: (formattedStudents as PersonLookupItem[])
      .concat(formattedTeachers as PersonLookupItem[])
      .sort((a, b) => (a.name.th.firstName > b.name.th.firstName ? 1 : -1)),
    error: null,
  };
}
