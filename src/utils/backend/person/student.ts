import { PostgrestError, User } from "@supabase/supabase-js";
import { supabase } from "@utils/supabaseClient";
import { PersonDB, PersonTable, StudentTable } from "@utils/types/database/person";
import { Student } from "@utils/types/person";
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

export async function deleteStudent(
  studentID: number
) {
  const { data: userid, error: selectingError } = await supabase
    .from<User>("users")
    .select("id")
    .match({ student: studentID })
    .limit(1)
    .single();

  if (selectingError) {
    console.error(selectingError);
    return;
  }

  if (!userid) {
    console.error("No user found");
    return;
  }

  const { data: deleting, error } = await supabase
    .from<StudentTable>("student")
    .delete()
    .match({ id: studentID });
  if (error || !deleting) {
    console.error(error);
    return;
  }

  // Delete the person of the student
  const { data: person, error: personDeletingError } = await supabase
    .from<PersonTable>("people")
    .delete()
    .match({ id: deleting[0].person });

  if (personDeletingError || !person) {
    console.error(personDeletingError);
    return;
  }

  // Delete account of the student
  await fetch(`/api/account`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: userid.id,
    }),
  });
}
