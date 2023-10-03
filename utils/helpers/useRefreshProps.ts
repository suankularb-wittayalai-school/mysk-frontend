// Imports
import { useRouter } from "next/router";

/**
 * Creates a function that, when called, runs `getServerSideProps` again
 * without reloading or changing the scroll position of the page.
 *
 * @param options Additional options for the underlying `router.replace` fucntion.
 *
 * @returns A function.
 */
export default function useRefreshProps(
  options?: Parameters<typeof router.replace>[2],
) {
  const router = useRouter();
  return (callOptions?: Parameters<typeof router.replace>[2]) =>
    router.replace(router.asPath, undefined, {
      scroll: false,
      ...options,
      ...callOptions,
    });
}
