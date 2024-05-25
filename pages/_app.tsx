import Layout from "@/components/Layout";
import ErrorBoundary from "@/components/error/ErrorBoundary";
import PageFallback from "@/components/error/PageFallback";
import AppStateContext from "@/contexts/AppStateContext";
import PreviousRouteContext from "@/contexts/PreviousRouteContext";
import SnackbarContext from "@/contexts/SnackbarContext";
import UserContext from "@/contexts/UserContext";
import "@/styles/global.css";
import usePreviousPath from "@/utils/helpers/usePreviousPath";
import { ColorScheme, CustomAppProps } from "@/utils/types/common";
import { Student, Teacher, User } from "@/utils/types/person";
import { Database } from "@/utils/types/supabase";
import { ThemeProvider } from "@suankularb-components/react";
import {
  Session,
  createPagesBrowserClient,
} from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { MotionConfig } from "framer-motion";
import { appWithTranslation } from "next-i18next";
import PlausibleProvider, { usePlausible } from "next-plausible";
import {
  Fira_Code,
  IBM_Plex_Sans_Thai,
  Inter,
  Sarabun,
  Space_Grotesk,
} from "next/font/google";
import localFont from "next/font/local";
import { useRouter } from "next/router";
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

  const [user, setUser] = useState<User | null>(null);
  const [person, setPerson] = useState<Student | Teacher | null>(null);
  const [loading, setLoading] = useState(false);

  const [snackbar, setSnackbar] = useState<JSX.Element | null>(null);

  const [colorScheme, setColorScheme] = useState<ColorScheme>();
  const [navOpen, setNavOpen] = useState(false);

  return (
    <PreviousRouteContext.Provider value={previousPath}>
      <UserContext.Provider
        value={{ user, setUser, person, setPerson, loading, setLoading }}
      >
        <SnackbarContext.Provider value={{ snackbar, setSnackbar }}>
          <AppStateContext.Provider
            value={{ colorScheme, setColorScheme, navOpen, setNavOpen }}
          >
            {children}
          </AppStateContext.Provider>
        </SnackbarContext.Provider>
      </UserContext.Provider>
    </PreviousRouteContext.Provider>
  );
};

function App({
  Component,
  pageProps: { session, ...pageProps },
}: CustomAppProps) {
  const { fab, navType, childURLs } = Component;
  const plausible = usePlausible();
  const router = useRouter();

  // Create Supabase client.
  const [supabase] = useState(() => createPagesBrowserClient<Database>());

  // Track PWA installs.
  useEffect(() => {
    const trackInstall = () => plausible("Install PWA");
    window.addEventListener("appinstalled", trackInstall);
    return () => window.removeEventListener("appinstalled", trackInstall);
  });

  // Track page views.
  // See https://plausible.io/docs/custom-locations
  useEffect(() => {
    plausible("pageview", {
      // We’re not using `router.asPath` as we’re ignoring locale and query.
      u: window.location.origin + router.pathname + window.location.search,
    });
  }, [router.pathname]);

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
      <SessionContextProvider
        supabaseClient={supabase}
        initialSession={pageProps.initialSession as Session}
      >
        <Contexts>
          {/* Framer Motion a11y */}
          <MotionConfig reducedMotion="user">
            {/* Analytics */}
            <PlausibleProvider
              domain="mysk.school"
              taggedEvents
              manualPageviews
            >
              {/* Text balancer */}
              <BalancerProvider>
                {/* SKCom variables */}
                <ThemeProvider>
                  {/* Rendered app */}
                  <Layout fab={fab} navType={navType} childURLs={childURLs}>
                    <ErrorBoundary Fallback={PageFallback}>
                      <Component {...pageProps} />
                    </ErrorBoundary>
                  </Layout>
                </ThemeProvider>
              </BalancerProvider>
            </PlausibleProvider>
          </MotionConfig>
        </Contexts>
      </SessionContextProvider>
    </>
  );
}

// Prevent next-translate from using `getInitialProps` so as to keep Automatic
// Static Optimization.
// Declaring `getStaticProps` here forces next-translate to use it.
// See: https://github.com/aralroca/next-translate/issues/801#issuecomment-1059800473
export const getStaticProps = undefined;

export default appWithTranslation(App);
