// External libraries
import { MotionConfig } from "framer-motion";

import { NextPage } from "next";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";

import { appWithTranslation, useTranslation } from "next-i18next";

import { ReactElement, ReactNode, useEffect, useState } from "react";

import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";

// Fonts
import "@fontsource/sora/300.css";
import "@fontsource/sora/400.css";
import "@fontsource/sora/500.css";
import "@fontsource/sora/700.css";
import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/700.css";
import "@fontsource/noto-sans-thai/300.css";
import "@fontsource/noto-sans-thai/400.css";
import "@fontsource/noto-sans-thai/500.css";
import "@fontsource/noto-sans-thai/700.css";
import "@fontsource/sarabun/300.css";
import "@fontsource/sarabun/400.css";
import "@fontsource/sarabun/500.css";
import "@fontsource/sarabun/700.css";

// Styles
import "@styles/global.css";

// Components
import Layout from "@components/Layout";
import PageLoadDim from "@components/PageLoadDim";
import ErrorBoundary from "@components/error/ErrorBoundary";
import PageFallback from "@components/error/PageFallback";

// Types
import { Database } from "@utils/types/supabase";

const App = ({
  Component,
  pageProps,
}: AppProps & {
  Component: NextPage & {
    getLayout?: (page: ReactElement) => ReactNode;
  };
}) => {
  // Translation
  const {t} = useTranslation("common")

  // Supabase client
  const [supabaseClient] = useState(() =>
    createBrowserSupabaseClient<Database>()
  );

  // Query client
  const [queryClient] = useState(() => new QueryClient());

  // Authentication
  const router = useRouter();
  useEffect(() => {
    supabaseClient.auth.onAuthStateChange((event) => {
      if (event == "SIGNED_OUT") router.push("/");
      else if (event == "PASSWORD_RECOVERY")
        router.push("/account/forgot-password");
    });
  });

  // Layout
  // Use the layout defined at the page level, if available.
  // Otherwise, use the default Layout.
  const getLayout = Component.getLayout ?? ((page) => <Layout>{page}</Layout>);

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      <QueryClientProvider client={queryClient}>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <meta name="description" content={t("brand.description")} />
        </Head>
        <PageLoadDim />
        <MotionConfig reducedMotion="user">
          {getLayout(
            <ErrorBoundary Fallback={PageFallback}>
              <Component {...pageProps} />
            </ErrorBoundary>
          )}
        </MotionConfig>
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </QueryClientProvider>
    </SessionContextProvider>
  );
};

export default appWithTranslation(App);
