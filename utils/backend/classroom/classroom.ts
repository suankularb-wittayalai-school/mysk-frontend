// External libraries
import { User } from "@supabase/supabase-js";

// Backend
import { getUserMetadata } from "@/utils/backend/account";
import {
  createContact,
  deleteContact,
  updateContact,
} from "@/utils/backend/contact";
import { getSubjectGroups } from "@/utils/backend/subject/subjectGroup";

// Converters
import { db2Class, db2PersonName, db2Student } from "@/utils/backend/database";

// Helpers
import { range } from "@/utils/helpers/array";
import { getCurrentAcademicYear } from "@/utils/helpers/date";

// Types
import {
  Class,
  ClassAdminListItem,
  ClassLookupListItem,
  ClassOverview,
  ClassTeachersListSection,
  ClassWNumber,
} from "@/utils/types/class";
import {
  BackendCountedDataReturn,
  BackendDataReturn,
  DatabaseClient,
} from "@/utils/types/common";
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

export async function generateClasses(
  supabase: DatabaseClient,
  noOfClassesPerGrade: number[]
) {
  const classes: Class[] = noOfClassesPerGrade
    .map((numClasses, index) => {
      const classesForGrade: Class[] = range(numClasses).map((classNumber) => ({
        id: 0,
        number: (index + 1) * 100 + (classNumber + 1),
        year: getCurrentAcademicYear(),
        students: [],
        classAdvisors: [],
        schedule: {
          id: 0,
          content: [],
        },
        contacts: [],
        subjects: [],
      }));
      return classesForGrade;
    })
    .flat();

  await Promise.all(
    classes.map(async (classItem) => await createClassroom(supabase, classItem))
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
    .select("id, number, advisors, students")
    .order("number")
    .match({ year: getCurrentAcademicYear() });

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
      classAdvisors: classItem.advisors
        .map((advisor) => {
          const teacher = teachers?.find((teacher) => advisor === teacher.id)!;
          return { id: teacher.id, ...db2PersonName(teacher.person) };
        })
        .sort((a, b) => (a.name.th.firstName > b.name.th.firstName ? 1 : -1)),
      studentCount: classItem.students.length,
    })),
    error: null,
  };
}

export async function getAdminClasses(
  supabase: DatabaseClient,
  page: number,
  rowsPerPage: number,
  query?: string
): Promise<BackendCountedDataReturn<ClassAdminListItem[]>> {
  // If the query in invalid, we already know the result: an empty array
  if (query && query.length > 3 && !/[0-9]/.test(query))
    return { data: [], count: 0, error: null };

  // Format the query into a number range, for use with `.gt()` and `.lt()`
  const numberRange = query
    ? query.length === 1
      ? { gt: Number(query) * 100, lt: (Number(query) + 1) * 100 }
      : query.length === 2
      ? { gt: Number(query) * 10, lt: (Number(query) + 1) * 10 }
      : { gt: Number(query) - 1, lt: Number(query) + 1 }
    : { gt: 0, lt: 700 };

  // Fetch classes
  const { data, count, error } = await supabase
    .from("classroom")
    .select("id, number, advisors, students, year", { count: "exact" })
    // Class number query
    .gt("number", numberRange.gt)
    .lt("number", numberRange.lt)
    // Academic year query
    .or(
      query && query.length >= 4
        ? `year.eq.${query}, year.eq.${Number(query) - 543}`
        : "year.gt.0"
    )
    .order("year", { ascending: false })
    .order("number")
    // Pagination
    .range(rowsPerPage * (page - 1), rowsPerPage * page - 1);

  if (error) {
    console.error(error);
    return { data: [], count: 0, error };
  }

  const classAdvisorIDs = data!.map((classItem) => classItem.advisors).flat();
  const { data: teachers, error: teacherError } = await supabase
    .from("teacher")
    .select("*, person(*)")
    .or(`id.in.(${classAdvisorIDs.join()})`);

  if (teacherError) {
    console.error(teacherError);
    return { data: [], count: 0, error: teacherError };
  }

  return {
    data: data.map((classItem) => ({
      id: classItem.id,
      number: classItem.number,
      classAdvisors: classItem.advisors
        .map((advisor) => {
          const teacher = teachers?.find((teacher) => advisor === teacher.id)!;
          return { id: teacher.id, ...db2PersonName(teacher.person) };
        })
        .sort((a, b) => (a.name.th.firstName > b.name.th.firstName ? 1 : -1)),
      studentCount: classItem.students.length,
      year: classItem.year,
    })),
    count: count!,
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

export async function getClassTeachersList(
  supabase: DatabaseClient,
  classID: number
): Promise<BackendDataReturn<ClassTeachersListSection[]>> {
  // Get the teacher IDs of all subjectRooms where class matches
  const { data: roomSubjects, error: roomSubjectsError } = await supabase
    .from("room_subjects")
    .select("teacher")
    .match({ class: classID });

  if (roomSubjectsError) {
    console.error(roomSubjectsError);
    return { data: [], error: roomSubjectsError };
  }

  const teacherIDs = roomSubjects!
    .map((roomSubject) => roomSubject.teacher)
    .flat();

  // Fetch those teachers
  const { data: teachers, error: teacherError } = await supabase
    .from("teacher")
    .select("*, person(*), subject_group(id)")
    .or(`id.in.(${teacherIDs.join()})`);

  if (teacherError) {
    console.error(teacherError);
    return { data: [], error: teacherError };
  }

  // Get all subject groups
  const { data: subjectGroups, error: subjectGroupError } =
    await getSubjectGroups();

  if (subjectGroupError) {
    console.error(subjectGroupError);
    return { data: [], error: subjectGroupError };
  }

  // Format the Teachers into a list grouped into Subject Groups
  return {
    data: subjectGroups
      .map((subjectGroup) => ({
        subjectGroup,
        teachers: teachers
          .filter((teacher) => subjectGroup.id === teacher.subject_group.id)
          .map((teacher) => ({
            id: teacher.id,
            role: "teacher" as "teacher",
            ...db2PersonName(teacher.person),
            metadata: null,
          })),
      }))
      .filter((section) => section.teachers.length),
    error: null,
  };
}

export async function getClassFromUser(
  supabase: DatabaseClient,
  user: User
): Promise<BackendDataReturn<ClassWNumber, null>> {
  const { data: metadata, error: metadataError } = await getUserMetadata(
    supabase,
    user!.id
  );

  if (metadataError) {
    console.error(metadataError);
    return { data: null, error: metadataError };
  }

  const { data, error } = await supabase
    .from("classroom")
    .select("id, number")
    .match({ year: getCurrentAcademicYear() })
    .contains("students", [metadata!.student!])
    .limit(1)
    .single();

  if (error) {
    console.error(error);
    return { data: null, error };
  }

  return { data: data!, error: null };
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
    .select("number")
    .match({ year: getCurrentAcademicYear() });

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

  const personIDs = data.map((student) => student.person.id);

  const { data: allergies, error: allergiesError } = await supabase
    .from("people_allergies")
    .select("person_id(id), allergy_name")
    .or(`person_id.in.(${personIDs.join(",")})`);

  if (allergiesError) {
    console.error(allergiesError);
    return { data: [], error: allergiesError };
  }

  return {
    data: (
      await Promise.all(
        data!.map(async (student) => ({
          ...(await db2Student(supabase, student)),
          allergies: allergies
            .filter(
              (allergy) =>
                (allergy.person_id as { id: number }).id === student.person.id
            )
            .map((allergy) => allergy.allergy_name),
        }))
      )
    ).sort((a, b) => a.classNo - b.classNo),
    error: null,
  };
}
