// External libraries
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";

import { Analytics } from "@vercel/analytics/react";

import { MotionConfig } from "framer-motion";

import {
  Fira_Code,
  IBM_Plex_Sans_Thai,
  Inter,
  Sarabun,
  Space_Grotesk,
} from "next/font/google";

import { appWithTranslation } from "next-i18next";

import { FC, ReactNode, useState } from "react";

// SK Components
import { ThemeProvider } from "@suankularb-components/react";

// Internal components
import Layout from "@/components/Layout";
import ErrorBoundary from "@/components/error/ErrorBoundary";
import PageFallback from "@/components/error/PageFallback";

// Contexts
import NavDrawerContext from "@/contexts/NavDrawerContext";
import PreviousRouteContext from "@/contexts/PreviousRouteContext";
import SnackbarContext from "@/contexts/SnackbarContext";

// Styles
import "@/styles/global.css";

// Hooks
import { usePreviousPath } from "@/utils/hooks/routing";

// Types
import { CustomAppProps } from "@/utils/types/common";
import { Database } from "@/utils/types/supabase";

// English fonts
const bodyFontEN = Inter({ subsets: ["latin"] });
const displayFontEN = Space_Grotesk({ subsets: ["latin"] });

// Thai fonts
const bodyFontTH = Sarabun({
  weight: ["300", "400", "500", "700"],
  subsets: ["thai"],
});
const displayFontTH = IBM_Plex_Sans_Thai({
  weight: ["300", "400", "500", "700"],
  subsets: ["thai"],
});

// Mono font
const monoFont = Fira_Code({ subsets: ["latin"] });

/**
 * To prevent the App component from being more of a triangle than it already
 * is, all the context providers are extracted into this component.
 *
 * @param children The app that uses contexts.
 *
 * @returns The app wrapped with context providers.
 */
const Contexts: FC<{ children: ReactNode }> = ({ children }) => {
  const { previousPath } = usePreviousPath();
  const [snackbar, setSnackbar] = useState<JSX.Element | null>(null);
  const [navOpen, setNavOpen] = useState<boolean>(false);

  return (
    <PreviousRouteContext.Provider value={previousPath}>
      <SnackbarContext.Provider value={{ snackbar, setSnackbar }}>
        <NavDrawerContext.Provider value={{ navOpen, setNavOpen }}>
          {children}
        </NavDrawerContext.Provider>
      </SnackbarContext.Provider>
    </PreviousRouteContext.Provider>
  );
};

function App({ Component, pageProps }: CustomAppProps) {
  const { context, fab, navType, childURLs } = Component;

  // Supabase client
  const [supabase] = useState(() => createBrowserSupabaseClient<Database>());

  return (
    <>
      {/* Put Next.js generated font families into variables that SKCom and
          TailwindCSS can use */}
      <style jsx global>{`
        :root {
          --font-body: -apple-system, BlinkMacSystemFont,
            ${bodyFontEN.style.fontFamily}, ${bodyFontTH.style.fontFamily};
          --font-display: ${displayFontEN.style.fontFamily},
            ${displayFontTH.style.fontFamily};
          --font-mono: ui-monospace, SFMono-Regular, SF Mono,
            ${monoFont.style.fontFamily}, ${bodyFontTH.style.fontFamily};
        }
      `}</style>

      {/* Context proviers */}
      <SessionContextProvider supabaseClient={supabase}>
        <Contexts>
          {/* Framer Motion a11y */}
          <MotionConfig reducedMotion="user">
            {/* SKCom variables */}
            <ThemeProvider>
              {/* Rendered app */}
              <Layout {...{ context, fab, navType, childURLs }}>
                <ErrorBoundary Fallback={PageFallback}>
                  <Component {...pageProps} />
                </ErrorBoundary>
              </Layout>
            </ThemeProvider>

            {/* Analytics */}
            <Analytics
              beforeSend={(event) => {
                // Ignore locale when reporting pages
                const url = event.url.replace(/\/(en-US|th)/, "");
                return { ...event, url };
              }}
            />
          </MotionConfig>
        </Contexts>
      </SessionContextProvider>
    </>
  );
}

export default appWithTranslation(App);
