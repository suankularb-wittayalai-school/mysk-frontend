import fetchMySKProxy from "@/utils/backend/mysk/fetchMySKProxy";
import { FetchReturn, MySKClient, Query } from "@/utils/types/fetch";

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
export default function useMySKClient(): MySKClient {
  return {
    fetch: async (path, options) => await fetchMySKProxy(path, options),
    user: null,
  };
}
