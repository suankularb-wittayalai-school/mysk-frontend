import { FetchReturn, Query } from "@/utils/types/fetch";
import qs from "qs";
import { sift } from "radash";

/**
 * Fetches data from the MySK API.
 *
 * @param path The path to make the fetch request to.
 * @param accessToken The access token cookie.
 * @param options `fetch` options and query parameters.
 *
 * @returns The response from the API.
 *
 * @private Use `useMySKClient` or `createMySKClient` instead.
 */
export default async function fetchMySKAPI<Data extends {} | unknown = unknown>(
  path: string,
  accessToken?: string,
  options?: Partial<RequestInit & { query: Query }>,
): Promise<FetchReturn<Data> & { status: number }> {
  /**
   * The path to make the fetch request to.
   */
  const source = sift([
    process.env.NEXT_PUBLIC_MYSK_API_URL,
    path,
    options?.query && "?",
    qs.stringify(options?.query, { encode: false }),
  ]).join("");

  /**
   * The original reponse from the API.
   */
  const response = await fetch(source, {
    ...options,
    headers: {
      "X-API-KEY": process.env.MYSK_API_KEY,
      ...options?.headers,
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    },
  });

  // Log the fetch request while in development mode
  if (process.env.NODE_ENV === "development")
    console.log(
      typeof window !== "undefined"
        ? `[Fetch] ${options?.method || "GET"} to ${source}`
        : `\x1b[0m- \x1b[35mevent\x1b[0m [${
            options?.method || "GET"
          }] ${source}`,
    );

  // If the response was successful with no error, return the JSON version of the
  // response
  if (response.ok) return { ...response.json(), status: response.status };

  // Otherwise, parse the response into an error object
  return {
    api_version: "0.1.0",
    data: null,
    error: {
      code: response.status,
      detail: await response.text(),
      error_type: "APIError",
      source,
    },
    meta: null,
    status: response.status,
  };
}
