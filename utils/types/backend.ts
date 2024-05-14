import { Database } from "@/utils/types/supabase";
import { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import { FetchError } from "@/utils/types/fetch";

/** A Supabase client. */
export type DatabaseClient = SupabaseClient<
  Database,
  "public",
  Database["public"]
>;

/**
 * The return type of a database call.
 */
export type BackendReturn<
  Data = null,
  Error = Partial<PostgrestError | FetchError>,
> = { data: Data; error: null } | { data: null; error: Error };
