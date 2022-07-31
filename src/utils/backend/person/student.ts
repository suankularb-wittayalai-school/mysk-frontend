// External libraries
import { PostgrestError, User } from "@supabase/supabase-js";
import { GetServerSidePropsContext } from "next";

// Supabase
import { supabase } from "@utils/supabaseClient";

// Backend
import { createPerson } from "@utils/backend/person/person";
import { db2Student } from "@utils/backend/database";

// Types
import {
  PersonDB,
  StudentDB,
  StudentTable,
} from "@utils/types/database/person";
import { BackendReturn } from "@utils/types/common";
import { Student } from "@utils/types/person";

export async function getStudentByCookie(
  req: GetServerSidePropsContext["req"]
): Promise<BackendReturn<Student, null>> {
  const { data: user, error: userError } =
    await supabase.auth.api.getUserByCookie(req);

  if (userError) {
    console.error(userError);
    return { data: null, error: userError };
  }

  if (user?.user_metadata.role != "student")
    return { data: null, error: { message: "user is not a student." } };

  const { data: student, error: studentError } = await supabase
    .from<StudentDB>("student")
    .select("id, std_id, people:person(*)")
    .eq("id", (user as User).user_metadata?.student)
    .single();

  if (studentError) {
    console.error(studentError);
    return { data: null, error: studentError };
  }

  return { data: await db2Student(student as StudentDB), error: null };
}

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

  // register an account for the student
  const res = await fetch("/api/account/student", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password: student.birthdate.split("-").join(""),
      id: createdStudent[0]?.id,
      isAdmin,
    }),
  });

  // console.log(await res.json());

  return { data: createdStudent, error: null };
}
