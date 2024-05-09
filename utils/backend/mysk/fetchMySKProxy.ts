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
  options?: Partial<RequestInit & { query: Query }>,
): Promise<FetchReturn<Data>> {
  // Fetch the data via the MySK API proxy
  const response = await fetch("/api/mysk-api-proxy", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path, options }),
  });

  // Log the fetch request while in development mode
  if (process.env.NODE_ENV === "development")
    console.log(`[Fetch] ${options?.method || "GET"} to ${path}`);

  return response.json();
}
