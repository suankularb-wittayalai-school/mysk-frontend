// External libraries
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";

import Link from "next/link";
import { useRouter } from "next/router";

import { useTranslation } from "next-i18next";

import { ReactNode, useEffect, useState } from "react";

import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";

// SK Components
import {
  MaterialIcon,
  Navigation,
  PageLayout,
} from "@suankularb-components/react";

// Animations
import { animationEase } from "@utils/animations/config";

// Backend
import { getClassOfStudent } from "@utils/backend/person/student";
import { getClassAdvisorAt } from "@utils/backend/person/teacher";

// Helpers
import { addAtIndex } from "@utils/helpers/array";

// Types
import { ClassWNumber } from "@utils/types/class";
import { getUserMetadata } from "@utils/backend/account";

const Layout = ({
  navIsTransparent,
  children,
}: {
  navIsTransparent?: boolean;
  children: ReactNode;
}): JSX.Element => {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const user = useUser();
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

  const welcomeNav = [
    {
      name: t("navigation.welcome"),
      icon: {
        inactive: <MaterialIcon icon="waving_hand" type="outlined" />,
        active: <MaterialIcon icon="waving_hand" type="filled" />,
      },
      url: "/welcome",
    },
  ];

  const studentNav = [
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
      url: "/account",
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
      url: "/account",
    },
  ];

  useEffect(() => {
    async function constructNavigation() {
      // Reset Navigation at log out
      if (!user) {
        setNavItems(defaultNav);
        return;
      }

      // Get user metadata
      const { data: metadata, error: metadataError } = await getUserMetadata(
        supabase,
        user.id
      );
      if (metadataError) {
        console.error(metadataError);
        return;
      }

      // Decide the Navigation the user is going to see based on their role

      // Welcome Navigation
      if (!metadata!.onboarded) {
        setNavItems(welcomeNav);
      }
      // Student Navigation
      else if (metadata!.role == "student") {
        const { data: classOfStudent, error } = await getClassOfStudent(
          supabase,
          metadata!.student!
        );

        if (error) {
          console.error(error);
          setNavItems(studentNav);
          return;
        }

        setNavItems(
          [
            {
              name: t("navigation.learn"),
              icon: {
                inactive: <MaterialIcon icon="school" type="outlined" />,
                active: <MaterialIcon icon="school" type="filled" />,
              },
              url: `/learn/${(classOfStudent as ClassWNumber).number}`,
            },
            {
              name: t("navigation.people"),
              icon: {
                inactive: <MaterialIcon icon="groups" type="outlined" />,
                active: <MaterialIcon icon="groups" type="filled" />,
              },
              url: `/class/${(classOfStudent as ClassWNumber).number}/view`,
            },
          ].concat(studentNav)
        );
      }
      // Teacher Navigation
      else if (metadata!.role == "teacher") {
        const { data: classAdvisorAt, error } = await getClassAdvisorAt(
          supabase,
          metadata!.teacher!
        );

        if (error) console.error(error);

        if (!classAdvisorAt) {
          setNavItems(teacherNav);
          return;
        }

        setNavItems(
          addAtIndex(teacherNav, 1, {
            name: t("navigation.class"),
            icon: {
              inactive: <MaterialIcon icon="groups" type="outlined" />,
              active: <MaterialIcon icon="groups" type="filled" />,
            },
            url: `/class/${classAdvisorAt!.number}/manage`,
          })
        );
      }
    }

    constructNavigation();
  }, [router.asPath]);

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
