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
import { db2Teacher } from "../database";
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

export async function getTeacherList(classID: number): Promise<Teacher[]> {
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
  const selected_teachers: (TeacherDB | null)[] = await Promise.all(
    // Flatten the arrays into an array of teacher IDs
    roomSubjects
      .map((roomSubject) => roomSubject.teacher)
      .flat()
      // Remove duplicates
      .filter((id, index, self) => self.indexOf(id) === index)
      // Fetch teacher data for each teacher
      .map(async (teacher_id) => {
        // Get teacher from ID
        const { data, error } = await supabase
          .from<TeacherDB>("teacher")
          .select("* ,people:person(*), SubjectGroup:subject_group(*)")
          .match({ id: teacher_id })
          .limit(1)
          .single();
        if (error || !data) {
          console.error(error);
          return null;
        }
        return data;
      })
  );
  const teachers: TeacherDB[] = selected_teachers.filter(
    (teacher) => teacher !== null
  ) as TeacherDB[];

  // console.log(
  //   roomSubjects
  //     .map((roomSubject) => roomSubject.teacher)
  //     .filter((id, index, self) => self.indexOf(id) === index)
  // );

  return await Promise.all(
    teachers.map(async (teacher) => await db2Teacher(teacher))
  );
}
