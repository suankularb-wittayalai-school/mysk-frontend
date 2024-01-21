import logError from "@/utils/helpers/logError";
import mergeDBLocales from "@/utils/helpers/mergeDBLocales";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { Contact } from "@/utils/types/contact";

export default async function getContactsOfPerson(
  supabase: DatabaseClient,
  personID: string,
): Promise<BackendReturn<Contact[]>> {
  const { data, error } = await supabase
    .from("person_contacts")
    .select(
      `contacts(
        id,
        name_th,
        name_en,
        type,
        value,
        include_parents,
        include_students,
        include_teachers
      )`,
    )
    .eq("person_id", personID);

  if (error) {
    logError("getContactsOfPerson", error);
    return { data: null, error };
  }

  const contacts = data.map(({ contacts }) => ({
    id: contacts!.id,
    name: mergeDBLocales(contacts, "name"),
    type: contacts!.type,
    value: contacts!.value,
    include_students: contacts!.include_students,
    include_teachers: contacts!.include_teachers,
    include_parents: contacts!.include_parents,
  }));

  return { data: contacts, error: null };
}
