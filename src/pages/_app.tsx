// External libraries
import { AnimatePresence, motion } from "framer-motion";

import { NextPage } from "next";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";

import { appWithTranslation } from "next-i18next";

import { ReactElement, ReactNode, useEffect, useState } from "react";

import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

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

// Animation
import { animationEase, animationTransition } from "@utils/animations/config";

const App = ({
  Component,
  pageProps,
}: AppProps & {
  Component: NextPage & {
    getLayout?: (page: ReactElement) => ReactNode;
  };
}) => {
  // Query client
  const [queryClient] = useState(() => new QueryClient());

  // Page transition loading
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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

  // Layout
  // Use the layout defined at the page level, if available.
  // Otherwise, use the default Layout.
  const getLayout = Component.getLayout ?? ((page) => <Layout>{page}</Layout>);

  return (
    <QueryClientProvider client={queryClient}>
      {/* Mark page as responsive */}
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      {/* Dim content during load */}
      <AnimatePresence>
        {loading && (
          <motion.div
            key="page-load"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "tween", duration: 1.5, ease: animationEase }}
            className="fixed inset-0 z-50 cursor-progress bg-[#00000020]"
          />
        )}
      </AnimatePresence>

      {/* Main component wrapped with a layout */}
      {getLayout(<Component {...pageProps} />)}

      {/* React Query devtools */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default appWithTranslation(App);
