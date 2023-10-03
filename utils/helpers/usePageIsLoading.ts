// Imports
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

/**
 * Watches for page load.
 *
 * @returns `pageIsLoading` — A boolean representing if a new page is being loaded or not.
 */
export default function usePageIsLoading() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    router.events.on("routeChangeStart", () => setLoading(true));
    router.events.on("routeChangeComplete", () => setLoading(false));
    router.events.on("routeChangeError", () => setLoading(false));

    return () => {
      router.events.off("routeChangeStart", () => setLoading(true));
      router.events.off("routeChangeComplete", () => setLoading(false));
      router.events.off("routeChangeError", () => setLoading(false));
    };
  });

  return { pageIsLoading: loading };
}
