// External libraries
import { User } from "@supabase/supabase-js";

// Backend
import {
  createContact,
  deleteContact,
  updateContact,
} from "@/utils/backend/contact";

// Converters
import { db2Class, db2PersonName, db2Student } from "@/utils/backend/database";

// Helpers
import { getCurrentAcademicYear } from "@/utils/helpers/date";

// Types
import {
  Class,
  ClassLookupListItem,
  ClassOverview,
  ClassWNumber,
} from "@/utils/types/class";
import { BackendDataReturn, DatabaseClient } from "@/utils/types/common";
import { StudentListItem } from "@/utils/types/person";
import { Database } from "@/utils/types/supabase";

export async function createClassroom(
  supabase: DatabaseClient,
  classroom: Class
): Promise<
  BackendDataReturn<Database["public"]["Tables"]["classroom"]["Row"], null>
> {
  const contacts = await Promise.all(
    classroom.contacts.map((contact) => createContact(supabase, contact))
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
    .map((contact) => contact.data?.id)
    .filter((id) => id !== undefined || id !== null);

  const { data: createdClass, error: classCreationError } = await supabase
    .from("classroom")
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
    })
    .select("*")
    .limit(1)
    .single();

  if (classCreationError) {
    console.error(classCreationError);
    return { data: null, error: classCreationError };
  }

  return { data: createdClass!, error: null };
}

export async function getClassroom(
  supabase: DatabaseClient,
  number: number
): Promise<BackendDataReturn<Class, null>> {
  const { data, error } = await supabase
    .from("classroom")
    .select("*")
    .match({ number, year: getCurrentAcademicYear() })
    .limit(1)
    .single();

  if (error) {
    console.error(error);
    return { data: null, error };
  }

  return { data: await db2Class(supabase, data!), error: null };
}

export async function getClassWNumber(
  supabase: DatabaseClient,
  number: number
): Promise<BackendDataReturn<ClassWNumber, null>> {
  const { data, error } = await supabase
    .from("classroom")
    .select("id, number")
    .match({ number, year: getCurrentAcademicYear() })
    .limit(1)
    .single();

  if (error) {
    console.error(error);
    return { data: null, error };
  }

  return { data: data!, error };
}

export async function updateClassroom(
  supabase: DatabaseClient,
  classroom: Class
): Promise<
  BackendDataReturn<Database["public"]["Tables"]["classroom"]["Row"], null>
> {
  const contacts = await Promise.all(
    classroom.contacts.map((contact) => updateContact(supabase, contact))
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
    .map((contact) => contact.data?.id ?? null)
    .filter((id) => id !== undefined || id !== null) as number[];

  const { data: updatedClass, error: classUpdateError } = await supabase
    .from("classroom")
    .update({
      number: classroom.number,
      year: classroom.year,
      contacts: contactIDs,
      advisors: classroom.classAdvisors.map((advisor) => advisor.id),
      students: classroom.students.map((student) => student.id),
      // Map `no_list` to be an array of student IDs with each ID at
      // index class no - 1
      no_list: [...Array(60)].map((_, index) => {
        const student = classroom.students.find(
          (student) => student.classNo === index + 1
        );
        return student?.id || 0;
      }),
      subjects: [],
    })
    .match({ id: classroom.id })
    .select("*")
    .single();

  if (classUpdateError) {
    console.error(classUpdateError);
    return { data: null, error: classUpdateError };
  }
  return { data: updatedClass!, error: null };
}

export async function deleteClassroom(
  supabase: DatabaseClient,
  classItem: Class
) {
  const { error } = await supabase
    .from("classroom")
    .delete()
    .match({ id: classItem.id });
  if (error) console.error(error);
}

export async function importClasses(
  supabase: DatabaseClient,
  classes: { number: number; year: number }[]
) {
  const classesToImport: Class[] = classes.map((classData) => ({
    id: 0,
    number: classData.number,
    year: classData.year,
    students: [],
    classAdvisors: [],
    schedule: {
      id: 0,
      content: [],
    },
    contacts: [],
    subjects: [],
  }));

  await Promise.all(
    classesToImport.map(
      async (classItem) => await createClassroom(supabase, classItem)
    )
  );
}

export async function addAdvisorToClassroom(
  supabase: DatabaseClient,
  teacherID: number,
  classID: number
): Promise<
  BackendDataReturn<Database["public"]["Tables"]["classroom"]["Row"], null>
> {
  const { data: classroom, error: classroomSelectionError } = await supabase
    .from("classroom")
    .select("advisors, number, year")
    .match({ id: classID, year: getCurrentAcademicYear() })
    .limit(1)
    .single();

  if (classroomSelectionError) {
    console.error(classroomSelectionError);
    return { data: null, error: classroomSelectionError };
  }

  const { data: updatedClassroom, error: classroomUpdatingError } =
    await supabase
      .from("classroom")
      .update({
        advisors: [...classroom!.advisors, teacherID],
      })
      .eq("id", classID)
      .select("*")
      .limit(1)
      .single();

  if (classroomUpdatingError) {
    console.error(classroomUpdatingError);
    return { data: null, error: classroomUpdatingError };
  }

  return { data: updatedClassroom!, error: null };
}

export async function addContactToClassroom(
  supabase: DatabaseClient,
  contactID: number,
  classID: number
): Promise<
  BackendDataReturn<Database["public"]["Tables"]["classroom"]["Row"], null>
> {
  const { data: classroom, error: classroomSelectionError } = await supabase
    .from("classroom")
    .select("contacts, number, year")
    .match({ id: classID, year: getCurrentAcademicYear() })
    .limit(1)
    .single();

  if (classroomSelectionError) {
    return { data: null, error: classroomSelectionError };
  }

  const { data: updatedClassroom, error: classroomUpdatingError } =
    await supabase
      .from("classroom")
      .update({
        contacts: [...classroom!.contacts, contactID],
      })
      .eq("id", classID)
      .select("*")
      .limit(1)
      .single();

  if (classroomUpdatingError) {
    console.error(classroomUpdatingError);
    return { data: null, error: classroomUpdatingError };
  }

  return { data: updatedClassroom!, error: null };
}

export async function removeContactFromClassroom(
  supabase: DatabaseClient,
  contactID: number,
  classID: number
): Promise<
  BackendDataReturn<Database["public"]["Tables"]["classroom"]["Row"], null>
> {
  const { data: classroom, error: classroomSelectionError } = await supabase
    .from("classroom")
    .select("contacts, number, year")
    .match({ id: classID, year: getCurrentAcademicYear() })
    .limit(1)
    .single();

  if (classroomSelectionError) {
    return { data: null, error: classroomSelectionError };
  }

  const { data: updatedClassroom, error: classroomUpdatingError } =
    await supabase
      .from("classroom")
      .update({
        contacts: classroom!.contacts.filter((id) => id !== contactID),
      })
      .eq("id", classID)
      .select("*")
      .limit(1)
      .single();

  if (classroomUpdatingError) {
    console.error(classroomUpdatingError);
    return { data: null, error: classroomUpdatingError };
  }

  const { error: contactDeletionError } = await deleteContact(
    supabase,
    contactID
  );

  if (contactDeletionError) {
    console.error(contactDeletionError);
    return { data: null, error: contactDeletionError };
  }

  return { data: updatedClassroom!, error: null };
}

export async function getLookupClasses(
  supabase: DatabaseClient
): Promise<BackendDataReturn<ClassLookupListItem[]>> {
  const { data, error } = await supabase
    .from("classroom")
    .select("id, number, advisors")
    .order("number");

  if (error) {
    console.error(error);
    return { data: [], error };
  }

  const classAdvisorIDs = data!.map((classItem) => classItem.advisors).flat();
  const { data: teachers, error: teacherError } = await supabase
    .from("teacher")
    .select("*, person(*)")
    .or(`id.in.(${classAdvisorIDs.join()})`);

  if (teacherError) {
    console.error(teacherError);
    return { data: [], error: teacherError };
  }

  return {
    data: data.map((classItem) => ({
      id: classItem.id,
      number: classItem.number,
      classAdvisors: classItem.advisors.map((advisor) => {
        const teacher = teachers?.find((teacher) => advisor === teacher.id)!;
        return { id: teacher.id, ...db2PersonName(teacher.person) };
      }),
    })),
    error: null,
  };
}

export async function getClassOverview(
  supabase: DatabaseClient,
  number: number
): Promise<BackendDataReturn<ClassOverview, null>> {
  const { data, error } = await supabase
    .from("classroom")
    .select("*")
    .match({ number, year: getCurrentAcademicYear() })
    .limit(1)
    .single();

  if (error) {
    console.error(error);
    return { data: null, error };
  }

  return {
    data: await db2Class(supabase, data, { advisors: true, contacts: true }),
    error: null,
  };
}

export async function getClassNumberFromUser(
  supabase: DatabaseClient,
  user: User
): Promise<BackendDataReturn<number, null>> {
  const studentID: number = user.user_metadata.student;

  const { data: classItem, error: classError } = await supabase
    .from("classroom")
    .select("number")
    .match({ year: getCurrentAcademicYear() })
    .contains("students", [studentID])
    .limit(1)
    .single();

  if (classError) {
    console.error(classError);
    return { data: null, error: classError };
  }

  return { data: classItem!.number, error: null };
}

export async function getClassIDFromNumber(
  supabase: DatabaseClient,
  number: number
): Promise<BackendDataReturn<number, null>> {
  const { data: classroom, error: classroomSelectionError } = await supabase
    .from("classroom")
    .select("id")
    .match({ number, year: getCurrentAcademicYear() })
    .limit(1)
    .single();

  if (classroomSelectionError) {
    console.error(classroomSelectionError);
    return { data: null, error: classroomSelectionError };
  }

  return { data: classroom!.id, error: null };
}

export async function getAllClassNumbers(
  supabase: DatabaseClient
): Promise<number[]> {
  const { data: classrooms, error: classroomsError } = await supabase
    .from("classroom")
    .select("number");

  if (classroomsError) {
    console.error(classroomsError);
    return [];
  }

  return classrooms!.map((classroom) => classroom.number);
}

export async function getClassStudentList(
  supabase: DatabaseClient,
  classID: number
): Promise<BackendDataReturn<StudentListItem[]>> {
  const { data: classItem, error: classError } = await supabase
    .from("classroom")
    .select("students")
    .match({ id: classID, year: getCurrentAcademicYear() })
    .limit(1)
    .single();

  if (classError) {
    console.error(classError);
    return { data: [], error: classError };
  }

  const { data, error } = await supabase
    .from("student")
    .select("*, person(*)")
    .in("id", classItem!.students);

  if (error) {
    console.error(error);
    return { data: [], error };
  }

  return {
    data: (
      await Promise.all(
        data!.map(async (student) => await db2Student(supabase, student))
      )
    ).sort((a, b) => a.classNo - b.classNo),
    error: null,
  };
}
