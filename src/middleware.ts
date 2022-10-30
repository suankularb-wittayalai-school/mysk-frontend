// External libraries
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Types
import { Role } from "@utils/types/person";

export async function middleware(req: NextRequest) {
  // Get current page protection type
  const route = req.nextUrl.pathname;
  const pageRole: Role | "public" | "admin" | "user" | "not-protected" =
    // Public pages
    route == "/" || /^\/(account\/(login|forgot\-password)|about)/.test(route)
      ? "public"
      : // Admin pages
      /^\/admin/.test(route)
      ? "admin"
      : // Student pages
      /^\/(learn|news\/form\/\d+|class\/\d{3}\/(view|students|teachers|schedule))/.test(
          route
        )
      ? "student"
      : // Teacher pages
      /^\/(teach|class\/\d{3}\/manage)/.test(route)
      ? "teacher"
      : // User pages
      /^\/(news|account)/.test(route)
      ? "user"
      : // Fallback (images, icons, manifest, etc.)
        "not-protected";

  // Ignore page without protection
  if (pageRole == "not-protected") return NextResponse.next();

  // (@SiravitPhokeed)
  // I’m not using the Supabase Server Client because that isn’t supported here.
  // The way we're approaching middleware is very much not intended by Supabase.
  // As a workaround, we’re fetching directly from the Supabase API.

  // Fetch user from Supabase
  let user = null;
  const authCookie = req.cookies.get("supabase-auth-token");
  if (authCookie)
    user = await (
      await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/user`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(authCookie).access_token}`,
          APIKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
        },
      })
    ).json();

  // Intepret user metadata
  const userRole: Role | "public" = user?.user_metadata?.role || "public";
  const userIsOnboarded: boolean = user?.user_metadata?.onboarded;
  const userIsAdmin: boolean = user?.user_metadata?.isAdmin;

  // Decide on destination based on user and page protection type
  let destination: string | null = null;

  // Disallow public users from visiting private pages
  if (pageRole != "public" && userRole == "public")
    destination = "/account/login";
  // Disallow logged in users who haven’t been onboarded from visiting any
  // other pages from Welcome
  else if (userRole != "public" && !userIsOnboarded) destination = "/welcome";
  // Disallow logged in users from visiting certain pages under certain
  // circumstances
  // prettier-ignore
  else if (
    !(
      (
        // Allow new users to visit Welcome
        (route == "/welcome" && !userIsOnboarded) ||
        // Allow admins to visit admin pages
        (pageRole == "admin" && userIsAdmin) ||
        // Allow all users to visit user pages
        pageRole == "user" ||
        // Allow users with the correct roles
        pageRole == userRole
      )
    )
  ) {
    // Set destinations for students and teachers in the wrong pages
    if (userRole == "student") destination = "/learn";
    else if (userRole == "teacher") destination = "/teach";
  }

  // Redirect if decided so, continue if not
  // Note: While developing, comment out line 89 if you want to test protected
  // pages via IPv4. Pages using user data will not work, however.
  if (destination) return NextResponse.redirect(new URL(destination, req.url));
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/welcome",
    "/account",
    "/account/:path*",
    "/about",
    "/admin/:path*",
    "/learn",
    "/learn/:id",
    "/teach",
    "/class/:id/:path*",
    "/news",
    "/news/stats/:id",
    "/news/form/:id",
    "/news/payment/:id",
  ],
};
