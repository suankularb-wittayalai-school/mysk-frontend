// External libraries
import { PostgrestError } from "@supabase/supabase-js";

/**
 * Logs an error in a more human readable way.
 *
 * @param location Identifies the location of an error, like a function or page name.
 * @param error A `PostgrestError`.
 * @param clientSide If the error happened client-side.
 */
export default function logError(location: string, error: Partial<PostgrestError>) {
  console.error(
    [
      // Header
      typeof window === "undefined"
        ? `\u001b[1m\x1b[31m ⨯\x1b[0m\u001b[0m An error occurred at \x1b[33m${location}\x1b[0m`
        : `\x1b[0m[Error]`,

      // Content
      typeof window !== "undefined" && `Error occured at ${location}`,
      error.message,
      error.details,
      error.hint && `hint: ${error.hint}`,
    ]
      .filter((segment) => segment)
      .join("\n    "),
  );
}
