// Backend
import { createPerson } from "@utils/backend/person/person";

// Helpers
import { getCurrentAcademicYear } from "@utils/helpers/date";

// Supabase
import { supabase } from "@utils/supabase-client";

// Types
import { ClassWNumber } from "@utils/types/class";
import { BackendDataReturn, DatabaseClient } from "@utils/types/common";
import { ImportedStudentData, Student } from "@utils/types/person";
import { Database } from "@utils/types/supabase";

const prefixMap = {
  เด็กชาย: "Master",
  นาย: "Mr.",
  นาง: "Mrs.",
  นางสาว: "Miss.",
} as const;

export async function createStudent(
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
  const { data: classData, error: classError } = await supabase
    .from("classroom")
    .select("*")
    .match({ number: student.class.number })
    .limit(1)
    .single();
  if (classData) {
    // add the student to the students array of the class
    // console.log(classData);
    const { data: updatedClass, error: updateClassError } = await supabase
      .from("classroom")
      .update({
        students: [...classData.students, createdStudent.id],
        // put student at the index of classNo - 1
        no_list: [
          ...classData.no_list.slice(0, student.classNo - 1),
          createdStudent.id,
          ...classData.no_list.slice(student.classNo),
        ],
      })
      .match({ number: student.class.number, year: getCurrentAcademicYear() });

    if (updateClassError || !updatedClass) {
      console.error(updateClassError);
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

export async function deleteStudent(student: Student) {
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
  const { data: classData, error: classError } = await supabase
    .from("classroom")
    .select("*")
    .match({ number: student.class.number })
    .limit(1)
    .maybeSingle();

  // remove the student from the class
  const { data: classStudent, error: classStudentError } = await supabase
    .from("classroom")
    .update({
      students: classData!.students.filter((id) => id !== student.id),
      // replace the student id with 0
      no_list: classData!.no_list.map((id) => (id === student.id ? 0 : id)),
    })
    .in("students", [student.id]);

  if (classStudentError || !classStudent) {
    console.error(classStudentError);
    return;
  }
  // Delete account of the student
  await fetch(`/api/account`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: userid!.id }),
  });
}

export async function importStudents(data: ImportedStudentData[]) {
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
    await createStudent(students[i].person, students[i].email);
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
