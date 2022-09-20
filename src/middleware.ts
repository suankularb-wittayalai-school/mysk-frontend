// (@SiravitPhokeed)
// ESLint is throwing a possibly outdated error on middleware.ts placement.
// Its advice does not match that of NextJS, and I think you know which is more
// important to follow.
// For now, I’m disabling the rule for this page.

/* eslint-disable @next/next/no-server-import-in-page */

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
    ["/", "/account/login", "/about"].includes(route)
      ? "public"
      : // Admin pages
      /^\/admin/.test(route)
      ? "admin"
      : // Student pages
      route.startsWith("/s/") ||
        /^\/(learn|news\/form\/\d+|class\/\d{3}\/(view|students|teachers|schedule))/.test(
          route
        )
      ? "student"
      : // Teacher pages
      route.startsWith("/t/") || /^\/(teach|class\/\d{3}\/manage)/.test(route)
      ? "teacher"
      : // User pages
      /^\/(news|account)/.test(route)
      ? "user"
      : // Fallback (images, icons, manifest, etc.)
        "not-protected";

  // Ignore page without protection
  if (pageRole == "not-protected") return NextResponse.next();

  // (@SiravitPhokeed)
  // I’m not using the obvious `supabase.auth.api.getUserByCookie(req)` here
  // because NextJS Middleware is so new that that isn’t supported here yet!
  // As a workaround, we’re fetching directly from the Supabase API.

  // Fetch user from Supabase
  const user = await (
    await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/user`, {
      headers: {
        Authorization: `Bearer ${req.cookies.get("sb-access-token")}`,
        APIKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
      },
    })
  ).json();

  // Intepret user metada
  const userRole: Role | "public" = user?.user_metadata?.role || "public";
  const userIsAdmin: boolean = user?.user_metadata?.isAdmin;

  // Decide on destination based on user and page protection type
  let destination: string | null = null;

  // Disallow public users from visiting private pages
  if (pageRole != "public" && userRole == "public")
    destination = "/account/login";
  else if (
    // Disllow non-admins from visiting admin pages
    (pageRole == "admin" && !userIsAdmin) ||
    !(
      // Allow all users to visit user pages
      // Allow users with the correct roles
      (pageRole == "user" || pageRole == userRole)
    )
  ) {
    // Set destinations for students and teachers in the wrong pages
    if (userRole == "student") destination = "/learn";
    else if (userRole == "teacher") destination = "/teach";
  }

  // Redirect if decided so, continue if not
  // Note: While developing, comment out line 84 if you want to test protected
  // pages via IPv4. Pages using user data will not work, however.
  if (destination) return NextResponse.redirect(new URL(destination, req.url));
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/account/:path",
    "/about",
    "/learn",
    "/teach",
    "/class/:id/:path*",
    "/s/:path*",
    "/t/:path*",
    "/news",
    "/news/stats/:id",
    "/news/form/:id",
    "/news/payment/:id",
  ],
};
