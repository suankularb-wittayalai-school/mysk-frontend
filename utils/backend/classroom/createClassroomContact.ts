import createContact from "@/utils/backend/contact/createContact";
import logError from "@/utils/helpers/logError";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { Contact } from "@/utils/types/contact";

export default async function createClassroomContact(
  supabase: DatabaseClient,
  contact: Contact,
  classroomID: string,
): Promise<BackendReturn> {
  const { data, error: createError } = await createContact(supabase, contact);
  if (createError) {
    logError("createClassroomContact (create)", createError);
    return { data: null, error: createError };
  }

  const { error: linkError } = await supabase
    .from("classroom_contacts")
    .insert({ classroom_id: classroomID, contact_id: data });
  if (linkError) logError("createClassroomContact (link)", linkError);

  return { data: null, error: linkError };
}
