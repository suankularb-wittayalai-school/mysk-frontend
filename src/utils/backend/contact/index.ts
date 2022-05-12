import { PostgrestError } from "@supabase/supabase-js";
import { Contact } from "@utils/types/contact";
import { ContactDB } from "@utils/types/database/contact";
import { supabase } from "@utils/supabaseClient";

export async function createContact(
  contact: Contact
): Promise<{ data: ContactDB[] | null; error: PostgrestError | null }> {
  const { data: createdContact, error: contactCreationError } = await supabase
    .from<ContactDB>("contact")
    .insert({
      type: contact.type,
      value: contact.value,
      name_en: contact.name["en-US"],
      name_th: contact.name.th,
      include_students: contact.includes?.students,
      include_parents: contact.includes?.parents,
      include_teachers: contact.includes?.teachers,
    });
  if (contactCreationError || !contact) {
    console.error(contactCreationError);
    return { data: null, error: contactCreationError };
  }
  return { data: createdContact, error: null };
}

export async function updateContact(
  contact: Contact
): Promise<{ data: ContactDB[] | null; error: PostgrestError | null }> {
  const { data: updatedContact, error: contactUpdateError } = await supabase
    .from<ContactDB>("contact")
    .update({
      type: contact.type,
      value: contact.value,
      name_en: contact.name["en-US"],
      name_th: contact.name.th,
      include_students: contact.includes?.students,
      include_parents: contact.includes?.parents,
      include_teachers: contact.includes?.teachers,
    })
    .match({ id: contact.id });
  if (contactUpdateError || !updatedContact) {
    console.error(contactUpdateError);
    return { data: null, error: contactUpdateError };
  }
  return { data: updatedContact, error: null };
}
