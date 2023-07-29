import { Database } from "@/utils/types/supabase";
import { PostgrestError, SupabaseClient } from "@supabase/supabase-js";

/** A Supabase client. */
export type DatabaseClient = SupabaseClient<
  Database,
  "public",
  Database["public"]
>;

/**
 * The return type of a database call.
 */
export type BackendReturn<Data = null, Error = Partial<PostgrestError>> =
  | { data: Data; error: null }
  | { data: null; error: Error };
