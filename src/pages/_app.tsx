// Modules
import { NextPage } from "next";
import type { AppProps } from "next/app";

import { appWithTranslation } from "next-i18next";

import { ComponentType, ReactElement, ReactNode, useState } from "react";

// Modules
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

// Styles
import "@styles/global.css";

// Components
import Layout from "@components/Layout";
import Head from "next/head";

const App = ({
  Component,
  pageProps,
}: AppProps & {
  Component: NextPage & {
    getLayout?: (page: ReactElement) => ReactNode;
  };
}) => {
  const [queryClient] = useState(() => new QueryClient());

  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => <Layout>{page}</Layout>);

  return (
    <QueryClientProvider client={queryClient}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      {getLayout(<Component {...pageProps} />)}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default appWithTranslation(App as ComponentType<AppProps>);
