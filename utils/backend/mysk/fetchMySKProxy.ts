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
  // Serialize the request into JSON if provided data isn't an `ArrayBuffer`
  let body;
  let contentType;

  if (options?.body instanceof ArrayBuffer) {
    body = options.body;
    contentType = "octet-stream";
  } else {
    body = JSON.stringify({ options });
    contentType = "json";
  }

  // Fetch the data via the MySK API proxy
  const response = await fetch(`/api/mysk-api-proxy?path=${path}`, {
    method: "POST",
    headers: { "Content-Type": `application/${contentType}` },
    body,
  });

  // Log the fetch request while in development mode
  if (
    process.env.NODE_ENV === "development" &&
    !(options instanceof ArrayBuffer)
  )
    console.log(`[Fetch] ${options?.method || "GET"} to ${path}`);

  return response.json();
}
