// External libraries
import { PostgrestError } from "@supabase/supabase-js";

// Backend
import { db2SubjectListItem } from "@/utils/backend/database";

// Supabase
import { supabase } from "@/utils/supabase-client";

// Types
import { ClassWNumber } from "@/utils/types/class";
import { BackendDataReturn, DatabaseClient } from "@/utils/types/common";
import { SubjectListItem, TeacherSubjectItem } from "@/utils/types/subject";
import { Database } from "@/utils/types/supabase";

export async function getRoomsEnrolledInSubject(
  supabase: DatabaseClient,
  subjectID: number
): Promise<BackendDataReturn<ClassWNumber[]>> {
  const { data, error } = await supabase
    .from("room_subjects")
    .select("classroom(id, number)")
    .match({ subject: subjectID });

  if (error || !data) {
    console.error(error);
    return { data: [], error };
  }

  return {
    data: data.map((roomSubject) => ({
      id: (
        roomSubject.classroom as Database["public"]["Tables"]["classroom"]["Row"]
      ).id,
      number: (
        roomSubject.classroom as Database["public"]["Tables"]["classroom"]["Row"]
      ).number,
    })),
    error: null,
  };
}

export async function getSubjectList(
  supabase: DatabaseClient,
  classID: number
): Promise<{ data: SubjectListItem[]; error: PostgrestError | null }> {
  const { data, error } = await supabase
    .from("room_subjects")
    .select("*, subject:subject(*), class(*)")
    .match({ class: classID });

  if (error || !data) {
    console.error(error);
    return { data: [], error };
  }

  return {
    data: (
      await Promise.all(
        data.map(
          async (roomSubject) => await db2SubjectListItem(supabase, roomSubject)
        )
      )
    ).sort((a, b) => (a.subject.code.th > b.subject.code.th ? 1 : -1)),
    error: null,
  };
}

/**
 * Generate Room Subjects from an array of Teacher Subject Items.
 *
 * @param supabase An Supabase client with proper permissions (either `useSupabaseClient` or `createServerSupabaseClient`).
 * @param teachSubjects An array of
 *
 * @returns A standard {@link BackendDataReturn Backend Data Return} of an array of the room subjects generated in the database.
 */
export async function updateRoomSubjectsFromTeachSubjects(
  supabase: DatabaseClient,
  teachSubjects: TeacherSubjectItem[],
  teacherID: number
): Promise<
  BackendDataReturn<Database["public"]["Tables"]["room_subjects"]["Row"][]>
> {
  // Get exisiting room subjects connected to the same subjects as we’re about
  // to add
  const { data: exisiting, error: exisitingError } = await supabase
    .from("room_subjects")
    .select("id, subject, teacher, coteacher")
    .or(
      `subject.in.(${teachSubjects.map(
        (teachSubject) => teachSubject.id
      )}), teacher.cs.{"${teacherID}"}, coteacher.cs.{"${teacherID}"}`
    );

  if (exisitingError) {
    console.error(exisitingError);
    return { data: [], error: exisitingError };
  }

  console.log(exisiting);

  return { data: [], error: null };
}
