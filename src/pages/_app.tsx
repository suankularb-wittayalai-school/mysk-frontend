// Modules
import { NextPage } from "next";
import type { AppProps } from "next/app";

import { appWithTranslation } from "next-i18next";

import { ComponentType, ReactElement, ReactNode } from "react";

// Styles
import "@styles/global.css";

// Components
import Layout from "@components/Layout";

const App = ({
  Component,
  pageProps,
}: AppProps & {
  Component: NextPage & {
    getLayout?: (page: ReactElement) => ReactNode;
  };
}) => {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => <Layout>{page}</Layout>);

  return getLayout(<Component {...pageProps} />);
};

export default appWithTranslation(App as ComponentType<AppProps>);
