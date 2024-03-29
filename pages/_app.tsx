// Imports
import Layout from "@/components/Layout";
import AccountNotFoundDialog from "@/components/account/AccountNotFoundDialog";
import ErrorBoundary from "@/components/error/ErrorBoundary";
import PageFallback from "@/components/error/PageFallback";
import AppStateContext from "@/contexts/AppStateContext";
import PreviousRouteContext from "@/contexts/PreviousRouteContext";
import SnackbarContext from "@/contexts/SnackbarContext";
import "@/styles/global.css";
import usePreviousPath from "@/utils/helpers/usePreviousPath";
import { ColorScheme, CustomAppProps } from "@/utils/types/common";
import { Database } from "@/utils/types/supabase";
import { ThemeProvider } from "@suankularb-components/react";
import {
  Session,
  createPagesBrowserClient,
} from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import va from "@vercel/analytics";
import { Analytics } from "@vercel/analytics/react";
import { MotionConfig } from "framer-motion";
import { SessionProvider } from "next-auth/react";
import { appWithTranslation } from "next-i18next";
import {
  Fira_Code,
  IBM_Plex_Sans_Thai,
  Inter,
  Sarabun,
  Space_Grotesk,
} from "next/font/google";
import localFont from "next/font/local";
import { FC, ReactNode, useEffect, useState } from "react";
import { Provider as BalancerProvider } from "react-wrap-balancer";

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

// Icon font
const iconFont = localFont({
  src: "../public/fonts/material-symbols.woff2",
  weight: "100 700",
  style: "normal",
});

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
  const [colorScheme, setColorScheme] = useState<ColorScheme>();
  const [navOpen, setNavOpen] = useState(false);
  const [accountNotFoundOpen, setAccountNotFoundOpen] = useState(false);

  return (
    <PreviousRouteContext.Provider value={previousPath}>
      <SnackbarContext.Provider value={{ snackbar, setSnackbar }}>
        <AppStateContext.Provider
          value={{
            colorScheme,
            setColorScheme,
            navOpen,
            setNavOpen,
            accountNotFoundOpen,
            setAccountNotFoundOpen,
          }}
        >
          <BalancerProvider>{children}</BalancerProvider>
          <AccountNotFoundDialog
            open={accountNotFoundOpen}
            onClose={() => setAccountNotFoundOpen(false)}
          />
        </AppStateContext.Provider>
      </SnackbarContext.Provider>
    </PreviousRouteContext.Provider>
  );
};

function App({
  Component,
  pageProps: { session, ...pageProps },
}: CustomAppProps) {
  const { fab, navType, childURLs } = Component;

  // Supabase client
  const [supabase] = useState(() => createPagesBrowserClient<Database>());

  // Track PWA installs
  useEffect(() => {
    const trackInstall = () => va.track("Install PWA");
    window.addEventListener("appinstalled", trackInstall);
    return () => window.removeEventListener("appinstalled", trackInstall);
  });

  return (
    <>
      {/* Put Next.js generated font families into CSS variables that SKCom and
          TailwindCSS can use */}
      <style jsx global>{`
        :root {
          --font-body: ${bodyFontEN.style.fontFamily},
            ${bodyFontTH.style.fontFamily};
          --font-display: ${displayFontEN.style.fontFamily},
            ${displayFontTH.style.fontFamily};
          --font-print: ${bodyFontTH.style.fontFamily}, Sarabun;
          --font-mono: ui-monospace, SFMono-Regular, SF Mono,
            ${monoFont.style.fontFamily}, ${bodyFontTH.style.fontFamily};
          --font-icon: ${iconFont.style.fontFamily};
        }
      `}</style>

      {/* Context proviers */}
      <SessionProvider session={session}>
        <SessionContextProvider
          supabaseClient={supabase}
          initialSession={pageProps.initialSession as Session}
        >
          <Contexts>
            {/* Framer Motion a11y */}
            <MotionConfig reducedMotion="user">
              {/* SKCom variables */}
              <ThemeProvider>
                {/* Rendered app */}
                <Layout {...{ fab, navType, childURLs }}>
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
      </SessionProvider>
    </>
  );
}

export default appWithTranslation(App);
