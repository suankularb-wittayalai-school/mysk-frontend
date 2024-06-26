import { Student, Teacher, User } from "@/utils/types/person";

/**
 * A client for fetching data from the MySK API.
 */
export type MySKClient = {
  /**
   * Fetches data via the MySK API (via the proxy if client-side).
   *
   * @param path The path to make the fetch request to.
   * @param options `fetch` options and query parameters.
   *
   * @returns The response from the API.
   */
  fetch: <Data extends {} | unknown = unknown>(
    path: string,
    options?: Partial<RequestInit & { query: Query }>,
  ) => Promise<FetchReturn<Data>>;

  /** The currently loggedin user. */
  user: User | null;

  /** The currently logged in Student or Teacher, if they are one. */
  person: Student | Teacher | null;
};

/**
 * The level of detail for fetching data.
 *
 * - `id_only`: Only the ID.
 * - `compact`: Compact representation for lists.
 * - `default`: Most details needed.
 * - `detailed`: Includes all details and relationships.
 */
export type FetchLevel = "id_only" | "compact" | "default" | "detailed";

/**
 * Configuration for filtering data.
 */
export type FilterConfig<Data extends {} | unknown = unknown> = Partial<{
  data: Data;
  q: string;
}>;

/**
 * Configuration for sorting data.
 */
export type SortingConfig<Data extends {} | unknown = unknown> = {
  by: Data[];
  ascending?: boolean;
};

/**
 * Configuration for paginating data.
 */
export type PaginationConfig = {
  p: number;
  size?: number;
};

/**
 * Queries for fetching data.
 */
export type Query<Data extends {} | unknown = unknown> = {
  pagination?: PaginationConfig;
  filter?: FilterConfig<Data>;
  sort?: SortingConfig<Data>;
  fetch_level?: FetchLevel;
  descendant_fetch_level?: FetchLevel;
};

/**
 * The response data from `/auth/oauth/google`, used to set authentication
 * cookies.
 */
export type OAuthResponseData = {
  access_token: string;
  expires_in: number;
  id_token: string;
  scope: string;
  token_type: string;
};

/**
 * A data object with only an ID.
 */
export type IDOnly = { id: string };

/**
 * An error object from a fetch request.
 */
export type FetchError = {
  code: number;
  error_type: string;
  detail: string;
  source: string;
};

/**
 * A response from a fetch request.
 */
export type FetchReturn<Data extends {} | unknown = unknown> = {
  api_version: string | null;
  meta: { timestamp: string; pagination: null } | null;
} & ({ data: Data; error: null } | { data: null; error: Partial<FetchError> });
