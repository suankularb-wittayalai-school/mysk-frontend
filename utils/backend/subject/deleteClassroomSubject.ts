import { BackendReturn, DatabaseClient } from "@/utils/types/backend";

export default async function deleteClassroomSubject(
  supabase: DatabaseClient,
  classroomSubjectID: string,
): Promise<BackendReturn<null>> {
  const { error } = await supabase
    .from("classroom_subjects")
    .delete()
    .eq("id", classroomSubjectID);

  return { data: null, error };
}
