// External libraries
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

/**
 * Get the route of the previous page the user was in. This only tracks pages
 * inside this app, and doesn’t include external pages.
 *
 * @returns `previousPath` — The path name of the previous in-app page the user was in.
 */
export function usePreviousPath() {
  // Note: directly copied from https://stackoverflow.com/a/73326889/10462121.
  // Such is the life of a developer!

  const { asPath } = useRouter();
  const ref = useRef<string | null>(null);

  useEffect(() => {
    ref.current = asPath;
  }, [asPath]);

  return { previousPath: ref.current };
}

/**
 * Watches for page load.
 *
 * @returns `pageIsLoading` — A boolean representing if a new page is being loaded or not.
 */
export function usePageIsLoading() {
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

type PageRelation = "parent" | "child" | "sibling" | "unrelated";

/**
 * Get how the destination page relate to the current page. This is useful for
 * creating a spatially coherent system of page transitions.
 *
 * @see {@link https://docs.google.com/document/d/1UJeTpXcB2MBL9Df4GUUeZ78xb-RshNIC_-LCIKmCo-8/edit?usp=sharing#heading=h.ix1wxffbs2kc Documention on transitionEvent with Root Layout}
 *
 * @param parentURL The URL of the parent page of the current.
 * @param childURLs A list of child URLs of the current page.
 *
 * @returns `transitionEvent` — How the destination page relates to the current.
 */
export function useTransitionEvent(parentURL?: string, childURLs?: string[]) {
  const router = useRouter();

  // Destination page relation
  const [destination, setDestination] = useState<string>();
  useEffect(() => {
    const handlePageChange = (url: string) => {
      window.scrollTo(0, 0);
      setDestination(url);
    };
    router.events.on("routeChangeStart", handlePageChange);
    return () => {
      router.events.off("routeChangeStart", handlePageChange);
    };
  }, []);

  const [transitionEvent, setTransitionEvent] = useState<PageRelation>();
  useEffect(() => {
    if (!destination) return;
    setTransitionEvent(
      parentURL === destination
        ? "parent"
        : childURLs?.includes(destination)
        ? "child"
        : "unrelated"
    );
  }, [destination]);

  return { transitionEvent };
}
