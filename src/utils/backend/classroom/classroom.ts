// External libraries
import { PostgrestError } from "@supabase/supabase-js";
import { IncomingMessage } from "http";
import { NextApiRequestCookies } from "next/dist/server/api-utils";

// Backend
import { createContact, updateContact } from "@utils/backend/contact";

// Converters
import { db2Class, db2Student } from "@utils/backend/database";

// Helpers
import { getCurrentAcedemicYear } from "@utils/helpers/date";

// Supabase
import { supabase } from "@utils/supabaseClient";

// Types
import { ClassroomDB, ClassroomTable } from "@utils/types/database/class";
import { Class } from "@utils/types/class";
import { BackendReturn } from "@utils/types/common";
import { StudentListItem } from "@utils/types/person";
import { StudentDB } from "@utils/types/database/person";

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
      advisors: classroom.classAdvisors.map((advisor) => advisor.id),
      students: classroom.students.map((student) => student.id),
      no_list: [...Array(60)].map((_, index) => {
        const student = classroom.students.find(
          (student) => student.classNo === index + 1
        );
        return student?.id || 0;
      }),
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
      advisors: classroom.classAdvisors.map((advisor) => advisor.id),
      students: classroom.students.map((student) => student.id),
      // map no list to be an array of student ids with each id at index class no - 1
      no_list: [...Array(60)].map((_, index) => {
        const student = classroom.students.find(
          (student) => student.classNo === index + 1
        );
        return student?.id || 0;
      }),
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

  return { data: updatedClassroom, error: classroomUpdatingError };
}

export async function getClassNumberFromReq(
  req: IncomingMessage & { cookies: NextApiRequestCookies }
): Promise<BackendReturn<number, null>> {
  const { user, error: userError } = await supabase.auth.api.getUserByCookie(
    req
  );

  if (userError) {
    console.error(userError);
    return { data: null, error: userError };
  }

  const studentID: number = user?.user_metadata.student;

  const { data: classItem, error: classError } = await supabase
    .from<ClassroomDB>("classroom")
    .select("number")
    .match({ year: getCurrentAcedemicYear() })
    .contains("students", [studentID])
    .limit(1)
    .single();

  if (classError) {
    console.error(classError);
    return { data: null, error: classError };
  }

  return { data: (classItem as ClassroomDB).number, error: null };
}

export async function getClassIDFromNumber(
  number: number
): Promise<BackendReturn<number, null>> {
  const { data: classroom, error: classroomSelectionError } = await supabase
    .from<ClassroomTable>("classroom")
    .select("id")
    .match({ number, year: getCurrentAcedemicYear() })
    .limit(1)
    .single();

  if (classroomSelectionError) {
    console.error(classroomSelectionError);
    return { data: null, error: classroomSelectionError };
  }

  return { data: (classroom as ClassroomTable).id, error: null };
}

export async function getAllClassNumbers(): Promise<number[]> {
  const { data: classrooms, error: classroomsError } = await supabase
    .from<ClassroomTable>("classroom")
    .select("number");

  if (classroomsError || !classrooms) {
    console.error(classroomsError);
    return [];
  }

  return classrooms.map((classroom) => classroom.number);
}

export async function getClassStudentList(
  classID: number
): Promise<BackendReturn<StudentListItem[]>> {
  const { data: classItem, error: classError } = await supabase
    .from<ClassroomDB>("classroom")
    .select("students")
    .match({ id: classID, year: getCurrentAcedemicYear() })
    .limit(1)
    .single();

  if (classError) {
    console.error(classError);
    return { data: [], error: classError };
  }

  const { data, error } = await supabase
    .from<StudentDB>("student")
    .select("id, std_id, people:person(*)")
    .in("id", (classItem as ClassroomDB).students);

  if (error) {
    console.error(error);
    return { data: [], error };
  }

  return {
    data: (
      await Promise.all(
        (data as StudentDB[]).map(async (student) => await db2Student(student))
      )
    ).sort((a, b) => a.classNo - b.classNo),
    error: null,
  };
}
