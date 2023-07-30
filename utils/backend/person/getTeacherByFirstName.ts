// Imports
import { logError } from "@/utils/helpers/debug";
import { mergeDBLocales } from "@/utils/helpers/string";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { Teacher } from "@/utils/types/person";

export default async function getTeachersByFirstName(
  supabase: DatabaseClient,
  firstName: string,
): Promise<
  BackendReturn<Pick<Teacher, "id" | "first_name" | "last_name" | "profile">[]>
> {
  const { data, error } = await supabase
    .from("teachers")
    .select(
      `id,
      people(
        first_name_th,
        first_name_en,
        last_name_th,
        last_name_en,
        profile
      )`,
    )
    .eq("people.first_name_th", firstName);
  // .or(
  //   `people.first_name_th.eq.${firstName},people.first_name_en.ilike.${firstName}`,
  // );

  if (error) {
    logError("getTeachersByFirstName", error);
    return { data: null, error };
  }

  return {
    data: data!.map((teacher) => ({
      id: teacher.id,
      first_name: mergeDBLocales(teacher.people, "first_name"),
      last_name: mergeDBLocales(teacher.people, "last_name"),
      profile: teacher.people!.profile,
    })),
    error: null,
  };
}
