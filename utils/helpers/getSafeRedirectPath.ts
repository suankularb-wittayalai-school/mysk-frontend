/**
 * Returns a redirect path from a query string, but only if it is safe:
 * a same-origin path with no protocol, protocol-relative prefix, or
 * whitespace.
 *
 * @param redirect The value of a `redirect` query parameter.
 *
 * @returns The safe redirect path, or `null` if the path is not safe.
 */
export default function getSafeRedirectPath(redirect: unknown): string | null {
  if (typeof redirect !== "string") return null;
  if (!redirect.startsWith("/") || redirect.startsWith("//")) return null;
  if (redirect.includes("://") || /[\s\r\n]/.test(redirect)) return null;
  return redirect;
}
