import logError from "@/utils/helpers/logError";
import { HomeroomContent } from "@/utils/types/attendance";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { omit } from "radash";

/**
 * Records the Homeroom Content of a Classroom.
 *
 * @param supabase The Supabase client to use.
 * @param homeroomContent The Homeroom Content to be saved.
 * @param classroomID The ID of the Classroom to save the Homeroom Content of.
 *
 * @returns An empty Backend Return.
 */
export default async function recordHomeroom(
  supabase: DatabaseClient,
  homeroomContent: HomeroomContent,
  classroomID: string,
): Promise<BackendReturn> {
  const { error } = await supabase.from("classroom_homeroom_contents").upsert({
    // Include the ID if available for upserting.
    ...(homeroomContent.id ? { id: homeroomContent.id } : {}),
    ...omit(homeroomContent, ["id"]),
    classroom_id: classroomID,
  });

  if (error) logError("recordHomeroom", error);
  return { data: null, error };
}
