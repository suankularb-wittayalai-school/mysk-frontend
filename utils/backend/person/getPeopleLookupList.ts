import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { PersonLookupItem, UserRole } from "@/utils/types/person";
import { logError } from "@/utils/helpers/debug";

export async function getPeopleLookupList(
  supabase: DatabaseClient,
  query?: string,
): Promise<BackendReturn<PersonLookupItem[]>> {
  let person: PersonLookupItem | null = null;

  return { data: [], error: null };
}
