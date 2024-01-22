/**
 * Prefixes the path with the locale if it’s not the default locale. Useful when
 * redirecting in `getServerSideProps`.
 *
 * @param path The path to prefix.
 * @param locale The locale to prefix with.
 *
 * @returns The prefixed path.
 */
export default function prefixLocale(path: string, locale?: string) {
  return (locale === "th" ? "" : "/en-US") + path;
}
