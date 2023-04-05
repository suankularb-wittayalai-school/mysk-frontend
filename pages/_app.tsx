// External libraries
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";

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
  const [supabaseClient] = useState(() =>
    createBrowserSupabaseClient<Database>()
  );

  // Authentication
  const router = useRouter();
  useEffect(() => {
    supabaseClient.auth.onAuthStateChange((event) => {
      if (event == "SIGNED_OUT") router.push("/");
      else if (event == "PASSWORD_RECOVERY")
        router.push("/account/forgot-password");
    });
  }, []);

  return (
    <>
      <style jsx global>{`
        :root {
          --font-body: -apple-system, BlinkMacSystemFont,
            ${bodyFontEN.style.fontFamily}, ${bodyFontTH.style.fontFamily};
          --font-display: ${displayFontEN.style.fontFamily},
            ${displayFontTH.style.fontFamily};
          --font-mono: ui-monospace, SFMono-Regular, SF Mono,
            ${monoFont.style.fontFamily};
        }
      `}</style>

      <SessionContextProvider supabaseClient={supabaseClient}>
        <Contexts>
          <MotionConfig reducedMotion="user">
            <ThemeProvider>
              <Layout {...{ context, fab, navType, childURLs }}>
                <ErrorBoundary Fallback={PageFallback}>
                  <Component {...pageProps} />
                </ErrorBoundary>
              </Layout>
            </ThemeProvider>
          </MotionConfig>
        </Contexts>
      </SessionContextProvider>
    </>
  );
}

export default appWithTranslation(App);
