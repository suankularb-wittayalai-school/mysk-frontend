// Modules
import type { AppProps } from "next/app";
import Link from "next/link";
import { useRouter } from "next/router";
import { appWithTranslation, useTranslation } from "next-i18next";
import { MaterialIcon, PageLayout } from "@suankularb-components/react";

// Styles
import "@styles/global.css";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const App = ({ Component, pageProps }: AppProps) => {
  const path = useRouter().asPath;
  const { t } = useTranslation();

  return (
    <PageLayout
      currentPath={path}
      navItems={[
        {
          name: t("navigation.home"),
          icon: {
            inactive: <MaterialIcon icon="home" type="outlined" />,
            active: <MaterialIcon icon="home" type="filled" />,
          },
          url: "/",
        },
        {
          name: t("navigation.login"),
          icon: {
            inactive: <MaterialIcon icon="login" type="outlined" />,
            active: <MaterialIcon icon="login" type="filled" />,
          },
          url: "/account/login",
        },
        {
          name: t("navigation.about"),
          icon: {
            inactive: <MaterialIcon icon="contacts" type="outlined" />,
            active: <MaterialIcon icon="contacts" type="filled" />,
          },
          url: "/developers",
        },
      ]}
      LinkElement={Link}
    >
      <Component {...pageProps} />
    </PageLayout>
  );
};

export default appWithTranslation(App);
