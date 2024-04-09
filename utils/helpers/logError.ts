import { FetchError } from "@/utils/types/fetch";
import { PostgrestError } from "@supabase/supabase-js";
import { sift } from "radash";

/**
 * Logs an error in a more human readable way.
 *
 * @param location Identifies the location of an error, like a function or page name.
 * @param error A `PostgrestError` or `FetchError` object.
 */
export default function logError(
  location: string,
  error: Partial<PostgrestError | FetchError>,
) {
  // If the error is from Supabase, normalize the error object into
  // `FetchError`. Otherwise, use the error object as is.
  const fetchError = Object.keys(error).includes("hint")
    ? // Supabase error
      {
        code: error.code,
        error_type: (error as Partial<PostgrestError>).message,
        detail: (error as Partial<PostgrestError>).details,
      }
    : // MySK API error
      (error as Partial<FetchError>);

  // Log the error.
  console.error(
    sift([
      // Header
      typeof window === "undefined"
        ? `\u001b[1m\x1b[31m ⨯\x1b[0m\u001b[0m An error occurred at \x1b[33m${location}\x1b[0m`
        : `[Error]`,

      // Content
      typeof window !== "undefined" && `Error occured at ${location}`,
      `${fetchError.code}: ${fetchError.error_type}`,
      fetchError.detail,
    ]).join("\n    "),
  );
}
