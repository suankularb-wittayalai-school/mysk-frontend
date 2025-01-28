import { FetchReturn, Query } from "@/utils/types/fetch";
import qs from "qs";
import { sift } from "radash";
import { Readable } from "stream";

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
   * The path to make the fetch request to (without the base).
   */
  const source = sift([
    path,
    options?.query && "?",
    qs.stringify(options?.query, { encode: false }),
  ]).join("");

  /**
   * The original response from the API.
   */
  const response = await fetch(process.env.NEXT_PUBLIC_MYSK_API_URL + source, {
    ...options,
    headers: {
      "X-API-KEY": process.env.MYSK_API_KEY,
      ...options?.headers,
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    },
    // @ts-ignore: see https://github.com/nodejs/node/issues/46221 for context
    duplex: typeof options?.body === "object" ? "half" : undefined,
  });

  // Log the fetch request while in development mode
  if (process.env.NODE_ENV === "development")
    console.log(
      [
        "",
        options?.method || "GET",
        `\x1b[90m` + process.env.NEXT_PUBLIC_MYSK_API_URL + `\x1b[0m` + source,
        (response.ok ? `\x1b[32m` : `\x1b[33m`) + response.status + `\x1b[0m`,
      ].join(" "),
    );

  // Check if the response is JSON, and return the data if it is.
  if (response.headers.get("content-type")?.includes("application/json"))
    return { ...(await response.json()), status: response.status };

  // Otherwise, return the text as an error.
  return {
    api_version: null,
    data: null,
    error: { detail: await response.text() },
    meta: null,
    status: response.status,
  };
}
