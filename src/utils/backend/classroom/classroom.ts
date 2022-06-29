// Modules
import { PostgrestError } from "@supabase/supabase-js";

// Backend
import { createContact, updateContact } from "@utils/backend/contact";

// Converters
import { db2Class } from "@utils/backend/database";

// Helpers
import { getCurrentAcedemicYear } from "@utils/helpers/date";

// Supabase
import { supabase } from "@utils/supabaseClient";

// Types
import { ClassroomDB, ClassroomTable } from "@utils/types/database/class";
import { Class } from "@utils/types/class";

export async function createClassroom(
  classroom: Class
): Promise<{ data: ClassroomTable[] | null; error: PostgrestError | null }> {
  const contacts = await Promise.all(
    classroom.contacts.map(async (contact) => await createContact(contact))
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

  const { data: createdClass, error: classCreationError } = await supabase
    .from<ClassroomTable>("classroom")
    .insert({
      number: classroom.number,
      year: classroom.year,
      contacts: contactIds as number[],
      semester: classroom.semester,
      advisors: classroom.classAdvisors.map((advisor) => advisor.id),
      students: classroom.students.map((student) => student.id),
      subjects: [],
    });
  if (classCreationError || !createdClass) {
    console.error(classCreationError);
    return { data: null, error: classCreationError };
  }
  return { data: createdClass, error: null };
}

export async function getClassroom(number: number): Promise<Class> {
  let classItem: Class = {
    id: 0,
    number: 0,
    classAdvisors: [],
    contacts: [],
    students: [],
    year: getCurrentAcedemicYear(),
    semester: 1,
    subjects: [],
  };

  if (!number) return classItem;

  const { data, error } = await supabase
    .from<ClassroomDB>("classroom")
    .select("*")
    .match({ number, year: getCurrentAcedemicYear() })
    .limit(1)
    .single();

  if (!data || error) {
    console.error(error);
    return classItem;
  }

  return await db2Class(data);
}

export async function updateClassroom(
  classroom: Class
): Promise<{ data: ClassroomTable[] | null; error: PostgrestError | null }> {
  const contacts = await Promise.all(
    classroom.contacts.map(async (contact) => await updateContact(contact))
  ).catch((error) => {
    console.error(error);
    return [];
  });

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

  const contactIDs = contacts
    .map((contact) => contact.data?.[0]?.id ?? null)
    .filter((id) => id !== undefined || id !== null) as number[];

  const { data: updatedClass, error: classUpdateError } = await supabase
    .from<ClassroomTable>("classroom")
    .update({
      number: classroom.number,
      year: classroom.year,
      contacts: contactIDs,
      semester: classroom.semester,
      advisors: classroom.classAdvisors.map((advisor) => advisor.id),
      students: classroom.students.map((student) => student.id),
      subjects: [],
    })
    .match({ id: classroom.id });
  if (classUpdateError || !updatedClass) {
    console.error(classUpdateError);
    return { data: null, error: classUpdateError };
  }
  return { data: updatedClass, error: null };
}

export async function addAdvisorToClassroom(
  teacherID: number,
  classID: number
): Promise<{ data: ClassroomTable | null; error: PostgrestError | null }> {
  const { data: classroom, error: classroomSelectionError } = await supabase
    .from<{ advisors: number[]; number: number; year: number }>("classroom")
    .select("advisors, number, year")
    .match({ id: classID, year: getCurrentAcedemicYear() })
    .limit(1)
    .single();

  if (!classroom || classroomSelectionError) {
    return { data: null, error: classroomSelectionError };
  }

  const { data: updatedClassroom, error: classroomUpdatingError } =
    await supabase
      .from<ClassroomTable>("classroom")
      .update({ advisors: [...classroom.advisors, teacherID] })
      .eq("id", classID)
      .single();

  return { data: updatedClassroom, error: classroomUpdatingError };
}

export async function addContactToClassroom(
  contactID: number,
  classID: number
): Promise<{ data: ClassroomTable | null; error: PostgrestError | null }> {
  const { data: classroom, error: classroomSelectionError } = await supabase
    .from<{ contacts: number[]; number: number; year: number }>("classroom")
    .select("contacts, number, year")
    .match({ id: classID, year: getCurrentAcedemicYear() })
    .limit(1)
    .single();

  if (!classroom || classroomSelectionError) {
    return { data: null, error: classroomSelectionError };
  }

  const { data: updatedClassroom, error: classroomUpdatingError } =
    await supabase
      .from<ClassroomTable>("classroom")
      .update({ contacts: [...classroom.contacts, contactID] })
      .eq("id", classID)
      .single();
  // UPDATE contacts value ... WHERE id = ?;

  return { data: updatedClassroom, error: classroomUpdatingError };
}

export async function getClassIDFromNumber(number: number): Promise<number> {
  const { data: classroom, error: classroomSelectionError } = await supabase
    .from<ClassroomTable>("classroom")
    .select("id")
    .match({ number })
    .limit(1)
    .single();

  if (classroomSelectionError || !classroom) {
    console.error(classroomSelectionError);
    return 0;
  }

  return classroom.id;
}
