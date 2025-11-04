import getCurrentAcademicYear from "@/utils/helpers/getCurrentAcademicYear";
import logError from "@/utils/helpers/logError";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";

export default async function getAdvisingClassroomID(
  supabase: DatabaseClient,
  teacherID: string,
): Promise<BackendReturn<string>> {
  const { data, error } = await supabase
    .from("classroom_advisors")
    .select("classroom_id, classrooms(id, year)")
    .eq("teacher_id", teacherID);
  if (error) {
    logError("getAdvisingClassroomID", error);
    return { data: null, error };
  }
  return {
    data: data.filter(
      (classroom) => classroom.classrooms?.year == getCurrentAcademicYear(),
    )[0].classroom_id,
    error: null,
  };
}
