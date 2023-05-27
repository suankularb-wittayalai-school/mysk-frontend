// External libraries
import { PostgrestError } from "@supabase/supabase-js";

/**
 * Logs an error in a more human readable way.
 *
 * @param location Identifies the location of an error, like a function or page name.
 * @param error A `PostgrestError`.
 * @param clientSide If the error happened client-side.
 *
 * @todo This is an experiment at the moment; if others like it then we’ll implement it for all fetches.
 */
export function logError(location: string, error: Partial<PostgrestError>) {
  console.error(
    [
      // Header
      typeof window === "undefined"
        ? `\x1b[0m- \x1b[31merror\x1b[0man error occurred at \x1b[33m${location}\x1b[0m`
        : `\x1b[0m[Fetch error]`,

      // Content
      error.message,
      error.details,
      error.hint && `hint: ${error.hint}`,
    ]
      .filter((segment) => segment)
      .join("\n    ")
  );
}
