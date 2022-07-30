// (@SiravitPhokeed)
// ESLint is throwing a possibly outdated error on middleware.ts placement.
// Its advice does not match of that NextJS, and I think you know which is more
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
  const pageRole: Role | "public" | "admin" | "not-protected" =
    // Public pages
    ["/", "/account/login", "/about"].includes(route)
      ? "public"
      : // Admin pages
      route.startsWith("/t/admin/")
      ? "admin"
      : // Student pages
      route.startsWith("/s/") || route.startsWith("/news/form/")
      ? "student"
      : // Teacher pages
      route.startsWith("/t/")
      ? "teacher"
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
  // Disallow non-admins from visiting admin pages
  else if ((pageRole == "admin" && userIsAdmin) || pageRole == userRole)
    return NextResponse.next();
  // Set destinations for students and teachers in the wrong pages
  else if (userRole == "student") destination = "/s/home";
  else if (userRole == "teacher") destination = "/t/home";

  // Redirect if decided so, continue if not
  // Note: While developing, comment out line 73 if you want to test protected
  // pages via IPv4. Pages using user data will not work, however.
  if (destination) return NextResponse.redirect(new URL(destination, req.url));
  return NextResponse.next();
}
