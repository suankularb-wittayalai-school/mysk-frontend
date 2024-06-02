import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

// See: https://serwist.pages.dev/docs/next/getting-started#writing-a-sw

// This declares the value of `injectionPoint` to TypeScript.
// `injectionPoint` is the string that will be replaced by the actual precache
// manifest. By default, this string is set to `"self.__SW_MANIFEST"`.
declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
  // See: https://github.com/serwist/serwist/issues/64#issuecomment-1925393349
  fallbacks: {
    entries: [
      {
        url: "/_offline",
        matcher: ({ request }) => request.destination === "document",
      },
    ],
  },
});
serwist.addToPrecacheList([{ url: "/_offline" }]);

serwist.addEventListeners();
