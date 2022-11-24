// External libraries
import { PostgrestError } from "@supabase/supabase-js";

// Backend
import { db2SubjectListItem } from "@utils/backend/database";

// Supabase
import { supabase } from "@utils/supabase-client";

// Types
import { ClassWNumber } from "@utils/types/class";
import { BackendDataReturn, DatabaseClient } from "@utils/types/common";
import { SubjectListItem } from "@utils/types/subject";
import { Database } from "@utils/types/supabase";

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
    data: await Promise.all(
      data.map(
        async (roomSubject) => await db2SubjectListItem(supabase, roomSubject)
      )
    ),
    error: null,
  };
}
