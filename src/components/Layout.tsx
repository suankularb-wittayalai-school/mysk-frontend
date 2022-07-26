// Modules
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";

import Link from "next/link";
import { useRouter } from "next/router";

import { useTranslation } from "next-i18next";

import { ReactNode, useEffect, useState } from "react";

// SK Components
import {
  MaterialIcon,
  Navigation,
  PageLayout,
} from "@suankularb-components/react";

// Animations
import { animationEase } from "@utils/animations/config";

// Hooks
import { useSession } from "@utils/hooks/auth";

const Layout = ({
  navIsTransparent,
  children,
}: {
  navIsTransparent?: boolean;
  children: ReactNode;
}): JSX.Element => {
  const router = useRouter();
  const session = useSession();
  const { t } = useTranslation();

  const defaultNav = [
    {
      name: t("navigation.welcome"),
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
  ];

  const [navItems, setNavItems] = useState(defaultNav);

  const studentNav = [
    {
      name: t("navigation.learn"),
      icon: {
        inactive: <MaterialIcon icon="school" type="outlined" />,
        active: <MaterialIcon icon="school" type="filled" />,
      },
      url: "/learn",
    },
    {
      name: t("navigation.people"),
      icon: {
        inactive: <MaterialIcon icon="groups" type="outlined" />,
        active: <MaterialIcon icon="groups" type="filled" />,
      },
      url: "/people",
    },
    {
      name: t("navigation.news"),
      icon: {
        inactive: <MaterialIcon icon="newspaper" type="outlined" />,
        active: <MaterialIcon icon="newspaper" type="filled" />,
      },
      url: "/news",
    },
    {
      name: t("navigation.me"),
      icon: {
        inactive: <MaterialIcon icon="account_circle" type="outlined" />,
        active: <MaterialIcon icon="account_circle" type="filled" />,
      },
      url: "/me",
    },
  ];
  const teacherNav = [
    {
      name: t("navigation.teach"),
      icon: {
        inactive: <MaterialIcon icon="school" type="outlined" />,
        active: <MaterialIcon icon="school" type="filled" />,
      },
      url: "/teach",
    },
    {
      name: t("navigation.class"),
      icon: {
        inactive: <MaterialIcon icon="groups" type="outlined" />,
        active: <MaterialIcon icon="groups" type="filled" />,
      },
      url: "/class/202",
    },
    {
      name: t("navigation.news"),
      icon: {
        inactive: <MaterialIcon icon="newspaper" type="outlined" />,
        active: <MaterialIcon icon="newspaper" type="filled" />,
      },
      url: "/news",
    },
    {
      name: t("navigation.me"),
      icon: {
        inactive: <MaterialIcon icon="account_circle" type="outlined" />,
        active: <MaterialIcon icon="account_circle" type="filled" />,
      },
      url: "/me",
    },
  ];

  useEffect(() => {
    const role = session?.user?.user_metadata.role;

    // Decide the Navigation the user is going to see based on their role
    if (role == "student") setNavItems(studentNav);
    else if (role == "teacher") setNavItems(teacherNav);
    else setNavItems(defaultNav);
  }, [session]);

  return (
    <LayoutGroup>
      <AnimatePresence
        exitBeforeEnter
        initial={false}
        onExitComplete={() => window.scrollTo(0, 0)}
      >
        {navIsTransparent ? (
          // Fills the page with children if the Navigation is transparent
          <>
            <Navigation
              currentPath={router.asPath}
              navItems={navItems}
              LinkElement={Link}
              isTransparent
            />
            <motion.div
              key={router.route}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: animationEase }}
            >
              {children}
            </motion.div>
          </>
        ) : (
          // Use the normal Page Layout if the Navigation is normal
          <PageLayout
            currentPath={router.asPath}
            navItems={navItems}
            LinkElement={Link}
          >
            <motion.div
              key={router.route}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: animationEase }}
            >
              {children}
            </motion.div>
          </PageLayout>
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
};

export default Layout;
