import { FetchReturn, Query } from "@/utils/types/fetch";

/**
 * Fetches data via the MySK API proxy.
 *
 * @param path The path to make the fetch request to.
 * @param options `fetch` options and query parameters.
 *
 * @returns The response from the API.
 *
 * @private Use `useMySKClient` instead.
 */
export default async function fetchMySKProxy<
  Data extends {} | unknown = unknown,
>(
  path: string,
  options?: Partial<{ query: Query; headers: HeadersInit }>,
): Promise<FetchReturn<Data>> {
  // Fetch the data via the MySK API proxy
  const response = await fetch("/api/mysk-api-proxy", {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      path,
      query: options?.query,
      headers: options?.headers,
    }),
  });

  // If the response was successful with no error, return the JSON version of the
  // response
  if (response.ok) return response.json();

  // Otherwise, parse the response into an error object
  return {
    api_version: "0.1.0",
    data: null,
    error: {
      code: response.status,
      detail: await response.text(),
      error_type: "APIError",
      source: "/api/mysk-api-proxy",
    },
    meta: null,
  };
}
