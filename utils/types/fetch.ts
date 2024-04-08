export type FetchLevel = "id_only" | "compact" | "default" | "detailed";

export type FilterConfig<Data extends {} | unknown = unknown> = Partial<{
  data: Data;
  q: string;
}>;

export type SortingConfig<Data extends {} | unknown = unknown> = {
  by: Data[];
  ascending?: boolean;
};

export type PaginationConfig = {
  p: number;
  size?: number;
};

export type Query<Data extends {} | unknown = unknown> = {
  pagination?: PaginationConfig;
  filter?: FilterConfig<Data>;
  sorting?: SortingConfig<Data>;
  fetch_level?: FetchLevel;
  descendant_fetch_level?: FetchLevel;
};

export type FetchError = {
  code: number;
  error_type: string;
  detail: string;
  source: string;
};

export type FetchReturn<Data extends {} | unknown = unknown> = {
  api_version: string;
  meta: { timestamp: string; pagination: null } | null;
} & ({ data: Data; error: null } | { data: null; error: FetchError });
