// External libraries
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";

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
import RailLogo from "@/components/brand/RailLogo";

// Backend
import { getUserMetadata } from "@/utils/backend/account";
import { getClassOfStudent } from "@/utils/backend/person/student";
import { getClassAdvisorAt } from "@/utils/backend/person/teacher";

// Contexts
import NavDrawerContext from "@/contexts/NavDrawerContext";

// Hooks
import { useLocale } from "@/utils/hooks/i18n";
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

  // Navigation Bar and Drawer
  const router = useRouter();
  const { navOpen, setNavOpen } = useContext(NavDrawerContext);

  // Class data (for Navigation links)
  const supabase = useSupabaseClient();
  const user = useUser();
  const [userMetadata, setUserMetadata] = useState<UserMetadata | null>();
  const [classNumber, setClassNumber] = useState<number | null>();
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
    })();
  }, [user]);

  // Snackbar
  const { snackbarOpen, setSnackbarOpen, snackbarProps } = useSnackbar();

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
          {navType === "student" || (navType === "teacher" && classNumber) ? (
            <NavDrawerItem
              icon={<MaterialIcon icon="groups" />}
              label={t("navigation.class")}
              selected={router.pathname.startsWith("/class")}
              href={`/class/${classNumber}/overview`}
              element={Link}
            />
          ) : (
            <></>
          )}
          <NavDrawerItem
            icon={<MaterialIcon icon="search" />}
            label={t("navigation.lookup")}
            selected={
              router.pathname.startsWith("/lookup") &&
              !(
                router.pathname.startsWith("/lookup/students") ||
                router.pathname.startsWith("/lookup/teachers") ||
                router.pathname.startsWith("/lookup/orders") ||
                router.pathname.startsWith("/lookup/documents")
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
            icon={<MaterialIcon icon="groups" />}
            label={t("navigation.drawer.lookup.students")}
            selected={router.pathname.startsWith("/lookup/students")}
            href="/lookup/students"
            element={Link}
          />
          <NavDrawerItem
            icon={<MaterialIcon icon="group" />}
            label={t("navigation.drawer.lookup.teachers")}
            selected={router.pathname.startsWith("/lookup/teachers")}
            href="/lookup/teachers"
            element={Link}
          />
          {userMetadata?.role === "teacher" || navType === "teacher" ? (
            <NavDrawerItem
              icon={<MaterialIcon icon="mail" />}
              label={t("navigation.drawer.lookup.orders")}
              selected={router.pathname.startsWith("/lookup/orders")}
              href="/lookup/orders"
              element={Link}
            />
          ) : (
            <></>
          )}
          <NavDrawerItem
            icon={<MaterialIcon icon="description" />}
            label={t("navigation.drawer.lookup.documents")}
            selected={router.pathname.startsWith("/lookup/documents")}
            href="/lookup/documents"
            element={Link}
          />
        </NavDrawerSection>

        {/* About */}
        <NavDrawerSection header={t("navigation.drawer.about.title")}>
          <NavDrawerItem
            icon={<MaterialIcon icon="contact_support" />}
            label={t("navigation.drawer.about.help")}
            selected={router.pathname.startsWith("/help")}
            href="/help"
            element={Link}
          />
          <NavDrawerItem
            icon={<MaterialIcon icon="translate" />}
            label={t("navigation.drawer.about.language")}
            href={router.asPath}
            // eslint-disable-next-line react/display-name
            element={forwardRef((props, ref) => (
              <Link
                locale={locale == "en-US" ? "th" : "en-US"}
                onClick={() =>
                  localStorage.setItem(
                    "preferredLang",
                    locale == "en-US" ? "th" : "en-US"
                  )
                }
                {...{ ...props, ref }}
              />
            ))}
          />
          <NavDrawerItem
            icon={<MaterialIcon icon="logout" />}
            label={t("navigation.drawer.about.logOut")}
            href="/account/logout"
            element={Link}
          />
        </NavDrawerSection>
      </NavDrawer>

      {/* Navigation Bar/Rail */}
      {(!navType || navType !== "hidden") && (
        <NavBar
          brand={<RailLogo />}
          fab={fab}
          end={
            <>
              <NavBarItem
                icon={<MaterialIcon icon="translate" />}
                label={t("navigation.language")}
                href={router.asPath}
                element={(props) => (
                  <Link
                    locale={locale == "en-US" ? "th" : "en-US"}
                    onClick={() =>
                      localStorage.setItem(
                        "preferredLang",
                        locale == "en-US" ? "th" : "en-US"
                      )
                    }
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
          {userMetadata?.role === "teacher" || navType === "teacher" ? (
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
          {(!navType ||
            navType === "student" ||
            (navType === "teacher" && classNumber)) && (
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
      )}

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
