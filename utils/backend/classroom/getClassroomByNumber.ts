import { getCurrentAcademicYear } from "@/utils/helpers/date";
import { logError } from "@/utils/helpers/debug";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { Classroom } from "@/utils/types/classroom";

export default async function getClassroomByNumber(
  supabase: DatabaseClient,
  number: number,
): Promise<BackendReturn<Pick<Classroom, "id" | "number">>> {
  const { data, error } = await supabase
    .from("classrooms")
    .select("id, number")
    .eq("number", number)
    .eq("year", getCurrentAcademicYear())
    .limit(1)
    .order("id")
    .single();

  if (error) {
    logError("getClassroomByNumber", error);
    return { data: null, error };
  }

  return { data, error: null };
}
