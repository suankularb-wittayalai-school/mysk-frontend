import { PostgrestError } from "@supabase/supabase-js";
import { supabase } from "@utils/supabaseClient";
import { ClassWNumber } from "@utils/types/class";
import { RoomSubjectDB } from "@utils/types/database/subject";
import { SubjectListItem } from "@utils/types/subject";
import { db2SubjectListItem } from "../database";

export async function getRoomsEnrolledInSubject(
  subjectID: number
): Promise<{ data: ClassWNumber[] | null; error: PostgrestError | null }> {
  const { data, error } = await supabase
    .from<RoomSubjectDB>("room_subjects")
    .select("classroom:class(id, number)")
    .match({ subject: subjectID });

  if (error || !data) {
    console.error(error);
    return { data: null, error };
  }

  return {
    data: data.map((roomSubject) => ({
      id: roomSubject.classroom.id,
      number: roomSubject.classroom.number,
    })),
    error: null,
  };
}

export async function getSubjectList(
  classID: number
): Promise<{ data: SubjectListItem[]; error: PostgrestError | null }> {
  const { data, error } = await supabase
    .from<RoomSubjectDB>("room_subjects")
    .select("*, subject:subject(*), classroom:class(*)")
    .match({ class: classID });

  if (error || !data) {
    console.error(error);
    return { data: [], error };
  }

  return {
    data: await Promise.all(
      data.map(async (roomSubject) => await db2SubjectListItem(roomSubject))
    ),
    error: null,
  };
}
