import getCurrentAcademicYear from "@/utils/helpers/getCurrentAcademicYear";
import logError from "@/utils/helpers/logError";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { Classroom } from "@/utils/types/classroom";

/**
 * Fetch all Classrooms in the current (or specified) academic year.
 *
 * @param supabase The Supabase client to use.
 * @param options Options.
 * @param options.year The academic year to fetch Classrooms from.
 *
 * @returns A Backend Return of an array of Classrooms.
 */
export default async function getClassrooms(
  supabase: DatabaseClient,
  options?: Partial<{ year: number }>,
): Promise<BackendReturn<Pick<Classroom, "id" | "number" | "main_room">[]>> {
  const query = supabase
    .from("classrooms")
    .select(`id, number, main_room`)
    .order("number")
    .eq("year", options?.year || getCurrentAcademicYear());

  // Exclude test Classrooms in production.
  if (process.env.NODE_ENV !== "development") query.lt("number", 900);

  const { data, error } = await query;

  if (error) {
    logError("getClassrooms", error);
    return { data: null, error };
  }

  return { data, error: null };
}
