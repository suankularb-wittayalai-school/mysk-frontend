import fetchMySKProxy from "@/utils/backend/mysk/fetchMySKProxy";
import { FetchReturn, Query } from "@/utils/types/fetch";

/**
 * A hook to use the MySK client.
 *
 * @returns The MySK client.
 *
 * @example
 * ```ts
 * const mysk = useMySKClient();
 * const { data, error } = await mysk.fetch("/health-check");
 * ```
 */
export default function useMySKClient() {
  return {
    /**
     * Fetches data via the MySK API proxy.
     *
     * @param path The path to make the fetch request to.
     * @param options `fetch` options and query parameters.
     *
     * @returns The response from the API.
     */
    fetch: async <Data extends {} | unknown = unknown>(
      path: string,
      options?: Partial<RequestInit & { query: Query }>,
    ): Promise<FetchReturn<Data>> => await fetchMySKProxy<Data>(path, options),
  };
}
