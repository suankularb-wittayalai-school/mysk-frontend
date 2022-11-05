// Supabase
import { supabase } from "@utils/supabase-client";

// Types
import { BackendDataReturn } from "@utils/types/common";
import { Contact } from "@utils/types/contact";
import { Database } from "@utils/types/supabase";

export async function createContact(
  contact: Contact
): Promise<
  BackendDataReturn<Database["public"]["Tables"]["contact"]["Row"], null>
> {
  const { data: createdContact, error: contactCreationError } = await supabase
    .from("contact")
    .insert({
      type: contact.type,
      value: contact.value,
      name_en: contact.name["en-US"],
      name_th: contact.name.th,
      include_students: contact.includes?.students,
      include_parents: contact.includes?.parents,
      include_teachers: contact.includes?.teachers,
    })
    .select("*")
    .single();

  if (contactCreationError) {
    console.error(contactCreationError);
    return { data: null, error: contactCreationError };
  }
  return { data: createdContact!, error: null };
}

export async function updateContact(
  contact: Contact
): Promise<
  BackendDataReturn<Database["public"]["Tables"]["contact"]["Row"], null>
> {
  const { data: updatedContact, error: contactUpdateError } = await supabase
    .from("contact")
    .update({
      type: contact.type,
      value: contact.value,
      name_en: contact.name["en-US"],
      name_th: contact.name.th,
      include_students: contact.includes?.students,
      include_parents: contact.includes?.parents,
      include_teachers: contact.includes?.teachers,
    })
    .match({ id: contact.id })
    .select("*")
    .single();

  if (contactUpdateError) {
    console.error(contactUpdateError);
    return { data: null, error: contactUpdateError };
  }
  return { data: updatedContact!, error: null };
}
