// Backend
import { createPerson } from "@/utils/backend/person/person";

// Converters
import { db2PersonName, db2Student } from "@/utils/backend/database";

// Helpers
import { getCurrentAcademicYear } from "@/utils/helpers/date";

// Types
import { ClassWNumber } from "@/utils/types/class";
import {
  BackendCountedDataReturn,
  BackendDataReturn,
  DatabaseClient,
} from "@/utils/types/common";
import {
  ImportedStudentData,
  Student,
  StudentAdminListItem,
} from "@/utils/types/person";
import { Database } from "@/utils/types/supabase";

// Miscellaneous
import { prefixMap } from "@/utils/maps";
import { removeFromObjectByKeys } from "@/utils/helpers/object";
import { nameJoiner } from "@/utils/helpers/name";

export async function getStudent(
  supabase: DatabaseClient,
  id: number
): Promise<BackendDataReturn<Student, null>> {
  const { data, error } = await supabase
    .from("student")
    .select("*, person(*)")
    .match({ id })
    .single();

  if (error) {
    console.error(error);
    return { data: null, error };
  }

  return {
    data: await db2Student(supabase, data!, { contacts: true }),
    error: null,
  };
}

export async function getAdminStudentList(
  supabase: DatabaseClient,
  page: number,
  rowsPerPage: number,
  query?: string
): Promise<BackendCountedDataReturn<StudentAdminListItem[]>> {
  let peopleIDs: number[] | null = null;

  // Support for searching with a name segment, which requires `people`
  if (query && query.length >= 3) {
    const { data, error } = await supabase
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
      .limit(rowsPerPage);

    if (error) {
      console.error(error);
      return { data: [], count: 0, error: null };
    }

    peopleIDs = data.map((person) => person.id);
  }

  const { data, count, error } = await supabase
    .from("student")
    .select("*, person(*)", { count: "exact" })
    .or(
      // If the query is for a name segment, use the search result from
      // `people`
      peopleIDs && !(query && /[0-9]{1,5}/.test(query))
        ? `person.in.(${peopleIDs.join()})`
        : // Otherwise, the query (if exists) is for student ID
          `std_id.like.${query || ""}%`
    )
    .order("std_id", { ascending: false })
    // Pagination
    .range(rowsPerPage * (page - 1), rowsPerPage * page - 1);

  if (error) {
    console.error(error);
    return { data: [], count: 0, error };
  }

  // Get all classes that contain these students
  const { data: classes, error: classesError } = await supabase
    .from("classroom")
    .select("id, number, students, no_list")
    .or(data.map((student) => `students.cs.{"${student.id}"}`).join());

  if (classesError) {
    console.error(classesError);
    return { data: [], count: 0, error: classesError };
  }

  return {
    data: data.map((student) => {
      const classItem = classes.find((classItem) =>
        classItem.students.includes(student.id)
      )!;
      const studentName = db2PersonName(student.person);

      return {
        id: student.id,
        studentID: student.std_id,
        classItem: removeFromObjectByKeys(["students"], classItem),
        classNo:
          classItem.no_list.findIndex(
            (noListStudent) => student.id === noListStudent
          ) + 1,
        name: {
          th: nameJoiner("th", studentName.name, studentName.prefix, {
            prefix: true,
          }),
          "en-US": nameJoiner("en-US", studentName.name, studentName.prefix, {
            prefix: true,
          }),
        },
      };
    }),
    count: count!,
    error: null,
  };
}

export async function createStudent(
  supabase: DatabaseClient,
  student: Student,
  email: string,
  isAdmin: boolean = false
): Promise<
  BackendDataReturn<Database["public"]["Tables"]["student"]["Row"], null>
> {
  const { data: person, error: personCreationError } = await createPerson(
    student
  );

  if (personCreationError) {
    console.error(personCreationError);
    return { data: null, error: personCreationError };
  }

  const { data: createdStudent, error: studentCreationError } = await supabase
    .from("student")
    .insert({
      person: person!.id,
      std_id: student.studentID.trim(),
    })
    .select("*, person(*)")
    .single();

  if (studentCreationError) {
    console.error(studentCreationError);
    // Delete the created person
    await supabase.from("people").delete().match({ id: person!.id });
    return { data: null, error: studentCreationError };
  }

  // add the student to the students array of the class
  // get the class

  if (student.class) {
    const { data: classData, error: classError } = await supabase
      .from("classroom")
      .select("*")
      .match({ number: student.class.number, year: getCurrentAcademicYear() })
      .limit(1)
      .single();
    if (classError) {
      console.error(classError);
      return { data: null, error: classError };
    }
    // add the student to the students array of the class
    // console.log(classData);
    const { error: updateClassError } = await supabase
      .from("classroom")
      .update({
        students: [...classData.students, createdStudent!.id],
        // put student at the index of classNo - 1
        no_list: [
          ...classData.no_list.slice(0, student.classNo - 1),
          createdStudent!.id,
          ...classData.no_list.slice(student.classNo),
        ],
      })
      .match({
        number: student.class.number,
        year: getCurrentAcademicYear(),
      });
    if (updateClassError) {
      console.error(updateClassError);
      return { data: null, error: updateClassError };
    }
  }

  // Register an account for the student
  await fetch("/api/account/student", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      id: createdStudent!.id,
      isAdmin,
    }),
  });

  return { data: createdStudent!, error: null };
}

export async function deleteStudent(
  supabase: DatabaseClient,
  student: Student
) {
  const { data: userid, error: selectingError } = await supabase
    .from("users")
    .select("id")
    .match({ student: student.id })
    .limit(1)
    .single();

  if (selectingError) {
    console.error(selectingError);
  }

  if (!userid) {
    console.error("No user found");
  }

  const { data, error } = await supabase
    .from("student")
    .delete()
    .match({ id: student.id })
    .select("person(id)")
    .limit(1)
    .single();

  if (error) {
    console.error(error);
    return;
  }

  // Delete the person of the student
  const { error: personDeletingError } = await supabase
    .from("people")
    .delete()
    .match({
      id: (data as Database["public"]["Tables"]["student"]["Row"]).person.id,
    });

  if (personDeletingError) {
    console.error(personDeletingError);
    return;
  }

  // get the class of the student
  if (student.class) {
    const { data: classData, error: classError } = await supabase
      .from("classroom")
      .select("*")
      .match({ number: student.class.number })
      .limit(1)
      .maybeSingle();
    if (classError) {
      console.error(classError);
      return { data: null, error: classError };
    }

    // remove the student from the class
    const { data: classStudent, error: classStudentError } = await supabase
      .from("classroom")
      .update({
        students: classData!.students.filter((id) => id !== student.id),
        // replace the student id with 0
        no_list: classData!.no_list.map((id) => (id === student.id ? 0 : id)),
      })
      .in("students", [student.id]);
    if (classStudentError) {
      console.error(classStudentError);
      return { data: null, error: classStudentError };
    }
  }

  // Delete account of the student
  await fetch(`/api/account`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: userid!.id }),
  });
}

export async function importStudents(
  supabase: DatabaseClient,
  data: ImportedStudentData[]
) {
  const students: { person: Student; email: string }[] = data.map((student) => {
    const person: Student = {
      id: 0,
      prefix: {
        th: student.prefix,
        "en-US": prefixMap[student.prefix],
      },
      role: "student",
      name: {
        th: {
          firstName: student.first_name_th,
          middleName: student.middle_name_th,
          lastName: student.last_name_th,
        },
        "en-US": {
          firstName: student.first_name_en,
          middleName: student.middle_name_en,
          lastName: student.last_name_en,
        },
      },
      birthdate: student.birthdate,
      citizenID: student.citizen_id.toString(),
      studentID: student.student_id.toString(),
      contacts: [],
      class: {
        id: 0,
        number: student.class_number,
      },
      classNo: student.class_number,
    };
    const email = student.email;
    return { person, email };
  });

  // for (const student of students) {
  //   await createStudent(student.person, student.email);
  // }
  // sequentially create students
  for (let i = 0; i < students.length; i++) {
    await createStudent(supabase, students[i].person, students[i].email);
    if (i % 10 === 0) {
      console.log(i);
    }
  }
}

export async function getClassOfStudent(
  supabase: DatabaseClient,
  studentDBID: number
): Promise<BackendDataReturn<ClassWNumber, null>> {
  const { data, error } = await supabase
    .from("classroom")
    .select("id, number")
    .match({ year: getCurrentAcademicYear() })
    .contains("students", [studentDBID])
    .limit(1)
    .single();

  if (error) {
    console.error(error);
    return { data: null, error };
  }

  return { data: data!, error: null };
}
