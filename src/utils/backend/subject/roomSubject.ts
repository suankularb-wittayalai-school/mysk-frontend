import { PostgrestError } from "@supabase/supabase-js";
import { supabase } from "@utils/supabaseClient";
import { ClassWNumber } from "@utils/types/class";
import { RoomSubjectDB } from "@utils/types/database/subject";

export async function getRoomsEnrolledInSubject(
  subjectID: number
): Promise<{ data: ClassWNumber[] | null; error: PostgrestError | null }> {
  const { data, error } = await supabase
    .from<RoomSubjectDB>("RoomSubject")
    .select("classroom:class(id, number)")
    .match({ subject: subjectID });

  if (error) {
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
