// Modules
import { AnimatePresence, motion } from "framer-motion";

import Link from "next/link";
import { useRouter } from "next/router";

import { useTranslation } from "next-i18next";

import { ReactNode, useEffect, useState } from "react";

// SK Components
import { MaterialIcon, PageLayout } from "@suankularb-components/react";

// Animations
import { fromUpToDown } from "@utils/animations/slide";
import { useSession } from "@utils/hooks/auth";

const Layout = ({
  transparentNav,
  children,
}: {
  transparentNav?: boolean;
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

  // TODO: When logging in does become a thing, change this to a more sane implementation
  const studentNavItem = [
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
  ];

  const teacherNavItem = [
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

  useEffect(() => {
    if (session) {
      if (session.user?.user_metadata?.role === "student") {
        setNavItems(studentNavItem);
      } else if (session.user?.user_metadata?.role === "teacher") {
        setNavItems(teacherNavItem);
      }

      if (session.user?.user_metadata?.isAdmin) {
        setNavItems([
          ...navItems,
          {
            name: t("navigation.admin"),
            icon: {
              inactive: <MaterialIcon icon="security" type="outlined" />,
              active: <MaterialIcon icon="security" type="filled" />,
            },
            url: "/t/admin",
          },
        ]);
      }
    }
  }, [session]);

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
            {children}
          </motion.div>
        </PageLayout>
      </div>
    </AnimatePresence>
  );
};

export default Layout;
