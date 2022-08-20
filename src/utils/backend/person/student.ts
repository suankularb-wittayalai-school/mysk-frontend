import { PostgrestError } from "@supabase/supabase-js";
import { getLocaleYear } from "@utils/helpers/date";
import { supabase } from "@utils/supabaseClient";
import { ClassroomTable } from "@utils/types/database/class";
import { PersonDB, StudentTable } from "@utils/types/database/person";
import { Student } from "@utils/types/person";
import { getClassroom } from "../classroom/classroom";
import { createPerson } from "./person";

export async function createStudent(
  student: Student,
  email: string,
  isAdmin: boolean = false
): Promise<{ data: StudentTable[] | null; error: PostgrestError | null }> {
  const { data: person, error: personCreationError } = await createPerson(
    student
  );
  if (personCreationError || !person) {
    console.error(personCreationError);
    return { data: null, error: personCreationError };
  }

  const { data: createdStudent, error: studentCreationError } = await supabase
    .from<StudentTable>("student")
    .insert({
      person: person[0]?.id,
      std_id: student.studentID.trim(),
    });
  if (studentCreationError || !createdStudent) {
    console.error(studentCreationError);
    // delete the created person
    await supabase
      .from<PersonDB>("people")
      .delete()
      .match({ id: person[0]?.id });
    return { data: null, error: studentCreationError };
  }
  const year = parseInt(student.birthdate.split("-")[0]) + 543;
  // make default password a ddmmyyyy (yyyy in BE) from yyyy-mm-dd (yyyy in AD)
  const password = `${parseInt(student.birthdate.split("-")[2])}${parseInt(
    student.birthdate.split("-")[1]
  )}${year}`;
  // console.log(password);
  // register an account for the student
  const res = await fetch("/api/account/student", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password: password,
      id: createdStudent[0]?.id,
      isAdmin,
    }),
  });

  // console.log(await res.json());
  // add student to the class
  const classroom = await getClassroom(student.class.number);
  if (classroom.id != 0) {
    const { data: updatedClass, error: classUpdateError } = await supabase
      .from<ClassroomTable>("classroom")
      .update({
        students: [
          ...classroom.students.map((student) => student.id),
          createdStudent[0]?.id,
        ],
      })
      .match({ id: classroom.id });
    if (classUpdateError || !updatedClass) {
      console.error(classUpdateError);
      return { data: null, error: classUpdateError };
    }
  }

  return { data: createdStudent, error: null };
}
