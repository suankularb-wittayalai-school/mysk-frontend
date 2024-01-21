import logError from "@/utils/helpers/logError";
import { DatabaseClient, BackendReturn } from "@/utils/types/backend";

export default async function addContactToPerson(
  supabase: DatabaseClient,
  contactID: string,
  personID: string,
): Promise<BackendReturn> {
  const { error } = await supabase
    .from("person_contacts")
    .insert({ person_id: personID, contact_id: contactID });
  if (error) logError("assignContactToPerson", error);
  return { error, data: null };
}
