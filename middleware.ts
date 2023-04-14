// External libraries
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { createMiddlewareSupabaseClient } from "@supabase/auth-helpers-nextjs";

// Helpers
import { getLocalePath } from "@/utils/helpers/i18n";

// Types
import { LangCode } from "@/utils/types/common";
import { Role } from "@/utils/types/person";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Get original destination
  const route = req.nextUrl.pathname;
  const locale = req.nextUrl.locale as LangCode;

  // Get current page protection type
  const pageRole: Role | "public" | "admin" | "user" =
    route === "/"
      ? "public"
      : /^\/news\/(info|form)\/(create|(\d+\/edit))/.test(route)
      ? "admin"
      : /^\/learn/.test(route)
      ? "student"
      : /^\/(teach|class\/\d{3}\/form\/\d+)/.test(route)
      ? "teacher"
      : "user";

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
  const userIsAdmin: boolean = user ? user.is_admin : false;
  const userIsOnboarded: boolean = user ? user.onboarded : false;

  // Decide on destination based on user and page protection type
  let destination: string | null = null;

  // Disallow public users from visiting private pages
  if (pageRole !== "public" && userRole === "public") destination = "/";
  // Disallow students from vising the Your Subject page of the onboarding
  // process
  else if (route === "/account/welcome/your-subjects" && userRole === "student")
    destination = "/account/welcome/covid-19-safety";
  // Disallow logged in users from visiting certain pages under certain
  // circumstances
  // prettier-ignore
  else if (
    !(
      (
        // Allow new users to visit onboarding pages
        (route.startsWith("/account/welcome") && !userIsOnboarded) ||
        // Allow admins to visit admin pages
        (pageRole === "admin" && userIsAdmin) ||
        // Allow all users to visit user pages
        pageRole === "user" ||
        // Allow users with the correct roles
        pageRole === userRole
      )
    )
  ) {
    // Set destinations for students and teachers in the wrong pages
    if (userRole === "student") destination = "/learn";
    else if (userRole === "teacher") destination = "/teach";
  }
  // Allow all users to visit user pages
  // Allow users with the correct roles
  else if (!(pageRole === "user" || pageRole === userRole)) {
    if (pageRole != "admin" || !userIsAdmin) {
      // Set destinations for students and teachers in the wrong pages
      if (userRole === "student") destination = "/learn";
      else if (userRole === "teacher") destination = "/teach";
    }
  }

  // Redirect if decided so, continue if not
  if (destination)
    return NextResponse.redirect(
      new URL(getLocalePath(destination, locale), req.url)
    );
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/account",
    "/account/:path*",
    "/about",
    "/learn",
    "/learn/:id",
    "/teach",
    "/class/:path*",
    "/lookup/:path*",
    "/news",
    "/news/stats/:id",
    "/news/form/:id",
    "/news/payment/:id",
  ],
};
