// Imports
import Favicon from "@/components/Favicon";
import LogOutDialog from "@/components/account/LogOutDialog";
import SchemeIcon from "@/components/icons/SchemeIcon";
import AppStateContext from "@/contexts/AppStateContext";
import permitted from "@/utils/helpers/permitted";
import getHomeURLofRole from "@/utils/helpers/person/getHomeURLofRole";
import useLocale from "@/utils/helpers/useLocale";
import usePageIsLoading from "@/utils/helpers/usePageIsLoading";
import usePreferences from "@/utils/helpers/usePreferences";
import useRefreshProps from "@/utils/helpers/useRefreshProps";
import useSnackbar from "@/utils/helpers/useSnackbar";
import useUser from "@/utils/helpers/useUser";
import { CustomPage } from "@/utils/types/common";
import { UserPermissionKey, UserRole } from "@/utils/types/person";
import {
  MaterialIcon,
  NavBar,
  NavBarItem,
  NavDrawer,
  NavDrawerItem,
  NavDrawerSection,
  Progress,
  RootLayout,
  Snackbar,
  Text,
  useBreakpoint,
} from "@suankularb-components/react";
import va from "@vercel/analytics";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  FC,
  ReactNode,
  forwardRef,
  useContext,
  useEffect,
  useState,
} from "react";

/**
 * The root layout of MySK.
 *
 * @param children
 *
 * @see {@link CustomPage} for other props.
 *
 * @returns A Root Layout or a Root Layout wrapped in the given context.
 */
const Layout: FC<
  { children: ReactNode } & Pick<CustomPage, "fab" | "navType" | "childURLs">
> = ({ children, fab, navType, childURLs }) => {
  // Translation
  const locale = useLocale();
  const { t } = useTranslation("common");

  const refreshProps = useRefreshProps();
  const { colorScheme, setColorScheme, navOpen, setNavOpen } =
    useContext(AppStateContext);

  // Navigation Bar and Drawer
  const router = useRouter();
  const { atBreakpoint } = useBreakpoint();
  const { user } = useUser();
  const homeURL = getHomeURLofRole(user?.role || UserRole.student);

  // Snackbar
  const { snackbarOpen, setSnackbarOpen, snackbarProps } = useSnackbar();

  // Page loading indicator
  const { pageIsLoading } = usePageIsLoading();

  // Dialog control
  const [logOutOpen, setLogOutOpen] = useState<boolean>(false);

  // Preferences
  const { preferences, setPreference } = usePreferences();

  // Detect color scheme
  function setSchemeFromMedia() {
    setColorScheme(
      window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light",
    );
  }
  useEffect(() => {
    if (preferences)
      if (preferences.colorScheme === "auto") {
        setSchemeFromMedia();
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
      setColorScheme(preferences.colorScheme),
    );
    return () => {
      window.removeEventListener("beforeprint", () => setColorScheme("light"));
      window.removeEventListener("afterprint", () =>
        setColorScheme(preferences.colorScheme),
      );
    };
  }, [preferences]);

  return (
    <RootLayout>
      {/* Navigation Drawer */}
      <NavDrawer open={navOpen} onClose={() => setNavOpen(false)}>
        {/* Top-level pages */}
        <NavDrawerSection header={t("appName")}>
          <NavDrawerItem
            icon={<MaterialIcon icon="home" />}
            label={t("navigation.home")}
            selected={router.pathname.startsWith(homeURL)}
            href={homeURL}
            element={Link}
          />
          {user &&
            user.role !== UserRole.management &&
            permitted(user, UserPermissionKey.can_see_management) && (
              <NavDrawerItem
                icon={<MaterialIcon icon="analytics" />}
                label={t("navigation.manage")}
                selected={router.pathname.startsWith("/manage")}
                href="/manage"
                element={Link}
              />
            )}
          <NavDrawerItem
            icon={<MaterialIcon icon="groups" />}
            label={t("navigation.classes")}
            selected={router.pathname.startsWith("/classes")}
            href="/classes"
            element={Link}
          />
          <NavDrawerItem
            icon={<MaterialIcon icon="search" />}
            label={t("navigation.search")}
            selected={
              router.pathname.startsWith("/search") &&
              !(
                router.pathname.startsWith("/search/students") ||
                router.pathname.startsWith("/search/teachers") ||
                router.pathname.startsWith("/search/documents")
              )
            }
            href="/search"
            element={Link}
          />
          <NavDrawerItem
            icon={<MaterialIcon icon="newsmode" />}
            label={t("navigation.news")}
            selected={router.pathname.startsWith("/news")}
            href="/news"
            element={Link}
          />
          {!user ||
            ([UserRole.student, UserRole.teacher].includes(user.role) && (
              <NavDrawerItem
                icon={<MaterialIcon icon="account_circle" />}
                label={t("navigation.account")}
                selected={router.pathname.startsWith("/account")}
                href={atBreakpoint === "base" ? "/account" : "/account/about"}
                element={Link}
              />
            ))}
        </NavDrawerSection>

        {/* Search */}
        <NavDrawerSection header={t("navigation.drawer.search.title")}>
          <NavDrawerItem
            icon={<MaterialIcon icon="face_6" />}
            label={t("navigation.drawer.search.students")}
            selected={router.pathname.startsWith("/search/students")}
            href="/search/students"
            element={Link}
          />
          <NavDrawerItem
            icon={<MaterialIcon icon="support_agent" />}
            label={t("navigation.drawer.search.teachers")}
            selected={router.pathname.startsWith("/search/teachers")}
            href="/search/teachers"
            element={Link}
          />
          <NavDrawerItem
            icon={<MaterialIcon icon="document_scanner" />}
            label={t("navigation.drawer.search.documents")}
            selected={router.pathname.startsWith("/search/documents")}
            href="/search/documents"
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
          {user?.is_admin && (
            <NavDrawerItem
              icon={<MaterialIcon icon="shield_person" />}
              label={t("navigation.drawer.about.admin")}
              selected={router.pathname.startsWith("/admin")}
              href="/admin"
              element={Link}
            />
          )}
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
          <Text
            type="label-small"
            element="p"
            className="p-4 pt-8 !font-display text-on-surface-variant"
          >
            {process.env.NEXT_PUBLIC_VERSION || "Preview version"}
          </Text>
        </NavDrawerSection>
      </NavDrawer>

      {/* Navigation Bar/Rail */}
      {(!navType || navType !== "hidden") && (
        <NavBar
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
                  }`,
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
          locale={locale}
        >
          <NavBarItem
            icon={<Favicon />}
            label={t("appName")}
            selected={router.pathname.startsWith(homeURL)}
            href={homeURL}
            element={Link}
          />
          {user &&
            user.role !== UserRole.management &&
            permitted(user, UserPermissionKey.can_see_management) && (
              <NavBarItem
                icon={<MaterialIcon icon="analytics" />}
                label={t("navigation.manage")}
                selected={router.pathname.startsWith("/manage")}
                railOnly
                href="/manage"
                element={Link}
              />
            )}
          <NavBarItem
            icon={<MaterialIcon icon="groups" />}
            label={t("navigation.classes")}
            selected={router.pathname.startsWith("/classes")}
            href="/classes"
            element={Link}
          />
          <NavBarItem
            icon={<MaterialIcon icon="search" />}
            label={t("navigation.search")}
            selected={router.pathname.startsWith("/search")}
            href="/search"
            element={Link}
          />
          <NavBarItem
            icon={<MaterialIcon icon="newsmode" />}
            label={t("navigation.news")}
            selected={router.pathname.startsWith("/news")}
            href="/news"
            element={Link}
          />
          {!user ||
            ([UserRole.student, UserRole.teacher].includes(user.role) && (
              <NavBarItem
                icon={<MaterialIcon icon="account_circle" />}
                label={t("navigation.account")}
                selected={router.pathname.startsWith("/account")}
                href={atBreakpoint === "base" ? "/account" : "/account/about"}
                element={Link}
              />
            ))}
        </NavBar>
      )}

      {/* Log out Dialog */}
      <LogOutDialog open={logOutOpen} onClose={() => setLogOutOpen(false)} />

      {/* Page loading indicator */}
      <Progress
        appearance="linear"
        alt={t("pageIsLoading")}
        visible={pageIsLoading}
        className="!z-[100]"
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
