import logError from "@/utils/helpers/logError";
import mergeDBLocales from "@/utils/helpers/mergeDBLocales";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { Contact } from "@/utils/types/contact";
import { Person, ShirtSize } from "@/utils/types/person";

export async function getPersonByID(
  supabase: DatabaseClient,
  personID: string,
  options?: Partial<{ includeContacts: boolean; detailed: boolean }>,
): Promise<BackendReturn<Person>> {
  let { data: personData, error: personError } = await supabase
    .from("people")
    .select("*")
    .eq("id", personID)
    .single();

  if (personError) {
    logError("getPersonByID (people)", personError);
    return { data: null, error: personError };
  }

  let contacts: Contact[] = [];

  if (options?.includeContacts) {
    let { data: personContactsData, error: personContactsError } =
      await supabase
        .from("person_contacts")
        .select("contact_id")
        .eq("person_id", personData!.id);

    if (personContactsError) {
      logError("getPersonByID (person_contacts)", personContactsError);
      return { data: null, error: personContactsError };
    }

    let contactIDs = personContactsData!.map((contact) => contact.contact_id);

    let { data: contactsData, error: contactsError } = await supabase
      .from("contacts")
      .select("*")
      .in("id", contactIDs);

    if (contactsError) {
      logError("getPersonByID (contacts)", contactsError);
      return { data: null, error: contactsError };
    }

    contacts = contactsData!.map((contact) => {
      return {
        id: contact.id,
        type: contact.type,
        value: contact.value,
        name: {
          th: contact.name_th ?? "",
          "en-US": contact.name_en ?? null,
        },
        include_students: contact.include_students,
        include_teachers: contact.include_teachers,
        include_parents: contact.include_parents,
      };
    });
  }

  let allergies: string[] = [];

  if (options?.detailed) {
    let { data: allergiesData, error: allergiesError } = await supabase
      .from("person_allergies")
      .select("allergy_name")
      .eq("person_id", personData!.id);

    if (allergiesError) {
      logError("getPersonByID (allergies)", allergiesError);
      return { data: null, error: allergiesError };
    }

    allergies = allergiesData!.map((allergy) => allergy.allergy_name);
  }

  return {
    data: {
      id: personData!.id,
      prefix: mergeDBLocales(personData, "prefix"),
      first_name: mergeDBLocales(personData, "first_name"),
      last_name: mergeDBLocales(personData, "last_name"),
      middle_name: mergeDBLocales(personData, "middle_name"),
      nickname: mergeDBLocales(personData, "nickname"),
      birthdate: personData!.birthdate,
      contacts: contacts,
      profile: personData!.profile,
      profile_url: personData!.profile,
      citizen_id: options?.detailed ? personData!.citizen_id : null,
      shirt_size:
        options?.detailed && personData?.shirt_size
          ? {
              XS: ShirtSize.XS,
              S: ShirtSize.S,
              M: ShirtSize.M,
              L: ShirtSize.L,
              XL: ShirtSize.XL,
              "2XL": ShirtSize.twoXL,
              "3XL": ShirtSize.threeXL,
              "4XL": ShirtSize.fourXL,
              "5XL": ShirtSize.fiveXL,
              "6XL": ShirtSize.sixXL,
            }[personData.shirt_size]
          : null,
      pants_size: options?.detailed ? personData!.pants_size : null,
      allergies: options?.detailed ? allergies : [],
      is_admin: null,
    },
    error: null,
  };
}
