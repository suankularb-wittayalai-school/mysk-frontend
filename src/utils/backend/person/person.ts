import { PostgrestError } from "@supabase/supabase-js";
import { supabase } from "@utils/supabaseClient";
import { PersonTable } from "@utils/types/database/person";
import { Person } from "@utils/types/person";
import { createContact } from "../contact";

const prefixMap = {
  Master: "เด็กชาย",
  "Mr.": "นาย",
  "Mrs.": "นาง",
  "Miss.": "นางสาว",
};

export async function createPerson(
  person: Person
): Promise<{ data: PersonTable[] | null; error: PostgrestError | null }> {
  // create contacts
  const contacts = await Promise.all(
    person.contacts.map(async (contact) => await createContact(contact))
  );

  // check if any contact creation failed
  if (contacts.some((contact) => contact.error)) {
    const error = contacts.find((contact) => contact.error)?.error;
    if (error) {
      console.error(error);
      return { data: null, error };
    } else {
      throw new Error("Unknown error");
    }
  }

  // map the created contact to id
  const contactIds = contacts
    .map((contact) => contact.data?.[0]?.id)
    .filter((id) => id !== undefined || id !== null);

  const { data: createdPerson, error: personCreationError } = await supabase
    .from<PersonTable>("people")
    .insert({
      prefix_th: prefixMap[person.prefix as keyof typeof prefixMap] as
        | "นาย"
        | "นาง"
        | "นางสาว"
        | "เด็กชาย",
      prefix_en: person.prefix as "Mr." | "Mrs." | "Miss." | "Master",
      first_name_th: person.name.th.firstName,
      middle_name_th: person.name.th.middleName,
      last_name_th: person.name.th.lastName,
      first_name_en: person.name["en-US"]?.firstName,
      middle_name_en: person.name["en-US"]?.middleName,
      last_name_en: person.name["en-US"]?.lastName,
      birthdate: person.birthdate,
      citizen_id: person.citizenID,
      contacts: contactIds as number[],
    });
  if (personCreationError || !person) {
    console.error(personCreationError);
    return { data: null, error: personCreationError };
  }
  return { data: createdPerson, error: null };
}
