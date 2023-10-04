import logError from "@/utils/helpers/logError";
import { DatabaseClient, BackendReturn } from "@/utils/types/backend";
import { Contact } from "@/utils/types/contact";

export default async function createContact(
  supabase: DatabaseClient,
  contact: Contact,
): Promise<BackendReturn<string>> {
  const { data, error } = await supabase
    .from("contacts")
    .insert({
      name_th: contact.name?.th,
      name_en: contact.name ? contact.name["en-US"] : "",
      type: contact.type,
      value: contact.value,
      include_parents: contact.include_parents,
      include_students: contact.include_students,
      include_teachers: contact.include_teachers,
    })
    .select("*")
    .limit(1)
    .order("id")
    .single();

  if (error) {
    logError("createContact", error);
    return { error: error, data: null };
  }

  return { error: null, data: data.id };
}
