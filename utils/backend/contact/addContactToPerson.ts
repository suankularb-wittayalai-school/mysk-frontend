import { logError } from "@/utils/helpers/debug";
import { DatabaseClient, BackendReturn } from "@/utils/types/backend";
import { Contact } from "@/utils/types/contact";
import { Student, Teacher } from "@/utils/types/person";

export default async function addContactToPerson(
  supabase: DatabaseClient,
  person: Student | Teacher,
  contactID: string,
): Promise<BackendReturn<string>> {
  let personID: string | null = null;

  if (person.role === "student") {
    const { data, error } = await supabase
      .from("students")
      .select("person_id")
      .eq("id", person.id)
      .single();

    if (error) {
      logError("addContactToPerson (student)", error);
    }

    personID = data!.person_id;
  } else if (person.role === "teacher") {
    const { data, error } = await supabase
      .from("teachers")
      .select("person_id")
      .eq("id", person.id)
      .single();

    if (error) {
      logError("addContactToPerson (teacher)", error);
    }

    personID = data!.person_id;
  }

  //   console.log({ personID, person });

  if (!personID) {
    logError("addContactToPerson", { message: "No person ID found" });
    return { error: { message: "No person ID found" }, data: null };
  }

  const { data, error } = await supabase
    .from("person_contacts")
    .insert({
      person_id: personID,
      contact_id: contactID,
    })
    .select("id")
    .single();

  if (error) {
    logError("addContactToPerson (person_contacts)", error);
    return { error: error, data: null };
  }

  return { error: null, data: data.id };
}
