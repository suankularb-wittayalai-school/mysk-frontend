// Imports
import logError from "@/utils/helpers/logError";
import mergeDBLocales from "@/utils/helpers/mergeDBLocales";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { Teacher } from "@/utils/types/person";

export default async function getTeachersByFirstName(
  supabase: DatabaseClient,
  firstName: string,
): Promise<
  BackendReturn<Pick<Teacher, "id" | "first_name" | "last_name" | "profile">[]>
> {
  const { data, error } = await supabase
    .from("people")
    .select(
      `first_name_th,
      first_name_en,
      last_name_th,
      last_name_en,
      profile,
      teachers!inner(id)`,
    )
    .or(`first_name_th.ilike.${firstName},first_name_en.ilike.${firstName}`);

  if (error) {
    logError("getTeachersByFirstName", error);
    return { data: null, error };
  }

  return {
    data: data!.map((person) => ({
      id: person.teachers[0].id,
      first_name: mergeDBLocales(person, "first_name"),
      last_name: mergeDBLocales(person, "last_name"),
      profile: person.profile,
    })),
    error: null,
  };
}
