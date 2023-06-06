// External libraries
import { User } from "@supabase/supabase-js";

// Backend
import { getUserMetadata } from "@/utils/backend/account";
import { createContact, deleteContact } from "@/utils/backend/contact";
import { getCurrentAcademicYear } from "@/utils/helpers/date";

// Converters
import {
  db2PersonName,
  db2Student,
  db2Teacher,
} from "@/utils/backend/database";

// Helpers
import { logError } from "@/utils/helpers/debug";

// Supabase
import { supabase } from "@/utils/supabase-client";

// Types
import { ClassWNumber } from "@/utils/types/class";
import { BackendDataReturn, DatabaseClient } from "@/utils/types/common";
import { Contact } from "@/utils/types/contact";
import {
  Person,
  PersonLookupItem,
  PersonLookupItemGeneric,
  Role,
  ShirtSize,
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
      citizen_id: person.citizenID!,
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

export async function editPerson(
  supabase: DatabaseClient,
  form: {
    prefixTH: string;
    firstNameTH: string;
    middleNameTH: string;
    lastNameTH: string;
    nicknameTH: string;
    prefixEN: string;
    firstNameEN: string;
    middleNameEN: string;
    lastNameEN: string;
    nicknameEN: string;
    subjectGroup: number;
    classAdvisorAt: string;
    birthdate: string;
    allergies: string[];
    shirtSize: ShirtSize;
    pantsSize: string;
    contacts?: Contact[];
  },
  person: Student | Teacher
): Promise<
  BackendDataReturn<Database["public"]["Tables"]["people"]["Row"], null>
> {
  let createdContactIDs: number[] | undefined = undefined;

  if (form.contacts) {
    // Delete existing contacts
    for (let contact of person.contacts) {
      const { error } = await supabase
        .from("contacts")
        .delete()
        .eq("id", contact.id);
      if (error) {
        logError("editPerson (delete existing Contacts)", error);
        return { data: null, error };
      }
    }

    // Create contacts
    createdContactIDs = (
      await Promise.all(
        form.contacts.map(async (contact) => {
          const { data: createdContact, error } = await createContact(
            supabase,
            contact
          );
          if (error) {
            logError("editPerson (add Contacts)", error);
            return;
          }
          return createdContact!.id;
        })
      )
    ).filter((contactID) => contactID) as number[];
  }

  // Get person ID
  let personID = 0;

  // Fetch person ID from `student` table if user is a student
  if (person.role === "student") {
    const { data: studentPersonID, error: idError } = await supabase
      .from("student")
      .select("person(id)")
      .match({ id: person.id })
      .limit(1)
      .single();

    if (idError) {
      logError("editPerson (Student Person ID)", idError);
      return { data: null, error: idError };
    }

    personID = (
      studentPersonID!.person as Database["public"]["Tables"]["people"]["Row"]
    ).id;
  }

  // Fetch person ID from `teacher` table if user is a teacher
  else if (person.role === "teacher") {
    const { data: teacherPersonID, error: idError } = await supabase
      .from("teacher")
      .select("person")
      .match({ id: person.id })
      .limit(1)
      .single();

    if (idError) {
      logError("editPerson (Teacher Person ID)", idError);
      return { data: null, error: idError };
    }
    personID = teacherPersonID!.person as unknown as number;
  }

  // Update allergies data
  const { error: allergiesRemoveError } = await supabase
    .from("people_allergies")
    .delete()
    .eq("person_id", personID);

  if (allergiesRemoveError) {
    logError("editPerson (allergies removal)", allergiesRemoveError);
    return { data: null, error: allergiesRemoveError };
  }

  const { error: allergiesAddError } = await supabase
    .from("people_allergies")
    .insert(
      form.allergies.map((allergy) => ({
        person_id: personID,
        allergy_name: allergy,
      }))
    );

  if (allergiesAddError) {
    logError("editPerson (allergies addition)", allergiesAddError);
    return { data: null, error: allergiesAddError };
  }

  // Update person data (`person` table)
  const { data: updPerson, error: personError } = await supabase
    .from("people")
    .update({
      prefix_th: form.prefixTH,
      first_name_th: form.firstNameTH,
      middle_name_th: form.middleNameTH,
      last_name_th: form.lastNameTH,
      nickname_th: form.nicknameTH,
      prefix_en: form.prefixEN,
      first_name_en: form.firstNameEN,
      middle_name_en: form.middleNameEN,
      last_name_en: form.lastNameEN,
      nickname_en: form.nicknameEN,
      birthdate: form.birthdate,
      shirt_size: form.shirtSize,
      pants_size: form.pantsSize,
      contacts: createdContactIDs,
    })
    .match({ id: personID })
    .select("*")
    .limit(1)
    .single();

  if (personError) {
    logError("editPerson (update Person)", personError);
    return { data: null, error: personError };
  }

  // Update a teacher’s subject group and class advisor status
  if (person.role === "teacher") {
    const { error } = await supabase
      .from("teacher")
      .update({ subject_group: form.subjectGroup })
      .match({ id: person.id });

    if (error) {
      logError("editPerson (update Teacher)", error);
      return { data: null, error };
    }

    // Remove the teacher from the classroom the teacher was an advisor of
    if (
      // If the teacher is aleady an advisor
      person.classAdvisorAt &&
      // If Class Advisor At field is empty or was changed
      (!form.classAdvisorAt ||
        form.classAdvisorAt !== String(person.classAdvisorAt.number))
    ) {
      const { data: classItem, error: classError } = await supabase
        .from("classroom")
        .select("advisors")
        .eq("id", person.classAdvisorAt.id)
        .limit(1)
        .single();

      if (classError) {
        logError("editPerson (get Class to remove Teacher from)", classError);
        return { data: null, error: classError };
      }

      const { error: classUpdateError } = await supabase
        .from("classroom")
        .update({
          advisors: classItem.advisors.filter(
            (advisor) => person.id !== advisor
          ),
        })
        .eq("id", person.classAdvisorAt.id)
        .limit(1)
        .single();

      if (classUpdateError) {
        logError("editPerson (remove Teacher from Class)", classUpdateError);
        return { data: null, error: classUpdateError };
      }
    }

    if (form.classAdvisorAt) {
      // Get the classroom that the teacher will be an advisor of
      const { data: classroom, error: classroomError } = await supabase
        .from("classroom")
        .select("id, advisors")
        .match({ number: form.classAdvisorAt, year: getCurrentAcademicYear() })
        .maybeSingle();

      if (classroomError) {
        logError("editPerson", classroomError);
        return { data: null, error: classroomError };
      }

      // Update class advisor
      if (!classroom!.advisors.includes(person.id)) {
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
  }

  return { data: updPerson!, error: null };
}

export async function addContactToPerson(
  supabase: DatabaseClient,
  contactID: number,
  person: Student | Teacher
): Promise<
  BackendDataReturn<Database["public"]["Tables"]["people"]["Row"], null>
> {
  let personID = 0;

  if (person.role === "student") {
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
  } else if (person.role === "teacher") {
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

  const { data: selectedPerson, error: personSelectionError } = await supabase
    .from("people")
    .select("contacts")
    .eq("id", personID)
    .limit(1)
    .single();

  if (personSelectionError) {
    return { data: null, error: personSelectionError };
  }

  const { data: updatedPerson, error: personUpdatingError } = await supabase
    .from("people")
    .update({
      contacts: [...(selectedPerson!.contacts || []), contactID],
    })
    .eq("id", personID)
    .select("*")
    .limit(1)
    .single();

  if (personUpdatingError) {
    console.error(personUpdatingError);
    return { data: null, error: personUpdatingError };
  }

  return { data: updatedPerson!, error: null };
}

export async function removeContactFromPerson(
  supabase: DatabaseClient,
  contactID: number,
  person: Student | Teacher
): Promise<
  BackendDataReturn<Database["public"]["Tables"]["people"]["Row"], null>
> {
  let personID = 0;

  if (person.role === "student") {
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
  } else if (person.role === "teacher") {
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

  const { data: selectedPerson, error: personSelectionError } = await supabase
    .from("people")
    .select("contacts")
    .eq("id", personID)
    .limit(1)
    .single();

  if (personSelectionError) {
    return { data: null, error: personSelectionError };
  }

  const { data: updatedPerson, error: personUpdatingError } = await supabase
    .from("people")
    .update({
      contacts:
        selectedPerson!.contacts?.filter((id) => id !== contactID) || null,
    })
    .eq("id", personID)
    .select("*")
    .limit(1)
    .single();

  if (personUpdatingError) {
    console.error(personUpdatingError);
    return { data: null, error: personUpdatingError };
  }

  const { error: contactDeletionError } = await deleteContact(
    supabase,
    contactID
  );

  if (contactDeletionError) {
    console.error(contactDeletionError);
    return { data: null, error: contactDeletionError };
  }

  return { data: updatedPerson!, error: null };
}

/**
 * Reads the metadata of a user and fetches the corresponding Student or
 * Teacher.
 *
 * @param supabase An instance of the Supabase client.
 * @param user A Supabase user.
 * @param options The options parameter of {@link db2Student} or {@link db2Teacher}.
 *
 * @return A Backend Data Return with a Student or a Teacher.
 */
export async function getPersonFromUser(
  supabase: DatabaseClient,
  user: User,
  options?: Parameters<typeof db2Student | typeof db2Teacher>["2"]
): Promise<BackendDataReturn<Student | Teacher, null>> {
  const { data: metadata, error } = await getUserMetadata(supabase, user.id);

  if (error) {
    console.error(error);
    return { data: null, error };
  }

  // If the user is a Student
  if (metadata?.role === "student") {
    const { data, error } = await supabase
      .from("student")
      .select("*, person(*)")
      .match({ id: metadata.student })
      .limit(1)
      .single();

    if (error) {
      console.error(error);
      return { data: null, error };
    }

    return { data: await db2Student(supabase, data!, options), error: null };
  }

  // If the user is a Teacher
  if (metadata?.role === "teacher") {
    const { data, error } = await supabase
      .from("teacher")
      .select("*, person(*), subject_group(*)")
      .match({ id: metadata.teacher })
      .single();

    if (error) {
      console.error(error);
      return { data: null, error };
    }

    return {
      data: {
        ...(await db2Teacher(supabase, data!, options)),
        isAdmin: metadata.isAdmin,
      },
      error: null,
    };
  }

  // Otherwise, the user has an invalid role
  return { data: null, error: { message: "invalid role." } };
}

export async function getPersonIDFromUser(
  supabase: DatabaseClient,
  user: User
): Promise<BackendDataReturn<number, null>> {
  const { data: metadata, error } = await getUserMetadata(supabase, user.id);

  if (error) {
    console.error(error);
    return { data: null, error };
  }

  if (metadata?.role === "student") {
    const { data: student, error: studentError } = await supabase
      .from("student")
      .select("person(id)")
      .match({ id: metadata.student })
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
  } else if (metadata?.role === "teacher") {
    const { data: teacher, error: teacherError } = await supabase
      .from("teacher")
      .select("person(id)")
      .match({ id: metadata.teacher })
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
      nickname_th.like.%${query || ""}%, \
      first_name_en.ilike.%${query || ""}%, \
      middle_name_en.ilike.%${query || ""}%, \
      last_name_en.ilike.%${query || ""}%, \
      nickname_en.ilike.%${query || ""}%`
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
      .or(students.map((student) => `students.cs.{"${student.id}"}`).join())
      .eq("year", getCurrentAcademicYear());

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
      );
      return {
        id: student.id,
        role: "student",
        ...(classItem
          ? { metadata: { id: classItem.id, number: classItem.number } }
          : {}),
        ...db2PersonName(student.person),
      };
    });

  // Teachers

  // Get all teachers that have the matching person ID
  const { data: teachers, error: teachersError } = await supabase
    .from("teacher")
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
        profile
      ),
      subject_group(*)`
    )
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

export async function getLookupListPerson(
  id: number,
  role: Role
): Promise<BackendDataReturn<PersonLookupItem, null>> {
  let person: PersonLookupItem | null = null;

  // Fetch student
  if (role === "student") {
    const { data, error } = await supabase
      .from("student")
      .select("*, person(*)")
      .match({ id })
      .limit(1)
      .single();

    if (error) {
      console.error(error);
      return { data: null, error };
    }

    const { data: classItem, error: classError } = await supabase
      .from("classroom")
      .select("id, number")
      .contains("students", [id])
      .limit(1)
      .single();

    if (classError) {
      console.error(classError);
      return { data: null, error: classError };
    }

    person = {
      id: data.id,
      role: "student",
      metadata: { id: classItem.id, number: classItem.number },
      ...db2PersonName(data.person),
    };
  }

  // Fetch teacher
  else if (role === "teacher") {
    const { data, error } = await supabase
      .from("teacher")
      .select("*, person(*), subject_group(*)")
      .match({ id })
      .limit(1)
      .single();

    if (error) {
      console.error(error);
      return { data: null, error };
    }

    person = {
      id: data.id,
      role: "teacher",
      metadata: {
        id: data.subject_group.id,
        name: {
          th: data.subject_group.name_th,
          "en-US": data.subject_group.name_en,
        },
      },
      ...db2PersonName(data.person),
    };
  }

  if (person) return { data: person, error: null };
  return { data: null, error: { message: "invalid role." } };
}
