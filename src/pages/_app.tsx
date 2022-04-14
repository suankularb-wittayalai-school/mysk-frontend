// Modules
import { AnimatePresence, motion } from "framer-motion";

import type { AppProps } from "next/app";
import Link from "next/link";
import { useRouter } from "next/router";

import { appWithTranslation, useTranslation } from "next-i18next";

// SK Components
import { MaterialIcon, PageLayout } from "@suankularb-components/react";

// Styles
import "@styles/global.css";

// Animations
import { fromUpToDown } from "@utils/animations/slide";

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const { t } = useTranslation();

  // TODO: When logging in does become a thing, change this to a more sane implementation
  const navItems = ["/", "/account/login", "/about"].includes(router.asPath)
    ? [
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
            inactive: <MaterialIcon icon="information" type="outlined" />,
            active: <MaterialIcon icon="information" type="filled" />,
          },
          url: "/about",
        },
      ]
    : [
        "/s/home",
        "/s/405/schedule",
        "/s/405/class",
        "/s/teachers",
        "news",
      ].includes(router.asPath)
    ? [
        {
          name: t("navigation.home"),
          icon: {
            inactive: <MaterialIcon icon="home" type="outlined" />,
            active: <MaterialIcon icon="home" type="filled" />,
          },
          url: "/s/home",
        },
        {
          name: t("navigation.schedule"),
          icon: {
            inactive: <MaterialIcon icon="dashboard" type="outlined" />,
            active: <MaterialIcon icon="dashboard" type="filled" />,
          },
          url: "/s/405/schedule",
        },
        {
          name: t("navigation.class"),
          icon: {
            inactive: <MaterialIcon icon="groups" type="outlined" />,
            active: <MaterialIcon icon="groups" type="filled" />,
          },
          url: "/s/405/class",
        },
        {
          name: t("navigation.teachers"),
          icon: {
            inactive: <MaterialIcon icon="school" type="outlined" />,
            active: <MaterialIcon icon="school" type="filled" />,
          },
          url: "/s/teachers",
        },
        {
          name: t("navigation.news"),
          icon: {
            inactive: <MaterialIcon icon="newspaper" type="outlined" />,
            active: <MaterialIcon icon="newspaper" type="filled" />,
          },
          url: "/news",
        },
      ]
    : [
        {
          name: t("navigation.home"),
          icon: {
            inactive: <MaterialIcon icon="home" type="outlined" />,
            active: <MaterialIcon icon="home" type="filled" />,
          },
          url: "/t/home",
        },
        {
          name: t("navigation.schedule"),
          icon: {
            inactive: <MaterialIcon icon="dashboard" type="outlined" />,
            active: <MaterialIcon icon="dashboard" type="filled" />,
          },
          url: "/t/509/schedule",
        },
        {
          name: t("navigation.subjects"),
          icon: {
            inactive: <MaterialIcon icon="school" type="outlined" />,
            active: <MaterialIcon icon="school" type="filled" />,
          },
          url: "/t/subjects/teaching",
        },
        {
          name: t("navigation.class"),
          icon: {
            inactive: <MaterialIcon icon="groups" type="outlined" />,
            active: <MaterialIcon icon="groups" type="filled" />,
          },
          url: "/t/509/class",
        },
        {
          name: t("navigation.admin"),
          icon: {
            inactive: <MaterialIcon icon="security" type="outlined" />,
            active: <MaterialIcon icon="security" type="filled" />,
          },
          url: "/admin",
        },
      ];

  return (
    <AnimatePresence
      exitBeforeEnter
      initial={false}
      onExitComplete={() => window.scrollTo(0, 0)}
    >
      <div className="overflow-hidden bg-background">
        <PageLayout
          key={router.route}
          currentPath={router.asPath}
          navItems={navItems}
          LinkElement={Link}
        >
          <motion.div
            initial="hidden"
            animate="enter"
            exit="exit"
            variants={fromUpToDown}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="flex flex-grow flex-col overflow-auto"
          >
            <Component {...pageProps} />
          </motion.div>
        </PageLayout>
      </div>
    </AnimatePresence>
  );
};

export default appWithTranslation(App);
