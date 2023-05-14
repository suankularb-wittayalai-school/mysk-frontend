// External libraries
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";

import { Analytics } from "@vercel/analytics/react";

import { MotionConfig } from "framer-motion";

import {
  Inter,
  Space_Grotesk,
  Sarabun,
  IBM_Plex_Sans_Thai,
  Fira_Code,
} from "next/font/google";
import { useRouter } from "next/router";

import { appWithTranslation } from "next-i18next";

import { FC, ReactNode, useEffect, useState } from "react";

// SK Components
import { ThemeProvider } from "@suankularb-components/react";

// Internal components
import Layout from "@/components/Layout";
import ForgorDialog from "@/components/account/ForgorDialog";
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

  // Forgot password process (abbreviated throughout the codebase as `forgor`):
  //
  // 1. The user initiates forgor with the Forgot password Button in Landing.
  //    (see `/pages/index.tsx`)
  // 2. The user enters their email address to send a verification email to
  //    with the Request Forgor Dialog.
  //    (see `/components/account/RequestForgorDialog.tsx`)
  // 3. The email is sent, and the user is told the next steps.
  //    (see `/components/account/CheckEmail.tsx`)
  // 4. The user opens their email, sees our email, and clicks the link.
  // 5. The user is redirected back to MySK. A `PASSWORD_RECOVERY` event fires,
  //    the code block below intercepts it and open the Forgor Dialog.
  // 6. The user enters their new password, save it, and goes on with their life.
  //
  // See https://supabase.com/docs/reference/javascript/auth-resetpasswordforemail.

  const router = useRouter();
  const [verifiedForgorOpen, setVerifiedForgorOpen] = useState<boolean>(false);
  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event) => {
      switch (event) {
        // Magic link support
        case "SIGNED_IN":
          // Only redirect if user is at Landing
          if (!router.pathname) router.push("/learn");
          break;

        // A fallback in case logging out via `/account/logout` fails to
        // redirect
        case "SIGNED_OUT":
          router.push("/");
          break;

        // Forgor process (see 5.)
        case "PASSWORD_RECOVERY":
          setVerifiedForgorOpen(true);
          break;
      }
    });
  }, []);

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
                  <ForgorDialog
                    open={verifiedForgorOpen}
                    onClose={() => setVerifiedForgorOpen(false)}
                  />
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
