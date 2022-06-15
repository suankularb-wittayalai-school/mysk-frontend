import { PostgrestError } from "@supabase/supabase-js";
import { supabase } from "@utils/supabaseClient";
import { Class } from "@utils/types/class";
import { ClassroomTable } from "@utils/types/database/class";
import { createContact, updateContact } from "../contact";

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
