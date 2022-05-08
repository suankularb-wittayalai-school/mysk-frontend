// Modules
import { AnimatePresence, motion } from "framer-motion";

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
import { fromUpToDown } from "@utils/animations/slide";
import { useSession } from "@utils/hooks/auth";

const Layout = ({
  navIsTransparent,
  children,
}: {
  navIsTransparent?: boolean;
  children: ReactNode;
}): JSX.Element => {
  const router = useRouter();
  const { t } = useTranslation();

  const [navItems, setNavItems] = useState([
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
  ]);

  const session = useSession();

  const studentNav = [
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
  ];
  const teacherNav = [
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
      url: "/t/schedule",
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
  ];
  const adminNavItem = {
    name: t("navigation.admin"),
    icon: {
      inactive: <MaterialIcon icon="security" type="outlined" />,
      active: <MaterialIcon icon="security" type="filled" />,
    },
    url: "/t/admin",
  };

  useEffect(() => {
    if (session) {
      const isAdmin = session.user?.user_metadata?.isAdmin;

      // Decide the Navigation the user is going to see based on their role
      // Append the Admin Nav Item to the Navigation if the user is an admin
      if (session.user?.user_metadata?.role === "student") {
        setNavItems(
          isAdmin
            ? [...studentNav, adminNavItem]
            : [
                ...studentNav,
                {
                  name: t("navigation.news"),
                  icon: {
                    inactive: <MaterialIcon icon="newspaper" type="outlined" />,
                    active: <MaterialIcon icon="newspaper" type="filled" />,
                  },
                  url: "/news",
                },
              ]
        );
      } else if (session.user?.user_metadata?.role === "teacher") {
        setNavItems(isAdmin ? [...teacherNav, adminNavItem] : teacherNav);
      }
    }
  }, [session, router]);

  return (
    <AnimatePresence
      exitBeforeEnter
      initial={false}
      onExitComplete={() => window.scrollTo(0, 0)}
    >
      <div className="overflow-hidden bg-background">
        {navIsTransparent ? (
          // Fills the page with children if the Navigation is transparent
          <div>
            <Navigation
              key={router.route}
              currentPath={router.asPath}
              navItems={navItems}
              LinkElement={Link}
              isTransparent
              className="sm:!absolute sm:top-0"
            />
            <div>{children}</div>
          </div>
        ) : (
          // Use the normal Page Layout if the Navigation is normal
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
              {children}
            </motion.div>
          </PageLayout>
        )}
      </div>
    </AnimatePresence>
  );
};

export default Layout;
