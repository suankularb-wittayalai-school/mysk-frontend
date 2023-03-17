// External libraries
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import { useTranslation } from "next-i18next";

import { FC, ReactNode, useEffect, useState } from "react";

// SK Components
import {
  MaterialIcon,
  NavBar,
  NavBarItem,
  NavDrawer,
  NavDrawerItem,
  NavDrawerSection,
  PageHeader,
  Progress,
  RootLayout,
  Snackbar,
} from "@suankularb-components/react";

// Internal components
import Favicon from "@/components/brand/Favicon";
import RailLogo from "@/components/brand/RailLogo";

// Hooks
import { usePageIsLoading, useTransitionEvent } from "@/utils/hooks/routing";
import { useSnackbar } from "@/utils/hooks/snackbar";

// Types
import { CustomPage } from "@/utils/types/common";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { getUserMetadata } from "@/utils/backend/account";
import { getClassOfStudent } from "@/utils/backend/person/student";
import { getClassAdvisorAt } from "@/utils/backend/person/teacher";

const Layout: FC<
  { children: ReactNode } & Pick<
    CustomPage,
    "fab" | "pageHeader" | "pageRole" | "childURLs"
  >
> = ({ children, fab, pageHeader, pageRole, childURLs }) => {
  // Translation
  const { t } = useTranslation([
    "common",
    ...(typeof pageHeader?.title === "object" && "ns" in pageHeader?.title
      ? [(pageHeader.title as { ns: string }).ns]
      : []),
  ]);

  // Navigation Bar and Drawer
  const router = useRouter();
  const [navOpen, setNavOpen] = useState<boolean>(false);

  // Class data (for Navigation links)
  const supabase = useSupabaseClient();
  const user = useUser();
  const [classNumber, setClassNumber] = useState<number | null>();
  async function getAndSetClassNumber() {
    // Get user metadata
    const { data: metadata, error: metadataError } = await getUserMetadata(
      supabase,
      user!.id
    );
    if (metadataError) {
      console.error(metadataError);
      return;
    }

    // For a student
    if (metadata!.role == "student") {
      const { data: classOfStudent, error } = await getClassOfStudent(
        supabase,
        metadata!.student!
      );
      if (error) {
        console.error(error);
        return;
      }
      setClassNumber(classOfStudent.number);
    }

    // For a teacher
    else if (metadata!.role == "teacher") {
      const { data: classAdvisorAt, error } = await getClassAdvisorAt(
        supabase,
        metadata!.teacher!
      );

      if (error) {
        console.error(error);
        return;
      }
      if (!classAdvisorAt) return;
      setClassNumber(classAdvisorAt.number);
    }
  }
  useEffect(() => {
    if (!user || pageRole === "public") return;
    getAndSetClassNumber();
  }, [user]);

  // Root Layout
  const { pageIsLoading } = usePageIsLoading();
  const { transitionEvent } = useTransitionEvent(
    pageHeader?.parentURL,
    childURLs
  );

  // Snackbar
  const { snackbarOpen, setSnackbarOpen, snackbarProps } = useSnackbar();

  return (
    <RootLayout
      // Spatial transition is a beta feature. You can enable it with
      // appending `SKCOM_ENABLE_SPATIAL_TRANSITIONS=true` to your
      // `.env.local` file.
      transitionEvent={
        process.env.SKCOM_ENABLE_SPATIAL_TRANSITIONS === "true"
          ? transitionEvent
          : undefined
      }
    >
      {/* Navigation Drawer */}
      <NavDrawer open={navOpen} onClose={() => setNavOpen(false)}>
        {/* Top-level pages */}
        <NavDrawerSection
          header={<span className="skc-headline-small">MySK</span>}
          alt="MySK"
        >
          <NavDrawerItem
            icon={<MaterialIcon icon="school" />}
            label={t("navigation.learn")}
            selected={router.pathname.startsWith("/learn")}
            href={`/learn/${classNumber}`}
            element={Link}
          />
          {(pageRole === "student" ||
            (pageRole === "teacher" && classNumber)) && (
            <NavDrawerItem
              icon={<MaterialIcon icon="groups" />}
              label={t("navigation.class")}
              selected={router.pathname.startsWith("/class")}
              href={`/class/${classNumber}/overview`}
              element={Link}
            />
          )}
          <NavDrawerItem
            icon={<MaterialIcon icon="search" />}
            label={t("navigation.lookup")}
            selected={router.pathname.startsWith("/lookup")}
            href="/lookup"
            element={Link}
          />
          <NavDrawerItem
            icon={<MaterialIcon icon="newspaper" />}
            label={t("navigation.news")}
            selected={router.pathname.startsWith("/news")}
            href="/news"
            element={Link}
          />
          <NavDrawerItem
            icon={<MaterialIcon icon="account_circle" />}
            label={t("navigation.account")}
            selected={router.pathname.startsWith("/account")}
            href="/account"
            element={Link}
          />
        </NavDrawerSection>
      </NavDrawer>

      {/* Navigation Bar/Rail */}
      {!pageRole ||
        (pageRole !== "public" && (
          <NavBar
            brand={<RailLogo />}
            fab={fab}
            end={
              <>
                <NavBarItem
                  icon={<MaterialIcon icon="translate" />}
                  label={t("navigation.language")}
                  href="/"
                  element={(props) => (
                    <Link
                      locale={router.locale == "en-US" ? "th" : "en-US"}
                      {...props}
                    />
                  )}
                />
                <NavBarItem
                  icon={<MaterialIcon icon="logout" />}
                  label={t("navigation.logOut")}
                  href="/account/logout"
                  element={Link}
                />
              </>
            }
            onNavToggle={() => setNavOpen(true)}
          >
            <NavBarItem
              icon={<MaterialIcon icon="school" />}
              label={t("navigation.learn")}
              selected={router.pathname.startsWith("/learn")}
              href={`/learn/${classNumber}`}
              element={Link}
            />
            {(pageRole === "student" ||
              (pageRole === "teacher" && classNumber)) && (
              <NavBarItem
                icon={<MaterialIcon icon="groups" />}
                label={t("navigation.class")}
                selected={router.pathname.startsWith("/class")}
                href={`/class/${classNumber}/overview`}
                element={Link}
              />
            )}
            <NavBarItem
              icon={<MaterialIcon icon="search" />}
              label={t("navigation.lookup")}
              selected={router.pathname.startsWith("/lookup")}
              href="/lookup"
              element={Link}
            />
            <NavBarItem
              icon={<MaterialIcon icon="newspaper" />}
              label={t("navigation.news")}
              selected={router.pathname.startsWith("/news")}
              href="/news"
              element={Link}
            />
            <NavBarItem
              icon={<MaterialIcon icon="account_circle" />}
              label={t("navigation.account")}
              selected={router.pathname.startsWith("/account")}
              href="/account"
              element={Link}
            />
          </NavBar>
        ))}

      {/* Page Header */}
      {pageHeader && (
        <PageHeader
          brand={<Favicon />}
          homeURL="/"
          element={Link}
          onNavToggle={() => setNavOpen(true)}
          {...pageHeader}
          title={
            typeof pageHeader.title === "object" && "ns" in pageHeader.title
              ? t(pageHeader.title.key, { ns: pageHeader.title.ns })
              : pageHeader.title
          }
        />
      )}

      {/* Page loading indicator */}
      <Progress
        appearance="linear"
        alt="Loading page…"
        visible={pageIsLoading}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        {...snackbarProps!}
      />

      {/* Content */}
      {children}
    </RootLayout>
  );
};

export default Layout;
