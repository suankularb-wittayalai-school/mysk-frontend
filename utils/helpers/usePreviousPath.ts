// Imports
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";

/**
 * Get the route of the previous page the user was in. This only tracks pages
 * inside this app, and doesn’t include external pages.
 *
 * @returns `previousPath` — The path name of the previous in-app page the user was in.
 */
export default function usePreviousPath() {
  // Note: directly copied from https://stackoverflow.com/a/73326889/10462121.
  // Such is the life of a developer!
  const { asPath } = useRouter();
  const ref = useRef<string | null>(null);

  useEffect(() => {
    ref.current = asPath;
  }, [asPath]);

  return { previousPath: ref.current };
}
