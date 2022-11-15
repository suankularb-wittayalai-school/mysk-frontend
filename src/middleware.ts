// External libraries
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { createMiddlewareSupabaseClient } from "@supabase/auth-helpers-nextjs";

// Types
import { Role } from "@utils/types/person";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

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
  // console.log(pageRole);

  // Ignore page without protection
  if (pageRole == "not-protected") return res;

  // Declare Supabase client
  const supabase = createMiddlewareSupabaseClient({ req, res });

  // Get current session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Get user metadata
  const { data: user } = await supabase
    .from("users")
    .select("role, onboarded, is_admin")
    .match({ id: session?.user.id })
    .limit(1)
    .maybeSingle();

  // Intepret user metadata
  const userRole: Role | "public" = user ? JSON.parse(user.role) : "public";
  const userIsOnboarded: boolean = user ? user.onboarded : false;
  const userIsAdmin: boolean = user ? user.is_admin : false;

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
  // Allow all users to visit user pages
  // Allow users with the correct roles
  else if (!(pageRole == "user" || pageRole == userRole)) {
    if (pageRole != "admin" || !userIsAdmin) {
      // Set destinations for students and teachers in the wrong pages
      if (userRole == "student") destination = "/learn";
      else if (userRole == "teacher") destination = "/teach";
    }
  }

  // Redirect if decided so, continue if not
  // Note: While developing, comment out line 114 if you want to test protected
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

