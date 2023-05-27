// External libraries
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";

import va from "@vercel/analytics";

import Link from "next/link";
import { useRouter } from "next/router";

import { useTranslation } from "next-i18next";

import {
  FC,
  ReactNode,
  forwardRef,
  useContext,
  useEffect,
  useState,
} from "react";

// SK Components
import {
  MaterialIcon,
  NavBar,
  NavBarItem,
  NavDrawer,
  NavDrawerItem,
  NavDrawerSection,
  RootLayout,
  Snackbar,
} from "@suankularb-components/react";

// Internal components
import LogOutDialog from "@/components/account/LogOutDialog";
import RailLogo from "@/components/brand/RailLogo";
import SchemeIcon from "@/components/icons/SchemeIcon";

// Backend
import { getUserMetadata } from "@/utils/backend/account";
import { getClassAdvisorAt } from "@/utils/backend/person/teacher";

// Contexts
import AppStateContext from "@/contexts/AppStateContext";

// Hooks
import { useLocale } from "@/utils/hooks/i18n";
import { usePreferences } from "@/utils/hooks/preferences";
import { useRefreshProps } from "@/utils/hooks/routing";
import { useSnackbar } from "@/utils/hooks/snackbar";

// Types
import { CustomPage } from "@/utils/types/common";
import { UserMetadata } from "@/utils/types/person";

const Layout: FC<
  { children: ReactNode } & Pick<
    CustomPage,
    "context" | "fab" | "navType" | "childURLs"
  >
> = ({ children, context: Context, fab, navType, childURLs }) => {
  // Translation
  const locale = useLocale();
  const { t } = useTranslation("common");

  // Router
  const refreshProps = useRefreshProps();

  // Navigation Bar and Drawer
  const router = useRouter();
  const { colorScheme, setColorScheme, navOpen, setNavOpen } =
    useContext(AppStateContext);

  // Class data (for Navigation links)
  const supabase = useSupabaseClient();
  const user = useUser();
  const [userMetadata, setUserMetadata] = useState<UserMetadata | null>();
  const [isClassAdvisor, setIsClassAdvisor] = useState<boolean>(false);
  useEffect(() => {
    if (!user) return;
    (async () => {
      // Get user metadata
      const { data: metadata, error: metadataError } = await getUserMetadata(
        supabase,
        user!.id
      );
      if (metadataError) {
        console.error(metadataError);
        setUserMetadata(null);
        return;
      }
      setUserMetadata(metadata);

      // Check if the user is a Class Advisor
      if (metadata!.role === "teacher") {
        const { data: classAdvisorAt, error } = await getClassAdvisorAt(
          supabase,
          metadata!.teacher!
        );

        if (classAdvisorAt) {
          setIsClassAdvisor(true);
          return;
        }

        if (error) console.error(error);
        setIsClassAdvisor(false);
      }
    })();
  }, [user]);

  // Snackbar
  const { snackbarOpen, setSnackbarOpen, snackbarProps } = useSnackbar();

  // Dialog control
  const [logOutOpen, setLogOutOpen] = useState<boolean>(false);

  // Preferences
  const { preferences, setPreference } = usePreferences();

  // Detect color scheme
  function setSchemeFromMedia() {
    setColorScheme(
      window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
    );
  }
  useEffect(() => {
    if (preferences)
      if (preferences.colorScheme === "auto") {
        // If the color scheme preference is `auto`, listen to the
        // `prefers-color-scheme` media query for the color scheme
        const media = window.matchMedia("(prefers-color-scheme: dark)");
        media.addEventListener("change", setSchemeFromMedia);
        return () => media.removeEventListener("change", setSchemeFromMedia);
      }
      // Otherwise, use the color scheme
      else setColorScheme(preferences.colorScheme);
  }, [preferences]);

  // Set color scheme class
  useEffect(() => {
    if (!colorScheme) return;
    const html = document.querySelector("html");
    if (!html) return;
    html.className = colorScheme;
  }, [colorScheme]);

  // Ensure light color scheme is used for printing
  useEffect(() => {
    if (!preferences) return;
    window.addEventListener("beforeprint", () => setColorScheme("light"));
    window.addEventListener("afterprint", () =>
      setColorScheme(preferences.colorScheme)
    );
    return () => {
      window.removeEventListener("beforeprint", () => setColorScheme("light"));
      window.removeEventListener("afterprint", () =>
        setColorScheme(preferences.colorScheme)
      );
    };
  }, [preferences]);

  const rootLayout = (
    <RootLayout>
      {/* Navigation Drawer */}
      <NavDrawer open={navOpen} onClose={() => setNavOpen(false)}>
        {/* Top-level pages */}
        <NavDrawerSection
          header={<span className="skc-headline-small">MySK</span>}
          alt="MySK"
        >
          {userMetadata?.role === "teacher" || navType === "teacher" ? (
            <NavDrawerItem
              icon={<MaterialIcon icon="school" />}
              label={t("navigation.teach")}
              selected={router.pathname.startsWith("/teach")}
              href="/teach"
              element={Link}
            />
          ) : (
            <NavDrawerItem
              icon={<MaterialIcon icon="school" />}
              label={t("navigation.learn")}
              selected={router.pathname.startsWith("/learn")}
              href="/learn"
              element={Link}
            />
          )}
          {((navType || userMetadata?.role) === "student" ||
            ((navType || userMetadata?.role) === "teacher" &&
              isClassAdvisor)) && (
            <NavDrawerItem
              icon={<MaterialIcon icon="groups" />}
              label={t("navigation.class")}
              selected={router.pathname.startsWith("/class")}
              href="/class"
              element={Link}
            />
          )}
          <NavDrawerItem
            icon={<MaterialIcon icon="search" />}
            label={t("navigation.lookup")}
            selected={
              router.pathname.startsWith("/lookup") &&
              !(
                router.pathname.startsWith("/lookup/person") ||
                router.pathname.startsWith("/lookup/class") ||
                router.pathname.startsWith("/lookup/document")
              )
            }
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

        {/* Lookup */}
        <NavDrawerSection header={t("navigation.drawer.lookup.title")}>
          <NavDrawerItem
            icon={<MaterialIcon icon="badge" />}
            label={t("navigation.drawer.lookup.person")}
            selected={router.pathname.startsWith("/lookup/person")}
            href="/lookup/person"
            element={Link}
          />
          <NavDrawerItem
            icon={<MaterialIcon icon="groups" />}
            label={t("navigation.drawer.lookup.class")}
            selected={router.pathname.startsWith("/lookup/class")}
            href="/lookup/class"
            element={Link}
          />
          <NavDrawerItem
            icon={<MaterialIcon icon="description" />}
            label={t("navigation.drawer.lookup.document")}
            selected={router.pathname.startsWith("/lookup/document")}
            href="/lookup/document"
            element={Link}
          />
        </NavDrawerSection>

        {/* About */}
        <NavDrawerSection header={t("navigation.drawer.about.title")}>
          <NavDrawerItem
            icon={<MaterialIcon icon="contact_support" />}
            label={t("navigation.drawer.about.help")}
            // TODO: Change this back to `/help` when the Help page is done
            href="https://docs.google.com/document/d/1yAEVK09BgbpFIPpG5j1xvfCRUGUdRyL9S1gAxh9UjfU/edit?usp=share_link"
            // eslint-disable-next-line react/display-name
            element={forwardRef((props, ref) => (
              <a
                {...props}
                ref={ref}
                onClick={() =>
                  va.track("Open User Guide", { location: "Naviation Drawer" })
                }
                target="_blank"
                rel="noreferrer"
              />
            ))}
          />
          {userMetadata?.isAdmin && (
            <NavDrawerItem
              icon={<MaterialIcon icon="shield_person" />}
              label={t("navigation.drawer.about.admin")}
              selected={router.pathname.startsWith("/admin")}
              href="/admin"
              element={Link}
            />
          )}
          <NavDrawerItem
            icon={<MaterialIcon icon="web" />}
            label={t("navigation.drawer.about.legacy")}
            href="http://mysk.school.61.19.250.243.no-domain.name/"
            // eslint-disable-next-line react/display-name
            element={forwardRef((props, ref) => (
              <a
                {...props}
                ref={ref}
                onClick={() => va.track("Open Legacy MySK")}
                target="_blank"
              />
            ))}
          />
          <NavDrawerItem
            icon={<MaterialIcon icon="translate" />}
            label={t("navigation.language")}
            onClick={() => {
              const newLocale = locale === "en-US" ? "th" : "en-US";
              refreshProps({ locale: newLocale });
              setPreference("locale", newLocale);
            }}
          />
          <NavDrawerItem
            icon={<MaterialIcon icon="logout" />}
            label={t("navigation.drawer.about.logOut")}
            onClick={() => setLogOutOpen(true)}
          />

          {/* Version number */}
          <p
            className="skc-label-small p-4 pt-8 !font-display
              text-on-surface-variant"
          >
            {process.env.NEXT_PUBLIC_VERSION || "Preview version"}
          </p>
        </NavDrawerSection>
      </NavDrawer>

      {/* Navigation Bar/Rail */}
      {(!navType || navType !== "hidden") && (
        <NavBar
          brand={
            <Link href="/" className="group">
              <RailLogo />
            </Link>
          }
          fab={fab}
          end={
            <>
              <NavBarItem
                icon={<MaterialIcon icon="translate" />}
                label={t("navigation.language")}
                onClick={() => {
                  const newLocale = locale === "en-US" ? "th" : "en-US";
                  refreshProps({ locale: newLocale });
                  setPreference("locale", newLocale);
                }}
              />
              <NavBarItem
                icon={
                  <SchemeIcon
                    colorScheme={
                      (colorScheme === "dark" ? "light" : "dark") || "light"
                    }
                  />
                }
                label={t(
                  `navigation.colorScheme.${
                    colorScheme === "dark" ? "light" : "dark"
                  }`
                )}
                onClick={() => {
                  const newScheme = colorScheme === "dark" ? "light" : "dark";
                  setColorScheme(newScheme);
                  setPreference("colorScheme", newScheme);
                  va.track("Toggle Color Scheme", {
                    newScheme:
                      newScheme === "dark" ? "Dark mode" : "Light mode",
                    location: "Navigation Rail",
                  });
                }}
              />
              <NavBarItem
                icon={<MaterialIcon icon="logout" />}
                label={t("navigation.logOut")}
                onClick={() => setLogOutOpen(true)}
              />
            </>
          }
          onNavToggle={() => setNavOpen(true)}
        >
          {(navType || userMetadata?.role) === "teacher" ? (
            <NavBarItem
              icon={<MaterialIcon icon="school" />}
              label={t("navigation.teach")}
              selected={router.pathname.startsWith("/teach")}
              href="/teach"
              element={Link}
            />
          ) : (
            <NavBarItem
              icon={<MaterialIcon icon="school" />}
              label={t("navigation.learn")}
              selected={router.pathname.startsWith("/learn")}
              href="/learn"
              element={Link}
            />
          )}
          {((navType || userMetadata?.role) === "student" ||
            ((navType || userMetadata?.role) === "teacher" &&
              isClassAdvisor)) && (
            <NavBarItem
              icon={<MaterialIcon icon="groups" />}
              label={t("navigation.class")}
              selected={router.pathname.startsWith("/class")}
              href="/class"
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
      )}

      {/* Log out Dialog */}
      <LogOutDialog open={logOutOpen} onClose={() => setLogOutOpen(false)} />

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

  return Context ? <Context>{rootLayout}</Context> : rootLayout;
};

export default Layout;
