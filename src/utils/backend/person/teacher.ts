// Modules
import { PostgrestError } from "@supabase/supabase-js";

// Supabase
import { supabase } from "@utils/supabaseClient";

// Types
import {
  PersonDB,
  TeacherDB,
  TeacherTable,
} from "@utils/types/database/person";
import { RoomSubjectDB } from "@utils/types/database/subject";
import { Teacher } from "@utils/types/person";

// Backend
import { createPerson } from "./person";

export async function createTeacher(
  teacher: Teacher,
  email: string,
  isAdmin: boolean = false
): Promise<{ data: TeacherTable[] | null; error: PostgrestError | null }> {
  const { data: person, error: personCreationError } = await createPerson(
    teacher
  );
  if (personCreationError || !person) {
    console.error(personCreationError);
    return { data: null, error: personCreationError };
  }
  const { data: createdTeacher, error: teacherCreationError } = await supabase
    .from<TeacherTable>("teacher")
    .insert({
      person: person[0]?.id,
      subject_group: teacher.subjectGroup.id,
      // class_advisor_at: form.classAdvisorAt,
      teacher_id: teacher.teacherID.trim(),
    });
  if (teacherCreationError || !createdTeacher) {
    console.error(teacherCreationError);
    // delete the created person
    await supabase
      .from<PersonDB>("people")
      .delete()
      .match({ id: person[0]?.id });
    return { data: null, error: teacherCreationError };
  }

  // register an account for the teacher
  await fetch("/api/account/teacher", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password: teacher.birthdate.split("-").join(""),
      id: createdTeacher[0]?.id,
      isAdmin,
    }),
  });

  return { data: createdTeacher, error: null };
}

// https://supabase.com/docs/reference/javascript/select

export async function getTeacherList(classID: number) {
  // Get the teachers of all subjectRooms where class matches
  const { data: roomSubjects, error: roomSubjectsError } = await supabase
    .from<RoomSubjectDB>("room_subjects")
    .select("teacher")
    .match({ class: classID });
  if (roomSubjectsError || !roomSubjects) {
    console.error(roomSubjectsError);
    return [];
  }

  // Map array of teacher IDs into array of teachers (fetch teacher in map)
  const teachers: TeacherDB[] = await Promise.all(
    // 2. Flatten the arrays into an array of teacher IDs
    ([] as number[]).concat
      .apply(
        [],
        // 1. Map into array of array of teacher IDs
        roomSubjects.map((roomSubject) => roomSubject.teacher)
      )
      // 3. Fetch teacher data for each teacher
      .map(async () => {
        // TODO: Get teacher from ID (select only id, name, contacts, subject group)
        const { data, error } = await supabase
          .from<TeacherDB>("teacher")
          .select(
            "id, people:person(first_name_en, last_name_en, contacts), Subjectgroup:subject_group(name_en)"
          );
        if (error || !data) {
          console.error(error);
          return null;
        }
        return data;
      })
      .filter((teacher) => teacher)
  );

  return teachers;
}
