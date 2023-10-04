import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { PersonLookupItem, UserRole } from "@/utils/types/person";
import { getStudentByID } from "./getStudentByID";
import { getTeacherByID } from "./getTeacherByID";
import logError from "@/utils/helpers/logError";

export async function getPersonForLookupDetail(
  supabase: DatabaseClient,
  id: string,
  role: UserRole,
): Promise<BackendReturn<PersonLookupItem>> {
  let person: PersonLookupItem | null = null;

  if (role == "student") {
    const { data, error } = await getStudentByID(supabase, id);
    if (error) {
      logError("getPersonForLookupList (student)", error);
      return { data: null, error };
    }
    person = data;
  } else if (role == "teacher") {
    const { data, error } = await getTeacherByID(supabase, id);
    if (error) {
      logError("getPersonForLookupList (teacher)", error);
      return { data: null, error };
    }
    person = data;
  }

  if (!person) {
    logError("getPersonForLookupList", { message: "Person not found." });
    return { data: null, error: { message: "Person not found." } };
  }

  return { data: person, error: null };
}
