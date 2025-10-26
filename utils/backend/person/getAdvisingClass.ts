import getCurrentAcademicYear from "@/utils/helpers/getCurrentAcademicYear";
import logError from "@/utils/helpers/logError";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";

export default async function getAdvisingClass(
  supabase: DatabaseClient,
  teacherID: string,
): Promise<BackendReturn<string>> {
  let { data, error } = await supabase
    .from("classroom_advisors")
    .select("classroom_id, classrooms(id, year)")
    .eq("teacher_id", teacherID)
    .eq("classrooms.year", getCurrentAcademicYear())
    .limit(1)
    .single();
  if (error) {
    logError("getAdvisingClass", error);
    return { data: null, error };
  }
  return { data: data!.classroom_id, error: null };
}
